import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const StoreProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/store/${id}/profile`)
      .then(r => { setData(r.data); setLoading(false); })
      .catch((e) => { toast.error(e.response?.data?.message || 'Store not found'); setLoading(false); });
  }, [id]);

  if (loading) return <div className="pt-24 min-h-screen"><LoadingSpinner text="Loading store profile..." /></div>;
  if (!data?.store) return <div className="pt-24 min-h-screen text-center text-dark-500">Store not found</div>;

  const { store, products } = data;

  return (
    <div className="pt-16 min-h-screen bg-dark-50">
      {/* Store Header Banner */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900 border-b border-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-2xl flex-shrink-0">
              <img src={store.logo || 'https://via.placeholder.com/150'} alt={store.name} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex-1 text-center md:text-left text-white">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                {store.isVerified && <HiOutlineShieldCheck className="w-6 h-6 text-emerald-400" title="Verified Store" />}
              </div>
              <p className="text-primary-100 max-w-2xl text-sm leading-relaxed mb-4">{store.description}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <StarRating rating={store.rating} size="sm" />
                  <span className="text-primary-100">({store.numRatings} reviews)</span>
                </div>
                {store.email && (
                  <div className="flex items-center space-x-1.5 text-primary-200">
                    <HiOutlineMail className="w-4 h-4" /><span>{store.email}</span>
                  </div>
                )}
                {store.phone && (
                  <div className="flex items-center space-x-1.5 text-primary-200">
                    <HiOutlinePhone className="w-4 h-4" /><span>{store.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark-900">Products from {store.name}</h2>
          <span className="badge-primary text-sm">{products.length} Items</span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="card p-12 text-center border-dashed border-2">
            <p className="text-dark-500 font-medium">This store hasn't added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreProfilePage;
