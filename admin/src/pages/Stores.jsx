import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineCheckCircle, HiOutlineBan } from 'react-icons/hi';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    API.get('/admin/stores', { params: { search } }).then(r => { setStores(r.data.stores); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const toggleStatus = async (id, field, value) => {
    try { await API.put(`/admin/stores/${id}`, { [field]: value }); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Stores ({stores.length})</h2>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600/30" />
          <input type="text" placeholder="Search stores..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-9 !py-2 text-sm w-52" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map(s => (
          <div key={s._id} className="card p-5 hover:border-gray-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img src={s.logo || 'https://ui-avatars.com/api/?name=S&background=4f46e5&color=fff'} alt=""
                  className="w-12 h-12 rounded-xl border border-gray-100" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3>
                  <p className="text-[11px] text-gray-600/40">{s.owner?.name} • {s.owner?.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-bold text-gray-900">{s.totalProducts || 0}</p>
                <p className="text-[10px] text-gray-600/30">Products</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-bold text-gray-900">⭐ {s.rating?.toFixed(1)}</p>
                <p className="text-[10px] text-gray-600/30">{s.numRatings} ratings</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-bold text-emerald-400">{fmt(s.totalRevenue)}</p>
                <p className="text-[10px] text-gray-600/30">Revenue</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => toggleStatus(s._id, 'isVerified', !s.isVerified)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  s.isVerified ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-gray-100 text-gray-600/40 border border-gray-100 hover:border-emerald-500/20'
                }`}>
                <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                <span>{s.isVerified ? 'Verified' : 'Verify'}</span>
              </button>
              <button onClick={() => toggleStatus(s._id, 'isActive', !s.isActive)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  s.isActive ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}>
                <HiOutlineBan className="w-3.5 h-3.5" />
                <span>{s.isActive ? 'Active' : 'Suspended'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && <p className="text-gray-600/30 text-center py-20 text-sm">No stores found</p>}
    </div>
  );
};

export default Stores;
