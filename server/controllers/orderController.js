const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { getRedis } = require('../config/redis');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/orders/create
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product ${product?.title || 'unknown'} is unavailable` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.title}` });
      }

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images[0] || '',
        price,
        quantity: item.quantity,
        variant: item.variant,
        store: product.store,
        storeOwner: product.storeOwner
      });
    }

    // Apply coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const validation = coupon.isValid(subtotal);
        if (validation.valid) {
          discountAmount = coupon.calculateDiscount(subtotal);
        }
      }
    }

    const shippingAmount = subtotal > 500 ? 0 : 50;
    const taxAmount = Math.round((subtotal - discountAmount) * 0.18);
    const totalAmount = subtotal - discountAmount + shippingAmount + taxAmount;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: { userId: req.user._id.toString() }
    });

    // Create order in DB with pending status
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      taxAmount,
      shippingAmount,
      discountAmount,
      razorpayOrderId: razorpayOrder.id,
      shippingAddress,
      couponApplied: couponCode || null,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });

    res.status(201).json({
      success: true,
      order: {
        _id: order._id,
        totalAmount,
        razorpayOrderId: razorpayOrder.id,
        currency: 'INR',
        amount: razorpayOrder.amount
      },
      razorpayKey: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/orders/verify-payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update order
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    await order.save();

    // Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Update coupon usage
    if (order.couponApplied) {
      await Coupon.findOneAndUpdate(
        { code: order.couponApplied },
        { $inc: { usedCount: 1 } }
      );
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: order.user });
    const redis = getRedis();
    if (redis && redis.status === 'ready') {
      await redis.del(`cart:${order.user}`);
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Razorpay webhook
// @route   POST /api/orders/webhook
exports.razorpayWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.rawBody || JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment?.entity;

    if (event === 'payment.captured') {
      const order = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (order && order.paymentStatus !== 'paid') {
        order.razorpayPaymentId = payment.id;
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        await order.save();

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
          });
        }
      }
    } else if (event === 'payment.failed') {
      const order = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title images');

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'title images price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
