import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/admin-login', form);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      toast.success('Welcome back, Admin!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-600 to-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-brand-500/30">
            <span className="text-gray-900 font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600/50 text-sm mt-1">Sign in to manage SmartShop</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-600/60 mb-1.5 uppercase tracking-wide">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600/40" />
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                className="input-field !pl-10" placeholder="admin@smartshop.com" id="admin-email" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600/60 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600/40" />
              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
                className="input-field !pl-10" placeholder="••••••••" id="admin-password" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3" id="admin-login-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600/30 mt-6"></p>
      </div>
    </div>
  );
};

export default Login;
