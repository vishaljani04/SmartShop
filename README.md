# 🛒 SmartShop — Full Stack E-Commerce Platform

A production-grade full-stack e-commerce platform with real-time inventory, admin dashboard, Razorpay payments, and modern UI.

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), Redis (ioredis) |
| **Payment** | Razorpay (UPI, Card, Netbanking) |
| **Auth** | JWT + bcrypt, role-based (user/admin) |
| **DevOps** | Docker, docker-compose |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Redis (optional — falls back to MongoDB)

### 1. Clone and Install

```bash
git clone <repo-url>
cd Smartshop
npm run install:all
```

### 2. Configure Environment

Copy `.env.example` to `server/.env` and fill in your values:

```bash
cp .env.example server/.env
```

Required variables:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — any strong secret string
- `RAZORPAY_KEY_ID` — Razorpay test key ID
- `RAZORPAY_KEY_SECRET` — Razorpay test key secret

### 3. Seed Sample Data

```bash
npm run seed
```

This creates:
- **Admin**: admin@smartshop.com / admin123
- **User**: john@example.com / user123
- 12 products, 6 categories, 3 coupons (WELCOME10, FLAT500, MEGA20)

### 4. Run Development Server

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🐳 Docker

```bash
docker-compose up --build
```

App runs on http://localhost:5000

## 📁 Project Structure

```
/client                 # React frontend (Vite)
  /src
    /components         # Navbar, Footer, ProductCard, etc.
    /pages              # All pages + admin/
    /redux/slices       # Auth, Product, Cart, Order, Admin
    /services           # Axios API calls

/server                 # Express backend
  /config               # DB + Redis connection
  /controllers          # Auth, Product, Cart, Order, Admin
  /middleware            # JWT auth, error handler
  /models               # User, Product, Order, Category, Coupon, Cart
  /routes               # API routes
  /utils                # Token generator, seed script
```

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | User | Get profile |
| GET | `/api/products` | — | List products (search, filter, paginate) |
| GET | `/api/products/:id` | — | Get product detail |
| POST | `/api/products` | Admin | Create product |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart/add` | User | Add to cart |
| POST | `/api/orders/create` | User | Create Razorpay order |
| POST | `/api/orders/verify-payment` | User | Verify payment |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/orders` | Admin | All orders |
| GET | `/api/admin/users` | Admin | All users |

## 💳 Razorpay Payment Flow

1. User clicks "Pay" → Backend creates Razorpay order
2. Frontend opens Razorpay checkout modal
3. User pays via UPI/Card/Netbanking
4. On success → Frontend sends payment details to backend
5. Backend verifies HMAC signature
6. Order confirmed → Stock reduced → Cart cleared
7. Webhook handles async payment events

## 📱 Pages

**User**: Home, Products, Product Detail, Cart, Checkout, Order Success, Orders, Profile, Wishlist, Login, Register

**Admin**: Dashboard (analytics), Products (CRUD), Orders (status management + refunds), Users, Categories, Coupons

## 📄 License

MIT
