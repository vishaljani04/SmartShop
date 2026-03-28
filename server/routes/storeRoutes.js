const express = require('express');
const router = express.Router();
const { protect, storeOwner } = require('../middleware/auth');
const {
  createStore, getMyStore, updateMyStore, getStoreDashboard,
  getStoreProducts, addProduct, updateProduct, deleteProduct,
  getStoreOrders, updateOrderStatus, getStoreEarnings,
  rateStore, getStoreProfile
} = require('../controllers/storeController');

// Public routes
router.get('/:storeId/profile', getStoreProfile);
router.post('/:storeId/rate', protect, rateStore);

// Store owner routes
router.use(protect, storeOwner);
router.post('/', createStore);
router.get('/my-store', getMyStore);
router.put('/my-store', updateMyStore);
router.get('/dashboard', getStoreDashboard);
router.get('/products', getStoreProducts);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getStoreOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/earnings', getStoreEarnings);

module.exports = router;
