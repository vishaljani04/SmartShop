const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Store = require('../models/Store');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Coupon.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Store.deleteMany({})
    ]);

    try {
      // Create Users (admin, store owners, regular users)
      const users = await User.create([
        { name: 'Admin', email: 'admin@smartshop.com', password: 'admin123', role: 'admin' },
        { name: 'Priya Electronics', email: 'priya@store.com', password: 'store123', role: 'storeOwner' },
        { name: 'Rahul Fashion Hub', email: 'rahul@store.com', password: 'store123', role: 'storeOwner' },
        { name: 'Sneha Home Store', email: 'sneha@store.com', password: 'store123', role: 'storeOwner' },
        { name: 'John Customer', email: 'john@example.com', password: 'user123', role: 'user',
          addresses: [{ fullName: 'John Doe', phone: '9876543210', street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true }]
        },
        { name: 'Jane Customer', email: 'jane@example.com', password: 'user123', role: 'user' }
      ]);
      console.log('Users seeded');
  
      // Create Stores
      const stores = [];
      const storeData = [
        { name: 'Priya Electronics', owner: users[1]._id, description: 'Premium electronics and gadgets at best prices', logo: 'https://ui-avatars.com/api/?name=PE&background=4f46e5&color=fff&size=128', category: 'Electronics', email: 'priya@store.com', phone: '9876543001', rating: 4.5, numRatings: 12, isVerified: true },
        { name: 'Rahul Fashion Hub', owner: users[2]._id, description: 'Trendy fashion for men, women, and kids', logo: 'https://ui-avatars.com/api/?name=RF&background=ec4899&color=fff&size=128', category: 'Fashion', email: 'rahul@store.com', phone: '9876543002', rating: 4.2, numRatings: 8, isVerified: true },
        { name: 'Sneha Home Essentials', owner: users[3]._id, description: 'Everything for your home, from furniture to decor', logo: 'https://ui-avatars.com/api/?name=SH&background=f59e0b&color=fff&size=128', category: 'Home & Living', email: 'sneha@store.com', phone: '9876543003', rating: 4.7, numRatings: 15, isVerified: false }
      ];
  
      for (const s of storeData) {
        const store = await Store.create(s);
        stores.push(store);
      }
      
      // Link stores to users
      await User.findByIdAndUpdate(users[1]._id, { store: stores[0]._id });
      await User.findByIdAndUpdate(users[2]._id, { store: stores[1]._id });
      await User.findByIdAndUpdate(users[3]._id, { store: stores[2]._id });
      console.log('Stores seeded');
  
      // Create Categories
      const categoryData = [
        { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', subcategories: ['Smartphones', 'Laptops', 'Headphones', 'Tablets'] },
        { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', subcategories: ['Men', 'Women', 'Kids', 'Accessories'] },
        { name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding'] },
        { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0a41?w=400', subcategories: ['Fitness', 'Cricket', 'Football', 'Yoga'] },
        { name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', subcategories: ['Fiction', 'Non-Fiction', 'Academic', 'Comics'] },
        { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'] }
      ];
      const categories = [];
      for (const cat of categoryData) {
        categories.push(await Category.create(cat));
      }
      console.log('Categories seeded');
  
      // Create Products
      await Product.create([
        { title: 'iPhone 15 Pro Max', description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and 48MP camera system.', price: 159900, discountPrice: 149900, category: categories[0]._id, brand: 'Apple', stock: 25, images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'], tags: ['iphone', 'apple', 'smartphone'], isFeatured: true, rating: 4.8, numReviews: 45, store: stores[0]._id, storeOwner: users[1]._id },
        { title: 'Samsung Galaxy S24 Ultra', description: 'Galaxy AI-powered smartphone with S Pen, 200MP camera, and titanium frame.', price: 134999, discountPrice: 119999, category: categories[0]._id, brand: 'Samsung', stock: 30, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'], tags: ['samsung', 'galaxy', 'android'], isFeatured: true, rating: 4.6, numReviews: 38, store: stores[0]._id, storeOwner: users[1]._id },
        { title: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation with Auto NC Optimizer and crystal clear hands-free calling.', price: 29990, discountPrice: 24990, category: categories[0]._id, brand: 'Sony', stock: 50, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'], tags: ['headphones', 'sony', 'wireless'], isFeatured: true, rating: 4.7, numReviews: 62, store: stores[0]._id, storeOwner: users[1]._id },
        { title: 'MacBook Air M3', description: 'Supercharged by M3 chip. Up to 18 hours battery life. Stunningly thin design.', price: 114900, discountPrice: 109900, category: categories[0]._id, brand: 'Apple', stock: 15, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'], tags: ['macbook', 'laptop', 'apple'], isFeatured: true, rating: 4.9, numReviews: 28, store: stores[0]._id, storeOwner: users[1]._id },
        { title: 'Premium Cotton Kurti Set', description: 'Handcrafted cotton kurti with intricate embroidery work. Perfect for festive occasions.', price: 2499, discountPrice: 1799, category: categories[1]._id, brand: 'FabIndia', stock: 100, images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'], tags: ['kurti', 'ethnic', 'women'], isFeatured: true, rating: 4.3, numReviews: 52, store: stores[1]._id, storeOwner: users[2]._id },
        { title: 'Men Slim Fit Blazer', description: 'Premium wool-blend blazer with modern slim-fit tailoring. Perfect for formal and semi-formal occasions.', price: 5999, discountPrice: 4499, category: categories[1]._id, brand: 'Raymond', stock: 40, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'], tags: ['blazer', 'men', 'formal'], rating: 4.5, numReviews: 22, store: stores[1]._id, storeOwner: users[2]._id },
        { title: 'Designer Sneakers Sport', description: 'Lightweight breathable running shoes with premium cushioning and stylish design.', price: 3999, discountPrice: 2999, category: categories[1]._id, brand: 'Nike', stock: 60, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], tags: ['sneakers', 'shoes', 'sport'], isFeatured: true, rating: 4.4, numReviews: 88, store: stores[1]._id, storeOwner: users[2]._id },
        { title: 'Silk Saree Collection', description: 'Pure Kanjeevaram silk saree with golden zari work. A timeless classic for every wardrobe.', price: 8999, discountPrice: 6999, category: categories[1]._id, brand: 'Mysore Silks', stock: 20, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'], tags: ['saree', 'silk', 'ethnic'], rating: 4.8, numReviews: 14, store: stores[1]._id, storeOwner: users[2]._id },
        { title: 'Smart LED Desk Lamp', description: 'Touch-controlled LED desk lamp with 5 brightness levels and USB charging port.', price: 2999, discountPrice: 1999, category: categories[2]._id, brand: 'Philips', stock: 75, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500'], tags: ['lamp', 'desk', 'smart'], rating: 4.2, numReviews: 31, store: stores[2]._id, storeOwner: users[3]._id },
        { title: 'Modern Coffee Table', description: 'Minimalist Scandinavian design coffee table with solid wood legs and tempered glass top.', price: 12999, discountPrice: 9999, category: categories[2]._id, brand: 'Urban Ladder', stock: 10, images: ['https://images.unsplash.com/photo-1532372320978-5d58312b3e9c?w=500'], tags: ['furniture', 'table', 'modern'], isFeatured: true, rating: 4.6, numReviews: 18, store: stores[2]._id, storeOwner: users[3]._id },
        { title: 'Organic Kitchen Set', description: '10-piece premium stainless steel cookware set with copper bottom. Non-stick coating for healthy cooking.', price: 4999, discountPrice: 3499, category: categories[2]._id, brand: 'Prestige', stock: 35, images: ['https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500'], tags: ['kitchen', 'cookware', 'organic'], rating: 4.4, numReviews: 42, store: stores[2]._id, storeOwner: users[3]._id },
        { title: 'Luxury Bedsheet Set', description: '400 TC Egyptian cotton bedsheet set with 2 pillow covers. Ultra-soft and wrinkle-resistant.', price: 3999, discountPrice: 2799, category: categories[2]._id, brand: 'Bombay Dyeing', stock: 45, images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500'], tags: ['bedsheet', 'bedroom', 'cotton'], rating: 4.5, numReviews: 56, store: stores[2]._id, storeOwner: users[3]._id }
      ]);
      console.log('Products seeded');
  
      // Create Coupons
      await Coupon.create([
        { code: 'WELCOME10', discount: 10, type: 'percentage', expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), maxDiscount: 500, minAmount: 500, maxUses: 1000, isActive: true },
        { code: 'FLAT500', discount: 500, type: 'flat', expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), minAmount: 2000, maxUses: 500, isActive: true },
        { code: 'MEGA20', discount: 20, type: 'percentage', expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), maxDiscount: 2000, minAmount: 3000, maxUses: 200, isActive: true }
      ]);
      console.log('Coupons seeded');
  
      console.log('\n=== Seed Data Complete ===');
      process.exit(0);
    } catch(err) {
      console.error('SEED FAILED AT:', err.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('Global Error:', error.message);
    process.exit(1);
  }
};

seedData();
