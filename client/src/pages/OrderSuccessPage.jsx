import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlinePrinter, HiOutlineShoppingBag, HiOutlineDownload } from 'react-icons/hi';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateInvoice } from '../utils/invoiceGenerator';

const OrderSuccessPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const res = await API.get('/orders/user');
        if (res.data.success && res.data.orders.length > 0) {
          setOrder(res.data.orders[0]);
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestOrder();
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (loading) return <div className="pt-24"><LoadingSpinner text="Generating your receipt..." /></div>;

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-dark-50">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Receipt Card */}
        <div className="card bg-white p-8 lg:p-10 shadow-2xl rounded-3xl animate-fade-in relative overflow-hidden">
          {/* Decorative Header Banner */}
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary-500 to-accent-500"></div>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <HiOutlineCheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black text-dark-900 mb-2 tracking-tight">Payment Successful!</h1>
            <p className="text-dark-500 text-lg">Thank you for shopping with us.</p>
          </div>

          {order ? (
            <div className="border border-dark-100 rounded-2xl overflow-hidden mb-8">
              <div className="bg-dark-50 p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-dark-100">
                <div>
                  <p className="text-xs text-dark-400 uppercase tracking-wider font-bold mb-1">Receipt Number</p>
                  <p className="text-dark-900 font-mono font-bold text-lg">{order.razorpayOrderId || order._id}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-dark-400 uppercase tracking-wider font-bold mb-1">Date</p>
                  <p className="text-dark-800 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-bold text-dark-800 uppercase tracking-wider mb-4 border-b border-dark-100 pb-2">Order Items</h3>
                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-dark-50 p-1 flex-shrink-0 border border-dark-100 hidden sm:block">
                          <img src={item.image || 'https://via.placeholder.com/150'} alt={item.title} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div>
                          <p className="text-dark-800 font-semibold text-sm line-clamp-1">{item.title}</p>
                          <p className="text-dark-400 text-xs mt-0.5">Qty: {item.quantity} {item.variant ? `| ${[item.variant.size, item.variant.color].filter(Boolean).join(' ')}` : ''}</p>
                        </div>
                      </div>
                      <p className="text-dark-900 font-bold whitespace-nowrap ml-4">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-dark-50 rounded-xl p-5 space-y-3 text-sm">
                  <div className="flex justify-between text-dark-600"><span>Subtotal</span><span className="font-medium text-dark-800">{formatPrice(order.totalAmount - order.taxAmount - order.shippingAmount + order.discountAmount)}</span></div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600"><span>Discount</span><span className="font-medium">-{formatPrice(order.discountAmount)}</span></div>
                  )}
                  <div className="flex justify-between text-dark-600"><span>Shipping</span><span className="font-medium text-dark-800">{order.shippingAmount === 0 ? 'FREE' : formatPrice(order.shippingAmount)}</span></div>
                  <div className="flex justify-between text-dark-600"><span>Tax</span><span className="font-medium text-dark-800">{formatPrice(order.taxAmount)}</span></div>
                  <div className="border-t border-dark-200 my-2 pt-2 flex justify-between items-center">
                    <span className="text-base font-bold text-dark-900">Total Paid</span>
                    <span className="text-xl font-black text-primary-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center p-8 bg-dark-50 rounded-2xl mb-8">
               <p className="text-dark-500">Your order is confirmed, but we couldn't load the receipt details right now.</p>
             </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {order && (
              <>
                <button onClick={() => window.print()} className="btn-secondary flex items-center justify-center space-x-2">
                  <HiOutlinePrinter className="w-5 h-5" />
                  <span>Print Receipt</span>
                </button>
                <button onClick={() => generateInvoice(order)} className="btn-secondary flex items-center justify-center space-x-2">
                  <HiOutlineDownload className="w-5 h-5" />
                  <span>Download Invoice</span>
                </button>
              </>
            )}
            <Link to="/products" className="btn-primary flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/30">
              <HiOutlineShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
