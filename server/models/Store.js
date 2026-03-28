const mongoose = require('mongoose');

const storeRatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const storeSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Store name is required'], trim: true },
  slug: { type: String, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  category: { type: String, default: 'General' },
  rating: { type: Number, default: 0 },
  numRatings: { type: Number, default: 0 },
  ratings: [storeRatingSchema],
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  totalProducts: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

storeSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

storeSchema.index({ name: 'text', description: 'text' });
storeSchema.index({ owner: 1 });
storeSchema.index({ slug: 1 });

module.exports = mongoose.model('Store', storeSchema);
