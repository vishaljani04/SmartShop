import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineUsers, HiOutlineClipboardList, HiOutlineTag, HiOutlineTicket, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineGlobe, HiOutlineChatAlt2 } from 'react-icons/hi';
import { HiBuildingStorefront } from 'react-icons/hi2';

const Layout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const links = [
    { to: '/', icon: HiOutlineChartBar, label: 'Dashboard', exact: true },
    { to: '/users', icon: HiOutlineUsers, label: 'Users' },
    { to: '/stores', icon: HiBuildingStorefront, label: 'Stores' },
    { to: '/products', icon: HiOutlineCube, label: 'Products' },
    { to: '/orders', icon: HiOutlineClipboardList, label: 'Orders' },
    { to: '/categories', icon: HiOutlineTag, label: 'Categories' },
    { to: '/coupons', icon: HiOutlineTicket, label: 'Coupons' },
    { to: '/reviews', icon: HiOutlineChatAlt2, label: 'Reviews' },
  ];

  const isActive = (l) => l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#ffffff] border-r border-gray-200 transform transition-transform lg:translate-x-0 lg:static ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Smart<span style={{color: '#6366f1'}}>Shop</span></p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-black">
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-3 mb-2">Navigation</p>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(l)
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}>
                <l.icon className="w-[18px] h-[18px]" />
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="px-3 pb-3 space-y-1">
            <a href="http://localhost:5173" target="_blank" rel="noreferrer"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-all">
              <HiOutlineGlobe className="w-[18px] h-[18px]" />
              <span>View Store</span>
            </a>
            <button onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all">
              <HiOutlineLogout className="w-[18px] h-[18px]" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <HiOutlineMenu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 capitalize">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).replace(/-/g, ' ')}
          </h1>
          <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">Admin</div>
        </header>
        <main className="p-6 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
};

export default Layout;
