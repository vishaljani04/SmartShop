import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateItem, removeItem } from '../redux/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiMinus, HiPlus, HiOutlineTrash, HiOutlineShoppingBag, HiArrowRight } from 'react-icons/hi';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.discountPrice > 0 ? item.product.discountPrice : (item.product?.price || 0);
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Please sign in</h2>
          <p className="text-dark-400 mb-6">Login to view your cart</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="pt-24"><LoadingSpinner text="Loading cart..." /></div>;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 card p-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-dark-800 mb-2">Your cart is empty</h2>
            <p className="text-dark-400 mb-6">Looks like you haven't added anything yet</p>
            <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
              <HiOutlineShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <div key={i} className="card p-4 flex space-x-4 animate-fade-in">
                  <Link to={`/products/${item.product?._id}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-dark-50">
                    <img src={item.product?.images?.[0] || 'https://via.placeholder.com/100'} alt={item.product?.title}
                      className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product?._id}`} className="font-semibold text-dark-800 text-sm hover:text-primary-600 line-clamp-2">
                      {item.product?.title}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-dark-400 mt-0.5">
                        {[item.variant.size, item.variant.color].filter(Boolean).join(' / ')}
                      </p>
                    )}
                    <p className="text-lg font-bold text-dark-900 mt-1">
                      {formatPrice(item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-dark-200 rounded-lg overflow-hidden">
                        <button onClick={() => dispatch(updateItem({ productId: item.product?._id, quantity: Math.max(1, item.quantity - 1), variant: item.variant }))}
                          className="p-1.5 hover:bg-dark-50 transition-colors"><HiMinus className="w-3.5 h-3.5" /></button>
                        <span className="px-3 py-1 text-sm font-semibold border-x border-dark-200">{item.quantity}</span>
                        <button onClick={() => dispatch(updateItem({ productId: item.product?._id, quantity: item.quantity + 1, variant: item.variant }))}
                          className="p-1.5 hover:bg-dark-50 transition-colors"><HiPlus className="w-3.5 h-3.5" /></button>
                      </div>
                      <button onClick={() => dispatch(removeItem({ productId: item.product?._id, variant: item.variant }))}
                        className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="card p-6 h-fit sticky top-24">
              <h3 className="text-lg font-bold text-dark-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-dark-500">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-dark-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark-500">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-dark-800'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <hr className="border-dark-100" />
                <div className="flex justify-between text-lg font-bold text-dark-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6 flex items-center justify-center space-x-2" id="checkout-btn">
                <span>Proceed to Checkout</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
              <Link to="/products" className="block text-center text-sm text-primary-600 mt-3 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
