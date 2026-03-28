require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Store = require('./models/Store');
const Category = require('./models/Category');

const dbUri = process.env.MONGO_URI;

const seedVerificationProduct = async () => {
  try {
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    // Find a category and store owner
    const category = await Category.findOne({});
    const owner = await User.findOne({ role: 'storeOwner' });
    const store = await Store.findOne({ owner: owner._id });

    if (!category || !owner || !store) {
      console.error('Environment not ready for seeding. Missing category or owner.');
      process.exit(1);
    }

    // Create a product with a NEW global partner "GalaxyTech"
    const p = await Product.create({
      title: "Dynamic Partner Test Product",
      description: "This product belongs to GalaxyTech, which should now show up automatically in Global partners.",
      price: 500,
      stock: 10,
      category: category._id,
      brand: 'GalaxyTech',
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop'],
      store: store._id,
      storeOwner: owner._id,
      globalPartner: 'GalaxyTech',
      isActive: true,
      isFeatured: true
    });

    console.log('Successfully added product with "GalaxyTech" partner.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding verification data:', error);
    process.exit(1);
  }
};

seedVerificationProduct();
