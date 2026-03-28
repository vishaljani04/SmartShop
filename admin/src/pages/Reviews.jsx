import { useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlineSearch, HiStar } from 'react-icons/hi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReviews = async () => {
    try {
      const { data } = await API.get('/admin/reviews');
      setReviews(data.reviews || []);
    } catch (err) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await API.delete(`/admin/reviews/${productId}/${reviewId}`);
      setReviews(reviews.filter(r => r._id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const filtered = reviews.filter(r => 
    r.comment.toLowerCase().includes(search.toLowerCase()) || 
    r.productTitle.toLowerCase().includes(search.toLowerCase()) ||
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-400 font-semibold">Loading Reviews...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Manage Reviews</h2>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="input-field pl-10 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl w-64">Product</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4 w-1/3">Comment</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 rounded-tr-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 font-medium truncate max-w-[200px]" title={r.productTitle}>{r.productTitle}</td>
                <td className="px-6 py-4 text-gray-600">{r.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-amber-500">
                    <span className="font-bold mr-1 text-gray-900">{r.rating}</span>
                    <HiStar className="w-4 h-4" />
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-sm" title={r.comment}>{r.comment}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(r.productId, r._id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Delete Review">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
