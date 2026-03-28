import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discount: '', type: 'percentage', expiry: '', minAmount: '', maxDiscount: '', maxUses: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => API.get('/admin/coupons').then(r => setCoupons(r.data.coupons));
  useEffect(() => { load(); }, []);

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const submit = async (e) => {
    e.preventDefault();
    const data = { ...form, discount: Number(form.discount), minAmount: form.minAmount ? Number(form.minAmount) : 0, maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : 0, maxUses: form.maxUses ? Number(form.maxUses) : 0 };
    try {
      if (editId) { await API.put(`/admin/coupons/${editId}`, data); toast.success('Updated'); }
      else { await API.post('/admin/coupons', data); toast.success('Created'); }
      setForm({ code: '', discount: '', type: 'percentage', expiry: '', minAmount: '', maxDiscount: '', maxUses: '' }); setEditId(null); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const edit = (c) => { setForm({ code: c.code, discount: c.discount, type: c.type, expiry: c.expiry?.split('T')[0] || '', minAmount: c.minAmount || '', maxDiscount: c.maxDiscount || '', maxUses: c.maxUses || '' }); setEditId(c._id); setShowForm(true); };
  const del = async (id) => { if (!confirm('Delete?')) return; try { await API.delete(`/admin/coupons/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Coupons ({coupons.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ code: '', discount: '', type: 'percentage', expiry: '', minAmount: '', maxDiscount: '', maxUses: '' }); }}
          className="btn-primary text-sm flex items-center space-x-1.5"><HiOutlinePlus className="w-4 h-4" /><span>Add</span></button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Code" value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} className="input-field text-sm" />
            <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="input-field text-sm">
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input required type="number" placeholder="Discount" value={form.discount} onChange={(e) => setForm({...form, discount: e.target.value})} className="input-field text-sm" />
            <input required type="date" value={form.expiry} onChange={(e) => setForm({...form, expiry: e.target.value})} className="input-field text-sm" />
            <input type="number" placeholder="Min Amount" value={form.minAmount} onChange={(e) => setForm({...form, minAmount: e.target.value})} className="input-field text-sm" />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="btn-primary text-sm">{editId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {['Code', 'Discount', 'Min Amount', 'Expiry', 'Used', 'Status', ''].map(h => (
                <th key={h} className="text-left py-3 px-4 text-[11px] uppercase tracking-wider text-gray-600/30 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-black">{c.code}</td>
                <td className="py-3 px-4 text-gray-800">{c.type === 'percentage' ? `${c.discount}%` : fmt(c.discount)}</td>
                <td className="py-3 px-4 text-gray-600/50">{c.minAmount ? fmt(c.minAmount) : '—'}</td>
                <td className="py-3 px-4 text-gray-600/50 text-xs">{new Date(c.expiry).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-gray-600/50">{c.usedCount}{c.maxUses > 0 ? `/${c.maxUses}` : ''}</td>
                <td className="py-3 px-4"><span className={c.isActive && new Date(c.expiry) > new Date() ? 'badge-success' : 'badge-danger'}>{c.isActive && new Date(c.expiry) > new Date() ? 'Active' : 'Expired'}</span></td>
                <td className="py-3 px-4">
                  <div className="flex space-x-1">
                    <button onClick={() => edit(c)} className="p-1.5 text-gray-600/40 hover:text-black rounded-lg hover:bg-brand-500/10"><HiOutlinePencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => del(c._id)} className="p-1.5 text-gray-600/40 hover:text-red-400 rounded-lg hover:bg-red-500/10"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="text-gray-600/30 text-center py-8 text-sm">No coupons</p>}
      </div>
    </div>
  );
};

export default Coupons;
