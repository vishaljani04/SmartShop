const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const variantSchema = new mongoose.Schema({
  size: { type: String },
  color: { type: String },
  stock: { type: Number, default: 0 },
  price: { type: Number },
  sku: { type: String }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Product title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'] },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  discountPrice: { type: Number, default: 0, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  variants: [variantSchema],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  globalPartner: { 
    type: String, 
    enum: ['None', 'Amazon', 'Flipkart', 'Myntra', 'Reliance Digital', 'Croma', 'Tata CLiQ', 'Ajio', 'Jiomart'], 
    default: 'None' 
  },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  storeOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ store: 1 });
productSchema.index({ storeOwner: 1 });

module.exports = mongoose.model('Product', productSchema);
