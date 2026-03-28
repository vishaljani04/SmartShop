import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';
import { createNewOrder, verifyPayment } from '../redux/slices/orderSlice';
import { loadUser } from '../redux/slices/authSlice';
import { validateCoupon } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineLocationMarker, HiOutlineTag, HiOutlineCreditCard } from 'react-icons/hi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { currentOrder, loading: orderLoading } = useSelector(state => state.orders);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [showNewAddress, setShowNewAddress] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [user]);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.discountPrice > 0 ? item.product.discountPrice : (item.product?.price || 0);
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round((subtotal - couponDiscount) * 0.18);
  const total = subtotal - couponDiscount + shipping + tax;

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await validateCoupon({ code: couponCode, cartTotal: subtotal });
      setCouponDiscount(res.data.discountAmount);
      setCouponApplied(couponCode.toUpperCase());
      toast.success(`Coupon applied! You save ${formatPrice(res.data.discountAmount)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedAddress) return toast.error('Please select a delivery address');

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) return toast.error('Razorpay SDK failed to load');

    const result = await dispatch(createNewOrder({
      shippingAddress: selectedAddress,
      couponCode: couponApplied || undefined
    })).unwrap();

    const options = {
      key: result.razorpayKey,
      amount: result.order.amount,
      currency: 'INR',
      name: 'SmartShop',
      description: 'SmartShop Order Payment',
      order_id: result.order.razorpayOrderId,
      handler: async (response) => {
        try {
          await dispatch(verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })).unwrap();
          navigate('/order-success');
        } catch (err) {
          toast.error('Payment verification failed');
          navigate('/orders');
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: selectedAddress?.phone
      },
      theme: { color: '#4f46e5' },
      modal: { ondismiss: () => toast.error('Payment cancelled') }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-dark-900 flex items-center space-x-2 mb-4">
                <HiOutlineLocationMarker className="w-5 h-5 text-primary-600" />
                <span>Delivery Address</span>
              </h2>

              {user?.addresses?.length > 0 && (
                <div className="grid gap-3 mb-4">
                  {user.addresses.map((addr) => (
                    <label key={addr._id} className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddress?._id === addr._id ? 'border-primary-500 bg-primary-50' : 'border-dark-200 hover:border-dark-300'
                    }`}>
                      <input type="radio" name="address" checked={selectedAddress?._id === addr._id}
                        onChange={() => setSelectedAddress(addr)} className="mt-1 accent-primary-600" />
                      <div>
                        <p className="font-semibold text-dark-800 text-sm">{addr.fullName} <span className="text-dark-400 font-normal">({addr.phone})</span></p>
                        <p className="text-sm text-dark-500">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <button onClick={() => setShowNewAddress(!showNewAddress)} className="text-sm text-primary-600 font-semibold hover:underline">
                + Add New Address
              </button>

              {showNewAddress && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {['fullName', 'phone', 'street', 'city', 'state', 'pincode'].map(field => (
                    <input key={field} type="text" placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                      value={newAddress[field]} onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                      className={`input-field text-sm ${field === 'street' ? 'col-span-2' : ''}`} />
                  ))}
                  <button onClick={() => {
                    setSelectedAddress({ ...newAddress, _id: 'new' });
                    setShowNewAddress(false);
                    toast.success('Address selected');
                  }} className="btn-primary col-span-2 text-sm">Use This Address</button>
                </div>
              )}
            </div>

            {/* Coupon */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-dark-900 flex items-center space-x-2 mb-4">
                <HiOutlineTag className="w-5 h-5 text-primary-600" />
                <span>Have a Coupon?</span>
              </h2>
              <div className="flex space-x-3">
                <input type="text" placeholder="Enter coupon code" value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="input-field text-sm flex-1" />
                <button onClick={handleApplyCoupon} className="btn-secondary text-sm whitespace-nowrap">Apply</button>
              </div>
              {couponApplied && (
                <p className="text-sm text-emerald-600 mt-2">✓ Coupon "{couponApplied}" applied — saving {formatPrice(couponDiscount)}</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h3 className="text-lg font-bold text-dark-900 mb-4 flex items-center space-x-2">
              <HiOutlineCreditCard className="w-5 h-5 text-primary-600" />
              <span>Order Summary</span>
            </h3>

            <div className="space-y-2 mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-dark-500">
                  <span className="truncate mr-2">{item.product?.title} × {item.quantity}</span>
                  <span className="font-semibold text-dark-700 whitespace-nowrap">
                    {formatPrice((item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-dark-100 my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-dark-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600"><span>Coupon Discount</span><span>-{formatPrice(couponDiscount)}</span></div>
              )}
              <div className="flex justify-between text-dark-500">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-dark-500"><span>Tax (18%)</span><span>{formatPrice(tax)}</span></div>
              <hr className="border-dark-100" />
              <div className="flex justify-between text-lg font-bold text-dark-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={handlePayment} disabled={orderLoading || items.length === 0}
              className="btn-primary w-full mt-6 disabled:opacity-50" id="pay-now-btn">
              {orderLoading ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-dark-400">🔒 Secured by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
