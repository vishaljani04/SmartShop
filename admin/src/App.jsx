import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Stores from './pages/Stores';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Coupons from './pages/Coupons';
import Products from './pages/Products';
import Reviews from './pages/Reviews';

const ProtectedRoute = ({ children }) => {
  // Login session bypassed for admin ease of use
  return children;
};

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="stores" element={<Stores />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="categories" element={<Categories />} />
      <Route path="coupons" element={<Coupons />} />
      <Route path="reviews" element={<Reviews />} />
    </Route>
  </Routes>
);

export default App;
