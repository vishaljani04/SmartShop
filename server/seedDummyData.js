require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Store = require('./models/Store');
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const dbUri = process.env.MONGO_URI;

const categories = [
  { name: 'Electronics', description: 'Gadgets and gear' },
  { name: 'Fashion', description: 'Trendy apparel' },
  { name: 'Home & Living', description: 'Decor and furniture' }
];

const seedUIItems = async () => {
  try {
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for UI seeding...');

    console.log('Wiping existing data...');
    await User.deleteMany({});
    await Store.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log('Database wiped successfully.');

    // 1. Create Categories
    const insertedCats = [];
    for (const c of categories) {
        let cat = await Category.create(c);
        insertedCats.push(cat);
    }
    const electronicsId = insertedCats.find(c => c.name === 'Electronics')._id;

    // 2. Create Admin
    await User.create({ 
      name: 'Super Admin', 
      email: 'admin@smartshop.com', 
      password: 'admin123', 
      role: 'admin' 
    });
    console.log('Admin user created.');

    // 3. Create Normal User
    await User.create({ 
      name: 'Normal User', 
      email: 'user1@smartshop.com', 
      password: 'password123', 
      role: 'user' 
    });
    console.log('Normal User created.');

    // 4. Create Store Owner
    const storeOwner1 = await User.create({ name: 'Premium Tech Store', email: 'owner@smartshop.com', password: 'password123', role: 'storeOwner' });
    const store1 = await Store.create({ 
        name: 'The Premium Tech Hub', slug: 'premium-tech-hub',
        description: 'Your one-stop shop for premium gadgets and electronics.', owner: storeOwner1._id, status: 'approved', isActive: true, isVerified: true
    });
    console.log('Store owner and store created.');

    // 5. Create 10 Distinct Products
    const productsData = [
      {
        title: "Sony WH-1000XM5 Wireless Headphones",
        description: "Industry leading noise canceling with two processors control 8 microphones for unprecedented noise cancellation.",
        price: 29990, discountPrice: 26990, stock: 15, rating: 4.8, brand: "Sony",
        images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop"]
      },
      {
        title: "Apple MacBook Air M3",
        description: "Supercharged by M3, the MacBook Air is super portable and delivers up to 18 hours of battery life.",
        price: 114900, discountPrice: 104900, stock: 8, rating: 4.9, brand: "Apple",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop"]
      },
      {
        title: "Samsung Galaxy S24 Ultra",
        description: "The ultimate smartphone experience with advanced AI features, titanium frame, and amazing camera.",
        price: 129999, discountPrice: 124999, stock: 20, rating: 4.7, brand: "Samsung",
        images: ["https://images.unsplash.com/photo-1706692882563-7de0564d653f?w=800&auto=format&fit=crop"]
      },
      {
        title: "Apple iPad Pro 12.9-inch",
        description: "Astonishing performance. Incredibly advanced displays. Superfast wireless connectivity. Next-level Apple Pencil capabilities.",
        price: 112900, discountPrice: 109900, stock: 12, rating: 4.9, brand: "Apple",
        images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop"]
      },
      {
        title: "Logitech MX Master 3S",
        description: "The iconic mouse, remastered. Feel every moment of your workflow with even more precision, tactility, and performance.",
        price: 10995, discountPrice: 9495, stock: 45, rating: 4.8, brand: "Logitech",
        images: ["https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop"]
      },
      {
        title: "Nintendo Switch OLED Model",
        description: "Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen with the Nintendo Switch system.",
        price: 34999, discountPrice: 32999, stock: 25, rating: 4.8, brand: "Nintendo",
        images: ["https://images.unsplash.com/photo-1629852033830-22c608cb9d84?w=800&auto=format&fit=crop"]
      },
      {
        title: "GoPro HERO 12 Black",
        description: "The most powerful GoPro yet. Incredible image quality, even better HyperSmooth video stabilization and a huge boost in battery life.",
        price: 39990, discountPrice: 37990, stock: 30, rating: 4.6, brand: "GoPro",
        images: ["https://images.unsplash.com/photo-1526322967664-d3600f6b7cc9?w=800&auto=format&fit=crop"]
      },
      {
        title: "Amazon Echo Dot (5th Gen)",
        description: "Our best-sounding Echo Dot yet. Enjoy an improved audio experience compared to any previous Echo Dot with Alexa.",
        price: 5499, discountPrice: 4499, stock: 100, rating: 4.5, brand: "Amazon",
        images: ["https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop"]
      },
      {
        title: "Keychron K2 Wireless Mechanical Keyboard",
        description: "A super tactile wireless or wired keyboard giving you all the keys and function you need while keeping it compact.",
        price: 8999, discountPrice: 8499, stock: 18, rating: 4.7, brand: "Keychron",
        images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop"]
      },
      {
        title: "DJI Mini 4 Pro Drone",
        description: "Mini 4 Pro is our most advanced mini-camera drone to date. It integrates powerful imaging capabilities and omnidirectional obstacle sensing.",
        price: 84990, discountPrice: 82990, stock: 5, rating: 4.9, brand: "DJI",
        images: ["https://images.unsplash.com/photo-1506501139174-099022df5260?w=800&auto=format&fit=crop"]
      }
    ];

    const finalProducts = productsData.map(p => ({
        ...p,
        category: electronicsId,
        numReviews: parseInt(Math.random() * 200) + 10,
        isFeatured: true,
        store: store1._id,
        storeOwner: storeOwner1._id
    }));

    await Product.insertMany(finalProducts);
    console.log(`10 Distinct Products created for the store owner.`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedUIItems();
