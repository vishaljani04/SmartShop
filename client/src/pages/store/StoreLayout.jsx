import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineHome } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const StoreLayout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const links = [
    { to: '/store', icon: HiOutlineChartBar, label: 'Dashboard', exact: true },
    { to: '/store/products', icon: HiOutlineCube, label: 'My Products' },
    { to: '/store/orders', icon: HiOutlineClipboardList, label: 'Store Orders' },
  ];

  const isActive = (l) => l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 lg:static ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <span className="font-bold text-slate-900">Smart<span style={{color: '#6366f1'}}>Shop</span> <span className="text-xs font-normal text-slate-500 ml-1">Partner</span></span>
            </Link>
            <button onClick={() => setOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold px-2 mb-3">Store Management</p>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(l) ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                <l.icon className={`w-5 h-5 ${isActive(l) ? 'text-primary-600' : 'text-slate-400'}`} />
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 pb-4 space-y-1">
            <Link to="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
              <HiOutlineHome className="w-5 h-5 text-slate-400" />
              <span>Back to Shop</span>
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-red-500 rounded-xl hover:bg-red-50 transition-all">
              <HiOutlineLogout className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
          
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 block">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-500">
            <HiOutlineMenu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 capitalize">
            {location.pathname === '/store' ? 'Store Dashboard' : location.pathname.split('/').pop().replace(/-/g, ' ')}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto animate-fade-in"><Outlet /></div>
        </main>
      </div>
    </div>
  );
};

export default StoreLayout;
