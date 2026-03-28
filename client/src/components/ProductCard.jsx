import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiStar } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '../redux/slices/authSlice';
import { addItem } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const isWishlisted = user?.wishlist?.some(w => (w._id || w) === product._id);

  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Please login first');
    dispatch(toggleWishlistItem(product._id));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Please login first');
    dispatch(addItem({ productId: product._id, quantity: 1 }));
    toast.success('Added to cart!');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <Link to={`/products/${product._id}`} className="group card overflow-hidden animate-fade-in" id={`product-${product._id}`}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-dark-50">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400?text=No+Image'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
            -{discount}%
          </span>
        )}

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3 flex space-x-2">
            <button onClick={handleAddToCart} className="flex-1 bg-white text-dark-800 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center space-x-1.5 shadow-lg">
              <HiOutlineShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Wishlist */}
        <button onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
          {isWishlisted
            ? <HiHeart className="w-5 h-5 text-red-500" />
            : <HiOutlineHeart className="w-5 h-5 text-dark-400" />
          }
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">{product.brand || product.category?.name || 'SmartShop'}</p>
        <h3 className="text-sm font-semibold text-dark-800 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug mb-2">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center space-x-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            <HiStar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">{product.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="text-xs text-dark-400">({product.numReviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-dark-900">
            {formatPrice(product.discountPrice > 0 ? product.discountPrice : product.price)}
          </span>
          {product.discountPrice > 0 && (
            <span className="text-sm text-dark-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-amber-600 font-medium mt-1">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-500 font-medium mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
