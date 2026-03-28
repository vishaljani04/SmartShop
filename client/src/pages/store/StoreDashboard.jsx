import { useEffect, useState } from 'react';
import api from '../../services/api';
import { HiOutlineCurrencyRupee, HiOutlineCube, HiOutlineClipboardList, HiOutlineStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const StoreDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/store/dashboard').then(r => { setStats(r.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!stats) return <div className="text-center py-20 text-slate-500">Welcome to your store dashboard! Add products to see stats.</div>;

  const cards = [
    { label: 'Total Sales', value: fmt(stats.totalSales), icon: HiOutlineCurrencyRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Orders', value: stats.totalOrders, icon: HiOutlineClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Products', value: stats.totalProducts, icon: HiOutlineCube, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Rating', value: `⭐ ${stats.rating.toFixed(1)}`, icon: HiOutlineStar, color: 'text-amber-500', bg: 'bg-amber-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className={`w-10 h-10 ${c.bg} ${c.color} rounded-xl flex items-center justify-center mb-3`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6">
           <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Orders</h3>
           {stats.recentOrders?.length > 0 ? (
             <div className="space-y-3">
               {stats.recentOrders.map(o => (
                 <div key={o._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <div>
                     <p className="text-sm font-semibold text-slate-900">Order #{o._id.slice(-6).toUpperCase()}</p>
                     <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold text-primary-600">{fmt(o.totalAmount)}</p>
                     <p className="text-[10px] uppercase font-bold text-slate-400">{o.paymentStatus}</p>
                   </div>
                 </div>
               ))}
               <Link to="/store/orders" className="block text-center text-sm text-primary-600 font-medium hover:underline pt-2">View All Orders</Link>
             </div>
           ) : <p className="text-sm text-slate-500">No recent orders</p>}
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
