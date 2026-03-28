import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, fetchRelated } from '../redux/slices/productSlice';
import { addItem } from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/authSlice';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiMinus, HiPlus, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, related, loading } = useSelector(state => state.products);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const isWishlisted = user?.wishlist?.some(w => (w._id || w) === product?._id);

  useEffect(() => {
    dispatch(fetchProduct(id));
    dispatch(fetchRelated(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.variants?.length > 0) setSelectedVariant(product.variants[0]);
  }, [product]);

  if (loading || !product) return <div className="pt-24"><LoadingSpinner text="Loading product..." /></div>;

  const price = selectedVariant?.price || (product.discountPrice > 0 ? product.discountPrice : product.price);
  const originalPrice = product.price;
  const discount = product.discountPrice > 0 ? Math.round(((originalPrice - product.discountPrice) / originalPrice) * 100) : 0;

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const handleAddToCart = () => {
    if (!isAuthenticated) return toast.error('Please login first');
    dispatch(addItem({ productId: product._id, quantity, variant: selectedVariant ? { size: selectedVariant.size, color: selectedVariant.color } : undefined }));
    toast.success('Added to cart!');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) return toast.error('Please login first');
    dispatch(toggleWishlistItem(product._id));
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-dark-400 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-dark-600 truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="card overflow-hidden aspect-square">
              <img src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'} alt={product.title}
                className="w-full h-full object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary-500 shadow-lg' : 'border-dark-100 hover:border-dark-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between mb-1 gap-2">
                <p className="text-sm text-primary-600 font-medium">{product.brand || product.category?.name}</p>
                {product.store && (
                  <Link to={`/store-profile/${product.store._id}`} className="text-xs font-semibold text-dark-600 hover:text-primary-600 flex items-center bg-dark-50 px-3 py-1 rounded-full transition-colors border border-dark-100">
                    <span>Sold by <span className="text-dark-900">{product.store.name}</span></span>
                    {product.store.isVerified && <HiOutlineShieldCheck className="w-4 h-4 text-emerald-500 ml-1" title="Verified Store" />}
                  </Link>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 mb-3">{product.title}</h1>
              <div className="flex items-center space-x-3">
                <StarRating rating={product.rating} size="md" showCount count={product.numReviews} />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-dark-900">{formatPrice(price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-dark-400 line-through">{formatPrice(originalPrice)}</span>
                  <span className="badge-success font-bold">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-dark-500 leading-relaxed">{product.description}</p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-dark-700">Select Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button key={i} onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selectedVariant === v
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-dark-200 hover:border-dark-300 text-dark-600'
                      }`}>
                      {[v.size, v.color].filter(Boolean).join(' / ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-dark-700">Quantity</span>
              <div className="flex items-center border border-dark-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-dark-50 transition-colors">
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="px-5 py-2 font-semibold text-dark-800 border-x border-dark-200">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-dark-50 transition-colors">
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-dark-400">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button onClick={handleAddToCart} disabled={product.stock === 0 || user?._id === product.storeOwner}
                className="btn-secondary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed" id="add-to-cart-btn">
                <HiOutlineShoppingBag className="w-5 h-5" />
                <span>{user?._id === product.storeOwner ? 'Your Product' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}</span>
              </button>
              <button 
                onClick={() => {
                  if (!isAuthenticated) return toast.error('Please login first');
                  dispatch(addItem({ productId: product._id, quantity, variant: selectedVariant ? { size: selectedVariant.size, color: selectedVariant.color } : undefined }));
                  navigate('/checkout');
                }} 
                disabled={product.stock === 0 || user?._id === product.storeOwner}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed" id="buy-now-btn">
                <span>{user?._id === product.storeOwner ? 'Your Product' : (product.stock === 0 ? 'Out of Stock' : 'Buy Now')}</span>
              </button>
              <button onClick={handleWishlist} className="btn-secondary !px-4" id="wishlist-btn">
                {isWishlisted ? <HiHeart className="w-5 h-5 text-red-500" /> : <HiOutlineHeart className="w-5 h-5" />}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-dark-100">
              {[
                { icon: HiOutlineTruck, text: 'Free Delivery' },
                { icon: HiOutlineShieldCheck, text: 'Genuine Product' },
                { icon: HiOutlineRefresh, text: 'Easy Returns' },
              ].map((badge, i) => (
                <div key={i} className="text-center">
                  <badge.icon className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-dark-500 font-medium">{badge.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-dark-900 mb-6">Customer Reviews ({product.numReviews})</h2>
            <div className="grid gap-4">
              {product.reviews.slice(0, 5).map((review, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {review.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-dark-800 text-sm">{review.name}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    <span className="text-xs text-dark-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-dark-500 text-sm mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-dark-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
