import API from './api';

const mockProducts = [
  {
    _id: "m1",
    title: "Apple iPhone 16 Pro Max - Titanium Desktop Grade",
    description: "The ultimate iPhone featuring a new titanium design, A18 Pro chip, and the most advanced camera system ever. Experience unprecedented performance and battery life.",
    price: 159900,
    discountPrice: 149900,
    category: { name: 'Electronics', _id: 'cat1' },
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1470&auto=format&fit=crop'],
    stock: 50,
    rating: 4.9,
    numReviews: 432,
    store: { _id: 's1', name: 'Apple Premium Reseller', isVerified: true },
    variants: [{ size: '256GB', color: 'Natural Titanium', stock: 10, price: 149900 }]
  },
  {
    _id: "m2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Industry-leading noise cancellation, exceptionally comfortable design, and up to 30 hours of battery life for the ultimate personal audio experience.",
    price: 34990,
    discountPrice: 29990,
    category: { name: 'Electronics', _id: 'cat1' },
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1588&auto=format&fit=crop'],
    stock: 120,
    rating: 4.8,
    numReviews: 215,
    store: { _id: 's2', name: 'Sony Audio Center', isVerified: true },
    variants: [{ color: 'Black', stock: 50, price: 29990 }]
  },
  {
    _id: "m3",
    title: "MacBook Air M3 - 15-inch Midnight",
    description: "Supercharged by M3, the MacBook Air features an incredibly thin and light design, a brilliant Liquid Retina display, and up to 18 hours of battery life.",
    price: 134900,
    discountPrice: 124900,
    category: { name: 'Electronics', _id: 'cat1' },
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1626&auto=format&fit=crop'],
    stock: 30,
    rating: 4.9,
    numReviews: 89,
    store: { _id: 's1', name: 'Apple Premium Reseller', isVerified: true },
    variants: [{ size: '512GB', color: 'Midnight', stock: 15, price: 124900 }]
  },
  {
    _id: "m4",
    title: "Premium Men's Chronograph Watch",
    description: "Elegant chronograph watch with a genuine leather strap and sapphire crystal. Built to precision for the modern lifestyle.",
    price: 12500,
    discountPrice: 8500,
    category: { name: 'Fashion', _id: 'cat2' },
    brand: 'Titan',
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1588&auto=format&fit=crop'],
    stock: 85,
    rating: 4.6,
    numReviews: 312,
    store: { _id: 's3', name: 'Titan World', isVerified: true }
  }
];

export const getProducts = async (params) => {
  try {
    return await API.get('/products', { params });
  } catch (error) {
    // Fallback to beautiful dummy data if backend connection fails
    return { data: { products: mockProducts, pagination: { page: 1, limit: 12, total: 4, pages: 1 } } };
  }
};

export const getProduct = async (id) => {
  try {
    return await API.get(`/products/${id}`);
  } catch (error) {
    const product = mockProducts.find(p => p._id === id) || mockProducts[0];
    return { data: { product } };
  }
};

export const getRelatedProducts = async (id) => {
  try {
    return await API.get(`/products/${id}/related`);
  } catch (error) {
    return { data: { products: mockProducts.slice(1, 4) } };
  }
};

export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);
