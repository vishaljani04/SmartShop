const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { getRedis } = require('../config/redis');

const CART_TTL = 60 * 60 * 24 * 7; // 7 days
const getCartKey = (userId) => `cart:${userId}`;

// @desc    Get cart
// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const redis = getRedis();

    // Try Redis first
    if (redis && redis.status === 'ready') {
      const cached = await redis.get(getCartKey(req.user._id));
      if (cached) {
        const cart = JSON.parse(cached);
        return res.json({ success: true, cart });
      }
    }

    // Fallback to DB
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price discountPrice images stock');

    if (!cart) {
      cart = { items: [] };
    }

    // Cache in Redis
    if (redis && redis.status === 'ready') {
      await redis.setex(getCartKey(req.user._id), CART_TTL, JSON.stringify(cart));
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to cart
// @route   POST /api/cart/add
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant } = req.body;
    const redis = getRedis();

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.storeOwner?.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot buy your own product' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item =>
      item.product.toString() === productId &&
      (!variant || (item.variant?.size === variant?.size && item.variant?.color === variant?.color))
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, variant });
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price discountPrice images stock');

    // Update Redis cache
    if (redis && redis.status === 'ready') {
      await redis.setex(getCartKey(req.user._id), CART_TTL, JSON.stringify(cart));
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/update
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity, variant } = req.body;
    const redis = getRedis();

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(item =>
      item.product.toString() === productId &&
      (!variant || (item.variant?.size === variant?.size && item.variant?.color === variant?.color))
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    const product = await Product.findById(productId);
    if (product.storeOwner?.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot buy your own product' });
    }
    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Not enough stock' });
    }

    item.quantity = quantity;
    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price discountPrice images stock');

    if (redis && redis.status === 'ready') {
      await redis.setex(getCartKey(req.user._id), CART_TTL, JSON.stringify(cart));
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/remove
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId, variant } = req.body;
    const redis = getRedis();

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => {
      if (item.product.toString() !== productId) return true;
      if (variant && (item.variant?.size !== variant?.size || item.variant?.color !== variant?.color)) return true;
      return false;
    });

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price discountPrice images stock');

    if (redis && redis.status === 'ready') {
      await redis.setex(getCartKey(req.user._id), CART_TTL, JSON.stringify(cart));
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
exports.clearCart = async (req, res, next) => {
  try {
    const redis = getRedis();
    await Cart.findOneAndDelete({ user: req.user._id });

    if (redis && redis.status === 'ready') {
      await redis.del(getCartKey(req.user._id));
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
