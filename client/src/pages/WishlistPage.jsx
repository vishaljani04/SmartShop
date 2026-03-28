import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../redux/slices/authSlice';
import ProductCard from '../components/ProductCard';
import { HiOutlineHeart } from 'react-icons/hi';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => { dispatch(loadUser()); }, [dispatch]);

  const wishlist = user?.wishlist || [];

  return (
    <div className="pt-20 pb-16 min-h-screen bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 mb-8 flex items-center space-x-2">
          <HiOutlineHeart className="w-7 h-7 text-red-500" />
          <span>My Wishlist</span>
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 card p-12">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-xl font-bold text-dark-800 mb-2">Your wishlist is empty</h2>
            <p className="text-dark-400 mb-6">Save your favorite items to buy later</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {wishlist.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
