const express = require('express');
const passport = require('passport');
const generateToken = require('../utils/generateToken');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register, login, adminLogin, getMe, updateProfile, updatePassword,
  addAddress, updateAddress, deleteAddress, toggleWishlist
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);
// OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    let clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    // Ensure clientUrl is absolute to prevent relative redirect issues
    if (!clientUrl.startsWith('http')) {
      clientUrl = `https://${clientUrl}`;
    }
    
    res.redirect(`${clientUrl}/login?token=${token}`);
  }
);

module.exports = router;
