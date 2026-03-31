const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Store = require('../models/Store');

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      totalUsers, totalStoreOwners, totalStores, totalProducts, totalOrders,
      salesResult, recentOrders, monthlySales, statusDistribution, lowStock, topStores
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'storeOwner' }),
      Store.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email'),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
      ]),
      Product.find({ stock: { $lte: 10 }, isActive: true })
        .select('title stock price')
        .sort({ stock: 1 })
        .limit(10),
      Store.find({ isActive: true })
        .sort({ totalRevenue: -1 })
        .limit(5)
        .select('name logo rating totalRevenue totalProducts owner')
        .populate('owner', 'name email')
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalUsers, totalStoreOwners, totalStores, totalProducts,
        totalOrders, totalSales, recentOrders, monthlySales,
        statusDistribution, lowStock, topStores
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .populate('store', 'name rating isActive isVerified')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      users,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stores (Admin)
exports.getStores = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await Store.countDocuments(query);
    const stores = await Store.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      stores,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle store active/verified (Admin)
exports.updateStoreStatus = async (req, res, next) => {
  try {
    const { isActive, isVerified } = req.body;
    const update = {};
    if (typeof isActive === 'boolean') update.isActive = isActive;
    if (typeof isVerified === 'boolean') update.isVerified = isVerified;

    const store = await Store.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('owner', 'name email');
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    res.json({ success: true, store });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
exports.getAdminOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    let query = {};
    if (status) query.orderStatus = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'name email');

    res.json({
      success: true,
      orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (orderStatus === 'delivered') update.deliveredAt = Date.now();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund (Admin)
exports.processRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.paymentStatus = 'refunded';
    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ success: true, order, message: 'Refund processed, stock restored' });
  } catch (error) {
    next(error);
  }
};

// CRUD Categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) { next(error); }
};

// CRUD Coupons
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) { next(error); }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) { next(error); }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, coupon });
  } catch (error) { next(error); }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) { next(error); }
};

// Validate coupon
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    const validation = coupon.isValid(cartTotal);
    if (!validation.valid) return res.status(400).json({ success: false, message: validation.message });

    const discountAmount = coupon.calculateDiscount(cartTotal);
    res.json({ success: true, coupon: { code: coupon.code, discount: coupon.discount, type: coupon.type }, discountAmount });
  } catch (error) { next(error); }
};

// @desc    Get all products (Admin - seeing everything including unapproved/store products)
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('store', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) { next(error); }
};

// @desc    Get all reviews/comments across all products (Admin)
exports.getReviews = async (req, res, next) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } }).select('title reviews');
    let allReviews = [];
    products.forEach(p => {
      p.reviews.forEach(r => {
        allReviews.push({
          _id: r._id,
          productId: p._id,
          productTitle: p.title,
          user: r.user,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt
        });
      });
    });
    // Sort by newest
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, reviews: allReviews });
  } catch (error) { next(error); }
};

// @desc    Delete a specific review (Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.length > 0 
      ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length 
      : 0;
      
    await product.save();
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) { next(error); }
};
