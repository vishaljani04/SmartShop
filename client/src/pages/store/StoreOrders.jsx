import { useEffect, useState } from 'react';
import api from '../../services/api';

const StoreOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/store/orders').then(r => { setOrders(r.data.orders); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const statusColors = { processing: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Orders for Your Products</h2>

      <div className="space-y-4">
        {orders.map(o => {
          // Calculate store's portion of the order using items
          const storeItems = o.items.filter(i => i.store);
          const storeAmount = storeItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
          
          return (
            <div key={o._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap gap-4 items-start justify-between mb-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Order #{o._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</p>
                  <p className="text-xs mt-1 text-slate-600 font-medium">{o.user?.name} ({o.user?.email})</p>
                </div>
                <div className="text-right flex flex-col items-end justify-center">
                  <p className="text-lg font-bold text-primary-600 pb-1">{fmt(storeAmount)}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-1 flex items-center justify-center rounded-md text-[10px] uppercase font-bold ${statusColors[o.orderStatus]}`}>{o.orderStatus}</span>
                    <span className={`px-2 py-1 flex items-center justify-center rounded-md text-[10px] uppercase font-bold ${o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{o.paymentStatus}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Items Purchased from you:</p>
                {storeItems.map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-sm">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} × {fmt(item.price)}</p>
                    </div>
                    <p className="font-semibold text-slate-900">{fmt(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {orders.length === 0 && <p className="text-center text-slate-500 py-10 bg-white rounded-2xl border border-slate-100">No orders received yet.</p>}
      </div>
    </div>
  );
};

export default StoreOrders;
