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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
            <span className="text-white font-bold text-3xl tracking-tighter">S</span>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">SmartShop</h1>
          <p className="text-gray-400 text-xs mt-2 uppercase tracking-[0.2em] font-medium">Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-3xl">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all" 
                  placeholder="admin@smartshop.com" id="admin-email" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Secure Password</label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all" 
                  placeholder="••••••••" id="admin-password" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-900 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(0,0,0,0.1)]" 
            id="admin-login-btn">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-300 mt-10 uppercase tracking-widest font-medium">
          &copy; {new Date().getFullYear()} SmartShop Platform
        </p>
      </div>
    </div>
  );
};

export default Login;
