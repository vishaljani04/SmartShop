const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getDashboard, getUsers, updateUserRole,
  getStores, updateStoreStatus,
  getAdminOrders, updateOrderStatus, processRefund,
  getCategories, createCategory, updateCategory, deleteCategory,
  getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon,
  getProducts, getReviews, deleteReview
} = require('../controllers/adminController');

// Auth bypassed for easier admin management
router.use((req, res, next) => {
  req.user = { _id: 'admin-bypass', role: 'admin', name: 'Super Admin', email: 'admin@smartshop.com' };
  next();
});

router.get('/dashboard', getDashboard);

// Products & Reviews
router.get('/products', getProducts);
router.get('/reviews', getReviews);
router.delete('/reviews/:productId/:reviewId', deleteReview);

// Users
router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);

// Stores
router.get('/stores', getStores);
router.put('/stores/:id', updateStoreStatus);

// Orders
router.get('/orders', getAdminOrders);
router.put('/orders/:id', updateOrderStatus);
router.post('/orders/:id/refund', processRefund);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.post('/coupons/validate', validateCoupon);

module.exports = router;
