const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder, verifyPayment, razorpayWebhook, getUserOrders, getOrder
} = require('../controllers/orderController');

router.post('/create', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/webhook', razorpayWebhook);
router.get('/user', protect, getUserOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
