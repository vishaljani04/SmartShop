const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: { type: Number, required: [true, 'Discount is required'], min: 0 },
  type: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  expiry: { type: Date, required: [true, 'Expiry date is required'] },
  minAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  maxUses: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

couponSchema.methods.isValid = function (cartTotal) {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (this.expiry < new Date()) return { valid: false, message: 'Coupon has expired' };
  if (this.maxUses > 0 && this.usedCount >= this.maxUses) return { valid: false, message: 'Coupon usage limit reached' };
  if (cartTotal < this.minAmount) return { valid: false, message: `Minimum order amount is ₹${this.minAmount}` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (cartTotal) {
  let discountAmount = this.type === 'percentage'
    ? (cartTotal * this.discount) / 100
    : this.discount;
  if (this.maxDiscount > 0 && discountAmount > this.maxDiscount) {
    discountAmount = this.maxDiscount;
  }
  return Math.round(discountAmount);
};

module.exports = mongoose.model('Coupon', couponSchema);
