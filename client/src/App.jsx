import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// User Pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import StoreProfilePage from './pages/StoreProfilePage';

// Store Owner Pages
import StoreLayout from './pages/store/StoreLayout';
import StoreDashboard from './pages/store/StoreDashboard';
import StoreProducts from './pages/store/StoreProducts';
import StoreOrders from './pages/store/StoreOrders';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const StoreRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'storeOwner') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { borderRadius: '12px', background: '#1e293b', color: '#f8fafc', fontSize: '14px' }
      }} />

      <Routes>
        {/* Store Owner Routes */}
        <Route path="/store" element={<StoreRoute><StoreLayout /></StoreRoute>}>
          <Route index element={<StoreDashboard />} />
          <Route path="products" element={<StoreProducts />} />
          <Route path="orders" element={<StoreOrders />} />
        </Route>

        {/* Public & User Routes */}
        <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
        <Route path="/products" element={<><Navbar /><ProductListPage /><Footer /></>} />
        <Route path="/products/:id" element={<><Navbar /><ProductDetailPage /><Footer /></>} />
        <Route path="/cart" element={<><Navbar /><CartPage /><Footer /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /><Footer /></>} />
        <Route path="/register" element={<><Navbar /><RegisterPage /><Footer /></>} />
        <Route path="/store-profile/:id" element={<><Navbar /><StoreProfilePage /><Footer /></>} />

        {/* Protected User Routes */}
        <Route path="/checkout" element={<ProtectedRoute><Navbar /><CheckoutPage /><Footer /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Navbar /><OrderHistoryPage /><Footer /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Navbar /><ProfilePage /><Footer /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Navbar /><WishlistPage /><Footer /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
