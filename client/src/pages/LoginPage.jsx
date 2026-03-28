import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, loadUser } from '../redux/slices/authSlice';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      dispatch(loadUser());
      navigate('/');
    }
  }, [searchParams, dispatch, navigate]);

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-50 via-primary-50/30 to-dark-50 px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Welcome back</h1>
          <p className="text-dark-400 mt-1">Sign in to your SmartShop account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                className="input-field" placeholder="you@example.com" id="login-email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
                className="input-field" placeholder="••••••••" id="login-password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full" id="login-submit">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-100"></div></div>
            <span className="relative px-3 bg-white text-xs text-dark-400 uppercase tracking-widest font-bold">Or continue with</span>
          </div>

          <a 
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
            className="w-full flex items-center justify-center space-x-3 py-3 rounded-xl border-2 border-dark-50 hover:border-dark-100 hover:bg-dark-50 transition-all font-semibold text-dark-700"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Google Account</span>
          </a>

          <div className="mt-4 p-3 bg-dark-50 rounded-xl">
            <p className="text-xs text-dark-400 text-center">Demo: admin@smartshop.com / admin123</p>
          </div>
        </div>

        <p className="text-center text-sm text-dark-400 mt-6">
          Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
