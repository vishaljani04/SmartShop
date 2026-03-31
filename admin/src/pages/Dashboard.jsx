import { useEffect, useState } from 'react';
import API from '../api';
import { HiOutlineUsers, HiOutlineCube, HiOutlineClipboardList, HiOutlineCurrencyRupee, HiOutlineExclamation } from 'react-icons/hi';
import { HiBuildingStorefront } from 'react-icons/hi2';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard').then(r => { setStats(r.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!stats) return <p className="text-gray-600/40 text-center py-20">Failed to load</p>;

  const cards = [
    { icon: HiOutlineCurrencyRupee, label: 'Total Revenue', value: fmt(stats.totalSales), color: '#10b981', bg: 'bg-emerald-50' },
    { icon: HiOutlineClipboardList, label: 'Total Orders', value: stats.totalOrders, color: '#3b82f6', bg: 'bg-blue-50' },
    { icon: HiOutlineCube, label: 'Products', value: stats.totalProducts, color: '#8b5cf6', bg: 'bg-purple-50' },
    { icon: HiOutlineUsers, label: 'Users', value: stats.totalUsers, color: '#f59e0b', bg: 'bg-amber-50' },
    { icon: HiBuildingStorefront, label: 'Store Owners', value: stats.totalStoreOwners, color: '#ec4899', bg: 'bg-pink-50' },
    { icon: HiBuildingStorefront, label: 'Stores', value: stats.totalStores, color: '#06b6d4', bg: 'bg-cyan-50' },
  ];

  const statusColors = { processing: 'bg-amber-400', confirmed: 'bg-blue-400', shipped: 'bg-indigo-400', delivered: 'bg-emerald-400', cancelled: 'bg-red-400' };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="card p-5 hover:border-gray-300 hover:-translate-y-0.5 transition-all group duration-300">
            <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <c.icon className="w-6 h-6" style={{ color: c.color }} />
            </div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{c.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Sales */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
          {stats.monthlySales?.length > 0 ? (
            <div className="space-y-3">
              {stats.monthlySales.map((m, i) => {
                const max = Math.max(...stats.monthlySales.map(s => s.total));
                const w = max > 0 ? (m.total / max) * 100 : 0;
                return (
                  <div key={i} className="flex items-center space-x-3">
                    <span className="text-xs text-gray-600/40 w-16 font-mono">{m._id}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                      <div className="bg-gradient-to-r from-brand-600 to-brand-400 h-full rounded-full flex items-center justify-end px-2.5 transition-all duration-700"
                        style={{ width: `${Math.max(w, 8)}%` }}>
                        <span className="text-[10px] text-gray-900 font-semibold">{fmt(m.total)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-gray-600/30 text-sm">No data</p>}
        </div>

        {/* Order Status */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Order Status</h3>
          {stats.statusDistribution?.length > 0 ? (
            <div className="space-y-2">
              {stats.statusDistribution.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColors[s._id] || 'bg-surface-200/40'}`} />
                    <span className="text-sm text-gray-600/70 capitalize">{s._id}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{s.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-600/30 text-sm">No orders</p>}
        </div>
      </div>

      {/* Top Stores */}
      {stats.topStores?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Top Stores</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.topStores.map((s, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-all">
                <div className="flex items-center space-x-3 mb-2">
                  <img src={s.logo || 'https://ui-avatars.com/api/?name=S&background=4f46e5&color=fff'} alt="" className="w-10 h-10 rounded-xl" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                    <p className="text-[10px] text-gray-600/40">{s.owner?.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600/40">⭐ {s.rating?.toFixed(1)}</span>
                  <span className="text-emerald-400 font-semibold">{fmt(s.totalRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock */}
      {stats.lowStock?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <HiOutlineExclamation className="w-4 h-4 text-amber-400" />
            <span>Low Stock Alert</span>
          </h3>
          <div className="grid gap-2">
            {stats.lowStock.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <span className="text-sm text-gray-600/70">{p.title}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-600/40">{fmt(p.price)}</span>
                  <span className="badge-warning">{p.stock} left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order ID', 'Customer', 'Amount', 'Payment', 'Date'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[11px] uppercase tracking-wider text-gray-600/30 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map(o => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs text-gray-600/50">{o._id.slice(-8).toUpperCase()}</td>
                  <td className="py-2.5 px-3 text-gray-800">{o.user?.name || 'N/A'}</td>
                  <td className="py-2.5 px-3 font-semibold text-gray-900">{fmt(o.totalAmount)}</td>
                  <td className="py-2.5 px-3"><span className={o.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}>{o.paymentStatus}</span></td>
                  <td className="py-2.5 px-3 text-gray-600/40 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats.recentOrders || stats.recentOrders.length === 0) && <p className="text-gray-600/30 text-center py-8 text-sm">No orders yet</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
