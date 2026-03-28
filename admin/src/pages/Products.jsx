import { useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await API.get(`/admin/products`);
      setProducts(data.products || []);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-400 font-semibold">Loading Products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Manage Products</h2>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
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
              <th className="px-6 py-4 rounded-tl-xl">Title</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Store</th>
              <th className="px-6 py-4 rounded-tr-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{p.title}</td>
                <td className="px-6 py-4 text-gray-600">{p.brand || 'N/A'}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{fmt(p.discountPrice || p.price)}</td>
                <td className="px-6 py-4">
                  <span className={p.stock > 10 ? 'badge-success' : 'badge-danger'}>{p.stock} units</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{p.store?.name || 'SmartShop'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Delete Product">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
