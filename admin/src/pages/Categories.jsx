import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', image: '', description: '', subcategories: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => API.get('/admin/categories').then(r => setCategories(r.data.categories));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const data = { ...form, subcategories: form.subcategories.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editId) { await API.put(`/admin/categories/${editId}`, data); toast.success('Updated'); }
      else { await API.post('/admin/categories', data); toast.success('Created'); }
      setForm({ name: '', image: '', description: '', subcategories: '' }); setEditId(null); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const edit = (c) => { setForm({ name: c.name, image: c.image || '', description: c.description || '', subcategories: c.subcategories?.join(', ') || '' }); setEditId(c._id); setShowForm(true); };
  const del = async (id) => { if (!confirm('Delete?')) return; try { await API.delete(`/admin/categories/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Categories ({categories.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', image: '', description: '', subcategories: '' }); }}
          className="btn-primary text-sm flex items-center space-x-1.5"><HiOutlinePlus className="w-4 h-4" /><span>Add</span></button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="card p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field text-sm" />
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="input-field text-sm" />
          </div>
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field text-sm" />
          <input placeholder="Subcategories (comma-separated)" value={form.subcategories} onChange={(e) => setForm({...form, subcategories: e.target.value})} className="input-field text-sm" />
          <div className="flex space-x-2">
            <button type="submit" className="btn-primary text-sm">{editId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c._id} className="card p-4 hover:border-gray-300 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                {c.image && <img src={c.image} alt="" className="w-10 h-10 rounded-xl object-cover" />}
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
                  <p className="text-[10px] text-gray-600/30">{c.slug}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => edit(c)} className="p-1.5 text-gray-600/40 hover:text-black rounded-lg hover:bg-brand-500/10"><HiOutlinePencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => del(c._id)} className="p-1.5 text-gray-600/40 hover:text-red-400 rounded-lg hover:bg-red-500/10"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            {c.subcategories?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {c.subcategories.map((s, i) => <span key={i} className="text-[10px] bg-white/40 text-gray-600/50 px-2 py-0.5 rounded-md">{s}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
