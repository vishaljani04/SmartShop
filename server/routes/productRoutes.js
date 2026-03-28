const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getProducts, getProduct, getRelatedProducts,
  createProduct, updateProduct, deleteProduct, addReview, getGlobalPartners
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/global-partners', getGlobalPartners);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
