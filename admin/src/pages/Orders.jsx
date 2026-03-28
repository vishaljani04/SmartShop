import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    API.get('/admin/orders', { params: { page, limit: 15, status } }).then(r => { setOrders(r.data.orders); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, status]);

  const updateStatus = async (id, orderStatus) => {
    try { await API.put(`/admin/orders/${id}`, { orderStatus }); toast.success(`${orderStatus}`); load(); }
    catch { toast.error('Failed'); }
  };

  const refund = async (id) => {
    if (!confirm('Process refund?')) return;
    try { await API.post(`/admin/orders/${id}/refund`); toast.success('Refunded'); load(); }
    catch { toast.error('Failed'); }
  };

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const statusColors = { processing: 'badge-warning', confirmed: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };
  const paymentColors = { pending: 'badge-warning', paid: 'badge-success', failed: 'badge-danger', refunded: 'badge-danger' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field !w-auto text-sm !py-2">
          <option value="">All</option>
          {['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {orders.map(o => (
          <div key={o._id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-mono text-xs text-gray-600/40">#{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{o.user?.name} <span className="text-gray-600/30 font-normal">({o.user?.email})</span></p>
                <p className="text-[11px] text-gray-600/30">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={statusColors[o.orderStatus]}>{o.orderStatus}</span>
                <span className={paymentColors[o.paymentStatus]}>{o.paymentStatus}</span>
                <span className="text-lg font-bold text-gray-900">{fmt(o.totalAmount)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['confirmed', 'shipped', 'delivered'].map(s => (
                <button key={s} onClick={() => updateStatus(o._id, s)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600/50 hover:text-black hover:bg-brand-500/10 border border-gray-100 hover:border-brand-500/20 transition-all capitalize">
                  Mark {s}
                </button>
              ))}
              {o.paymentStatus === 'paid' && (
                <button onClick={() => refund(o._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                  Refund
                </button>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-600/30 text-center py-20 text-sm">No orders</p>}
      </div>
    </div>
  );
};

export default Orders;
