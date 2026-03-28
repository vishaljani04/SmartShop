import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(register({ name: form.name, email: form.email, password: form.password, role: form.role }));
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-50 via-primary-50/30 to-dark-50 px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Create Account</h1>
          <p className="text-dark-400 mt-1">Join SmartShop and start shopping</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Full Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                className="input-field" placeholder="John Doe" id="register-name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                className="input-field" placeholder="you@example.com" id="register-email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
                className="input-field" placeholder="Min 6 characters" id="register-password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Confirm Password</label>
              <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                className="input-field" placeholder="••••••••" id="register-confirm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">I want to register as a</label>
              <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="input-field">
                <option value="user">Customer</option>
                <option value="storeOwner">Store Owner</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full" id="register-submit">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-dark-400 mt-6">
          Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
