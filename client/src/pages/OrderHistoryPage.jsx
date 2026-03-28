import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/orderSlice';
import { generateInvoice } from '../utils/invoiceGenerator';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineClipboardList, HiOutlineDownload } from 'react-icons/hi';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  useEffect(() => { dispatch(fetchUserOrders()); }, [dispatch]);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const statusColors = { 
    processing: 'badge-warning', confirmed: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger',
    paid: 'badge-success', pending: 'badge-warning', failed: 'badge-danger', refunded: 'badge-danger' 
  };

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-dark-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 mb-8 flex items-center space-x-2">
          <HiOutlineClipboardList className="w-7 h-7 text-primary-600" />
          <span>My Orders</span>
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 card p-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-dark-800 mb-2">No orders yet</h2>
            <p className="text-dark-400">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="card p-5 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-dark-400">Order ID: {order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-dark-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={statusColors[order.orderStatus]}>{order.orderStatus}</span>
                    <span className={statusColors[order.paymentStatus]}>{order.paymentStatus}</span>
                    {order.paymentStatus === 'paid' && (
                      <button 
                        onClick={() => generateInvoice(order)}
                        className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        title="Download Invoice"
                      >
                        <HiOutlineDownload className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Invoice</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <img src={item.image || 'https://via.placeholder.com/60'} alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover bg-dark-50" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-800 truncate">{item.title}</p>
                        <p className="text-xs text-dark-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-dark-100">
                  <span className="text-sm text-dark-500">Total Amount</span>
                  <span className="text-lg font-bold text-dark-900">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
