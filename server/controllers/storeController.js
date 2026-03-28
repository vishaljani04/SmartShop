const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create store
// @route   POST /api/store
const createStore = async (req, res) => {
  try {
    const existing = await Store.findOne({ owner: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You already have a store' });

    const store = await Store.create({ ...req.body, owner: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { store: store._id });

    res.status(201).json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my store
// @route   GET /api/store/my-store
const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found. Please create one.' });
    res.json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update my store
// @route   PUT /api/store/my-store
const updateMyStore = async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate({ owner: req.user._id }, req.body, { new: true, runValidators: true });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
    res.json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Store dashboard stats
// @route   GET /api/store/dashboard
const getStoreDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const totalProducts = await Product.countDocuments({ store: store._id, isActive: true });
    const orders = await Order.find({ 'items.store': store._id }).sort('-createdAt');

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => {
        const storeItems = o.items.filter(i => i.store?.toString() === store._id.toString());
        return sum + storeItems.reduce((s, i) => s + i.price * i.quantity, 0);
      }, 0);

    const recentOrders = await Order.find({ 'items.store': store._id })
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    // Monthly sales
    const monthlySales = await Order.aggregate([
      { $match: { 'items.store': store._id, paymentStatus: 'paid' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 6 }
    ]);

    // Low stock products
    const lowStock = await Product.find({ store: store._id, stock: { $lt: 10 }, isActive: true })
      .select('title stock price images')
      .sort({ stock: 1 })
      .limit(5);

    await Store.findByIdAndUpdate(store._id, { totalProducts, totalSales: totalOrders, totalRevenue });

    res.json({
      success: true,
      stats: {
        totalProducts, totalOrders, totalRevenue,
        rating: store.rating, numRatings: store.numRatings,
        storeName: store.name, storeLogo: store.logo,
        isVerified: store.isVerified,
        recentOrders, monthlySales, lowStock
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get store products
// @route   GET /api/store/products
const getStoreProducts = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const query = { store: store._id };
    if (req.query.search) query.title = { $regex: req.query.search, $options: 'i' };

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({ success: true, products, pagination: { page, pages: Math.ceil(total / limit), total } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product to store
// @route   POST /api/store/products
const addProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Create a store first' });

    const product = await Product.create({ ...req.body, store: store._id, storeOwner: req.user._id });
    await Store.findByIdAndUpdate(store._id, { $inc: { totalProducts: 1 } });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update store product
// @route   PUT /api/store/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, storeOwner: req.user._id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or not yours' });

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete store product
// @route   DELETE /api/store/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, storeOwner: req.user._id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or not yours' });

    const store = await Store.findOne({ owner: req.user._id });
    if (store) await Store.findByIdAndUpdate(store._id, { $inc: { totalProducts: -1 } });

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get store orders
// @route   GET /api/store/orders
const getStoreOrders = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const query = { 'items.store': store._id };
    if (req.query.status) query.orderStatus = req.query.status;

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({ success: true, orders, pagination: { page, pages: Math.ceil(total / limit), total } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (store owner)
// @route   PUT /api/store/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const store = await Store.findOne({ owner: req.user._id });
    const hasStoreItems = order.items.some(i => i.store?.toString() === store?._id.toString());
    if (!hasStoreItems) return res.status(403).json({ success: false, message: 'Not your order' });

    order.orderStatus = req.body.orderStatus;
    if (req.body.orderStatus === 'delivered') order.deliveredAt = Date.now();
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get store earnings
// @route   GET /api/store/earnings
const getStoreEarnings = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const paidOrders = await Order.find({ 'items.store': store._id, paymentStatus: 'paid' });

    let totalEarnings = 0;
    const earningsByMonth = {};

    paidOrders.forEach(order => {
      const storeItems = order.items.filter(i => i.store?.toString() === store._id.toString());
      const orderEarning = storeItems.reduce((s, i) => s + i.price * i.quantity, 0);
      totalEarnings += orderEarning;

      const month = order.createdAt.toISOString().slice(0, 7);
      earningsByMonth[month] = (earningsByMonth[month] || 0) + orderEarning;
    });

    res.json({
      success: true,
      earnings: {
        total: totalEarnings,
        totalOrders: paidOrders.length,
        monthly: Object.entries(earningsByMonth).map(([month, amount]) => ({ month, amount })).sort((a, b) => b.month.localeCompare(a.month))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rate a store (by customer)
// @route   POST /api/store/:storeId/rate
const rateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const existing = store.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existing) {
      existing.rating = req.body.rating;
      existing.comment = req.body.comment;
    } else {
      store.ratings.push({ user: req.user._id, name: req.user.name, rating: req.body.rating, comment: req.body.comment });
    }

    store.numRatings = store.ratings.length;
    store.rating = store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.numRatings;
    await store.save();

    res.json({ success: true, store: { rating: store.rating, numRatings: store.numRatings } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get store public profile
// @route   GET /api/store/:storeId/profile
const getStoreProfile = async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId).select('-ratings');
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const products = await Product.find({ store: store._id, isActive: true })
      .populate('category', 'name')
      .sort('-createdAt')
      .limit(20);

    res.json({ success: true, store, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStore, getMyStore, updateMyStore, getStoreDashboard,
  getStoreProducts, addProduct, updateProduct, deleteProduct,
  getStoreOrders, updateOrderStatus, getStoreEarnings,
  rateStore, getStoreProfile
};
