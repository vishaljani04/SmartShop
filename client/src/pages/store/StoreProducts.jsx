import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const StoreProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ 
    title: '', description: '', price: '', discountPrice: '', stock: '', category: '', brand: '', images: '', globalPartner: 'None', 
    variants: [] 
  });
  const [globalPartners, setGlobalPartners] = useState(['Amazon', 'Flipkart', 'Myntra', 'Reliance Digital', 'Croma', 'Tata CLiQ', 'Ajio', 'Jiomart']);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    api.get('/store/products').then(r => setProducts(r.data.products));
    api.get('/products/categories').then(r => setCategories(r.data));
    api.get('/products/global-partners').then(r => {
      const fetched = r.data.partners;
      const defaultPartners = ['Amazon', 'Flipkart', 'Myntra', 'Reliance Digital', 'Croma', 'Tata CLiQ', 'Ajio', 'Jiomart'];
      const merged = [...new Set([...defaultPartners, ...fetched])];
      setGlobalPartners(merged);
    });
  };
  
  useEffect(() => { load(); }, []);

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

  const reset = () => { 
    setForm({ title: '', description: '', price: '', discountPrice: '', stock: '', category: '', brand: '', images: '', globalPartner: 'None', variants: [] }); 
    setEditId(null); 
    setShowForm(false); 
  };

  const submit = async (e) => {
    e.preventDefault();
    const data = { 
      ...form, 
      price: Number(form.price), 
      stock: Number(form.stock), 
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined, 
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      variants: form.variants.map(v => ({
        ...v,
        price: v.price ? Number(v.price) : undefined,
        stock: v.stock ? Number(v.stock) : 0
      }))
    };
    try {
      if (editId) { await api.put(`/store/products/${editId}`, data); toast.success('Updated'); }
      else { await api.post('/store/products', data); toast.success('Created'); }
      reset(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const edit = (p) => { 
    setForm({ 
      title: p.title, 
      description: p.description, 
      price: p.price, 
      discountPrice: p.discountPrice || '', 
      stock: p.stock, 
      category: p.category?._id || '', 
      brand: p.brand, 
      images: p.images?.join(', ') || '', 
      globalPartner: p.globalPartner || 'None',
      variants: p.variants || []
    }); 
    setEditId(p._id); 
    setShowForm(true); 
  };
  const del = async (id) => { if (!confirm('Delete Product?')) return; try { await api.delete(`/store/products/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Error'); } };

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploadedUrls = [];
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const uploadUrl = apiUrl.replace('/api', '/api/upload');
      
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        
        const baseUrl = apiUrl.replace('/api', '');
        uploadedUrls.push(baseUrl + data.url);
      }
      
      const currentImages = form.images ? form.images.split(',').map(s=>s.trim()).filter(Boolean) : [];
      setForm({ ...form, images: [...currentImages, ...uploadedUrls].join(', ') });
      toast.success('Images uploaded');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };
  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { size: '', color: '', stock: 0, price: '' }] });
  };

  const removeVariant = (index) => {
    const newVariants = form.variants.filter((_, i) => i !== index);
    setForm({ ...form, variants: newVariants });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;
    setForm({ ...form, variants: newVariants });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">My Products ({products.length})</h2>
        <button onClick={() => { reset(); setShowForm(true); }} className="btn-primary text-sm flex items-center space-x-1.5 px-4 py-2">
          <HiOutlinePlus className="w-4 h-4" /><span>Add Product</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-500 mb-1">Title</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" /></div>
            <div><label className="block text-xs font-semibold text-slate-500 mb-1">Brand</label><input required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="input-field" /></div>
            <div><label className="block text-xs font-semibold text-slate-500 mb-1">Price (₹)</label><input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field" /></div>
            <div><label className="block text-xs font-semibold text-slate-500 mb-1">Discount Price (₹)</label><input type="number" value={form.discountPrice} onChange={e => setForm({...form, discountPrice: e.target.value})} className="input-field" /></div>
            <div><label className="block text-xs font-semibold text-slate-500 mb-1">Stock</label><input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input-field" /></div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Global Partner</label>
              <input 
                list="global-partners-list" 
                value={form.globalPartner} 
                onChange={e => setForm({...form, globalPartner: e.target.value})} 
                className="input-field" 
                placeholder="Select or type new..."
              />
              <datalist id="global-partners-list">
                <option value="None" />
                {globalPartners.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-500 mb-1">Description</label><textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field min-h-[80px]" /></div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Images (Upload or comma separated URLs)</label>
            <div className="flex space-x-2">
              <input required value={form.images} onChange={e => setForm({...form, images: e.target.value})} className="input-field flex-1" />
              <div className="relative overflow-hidden w-24 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                 <button type="button" className="w-full text-xs font-semibold h-full absolute inset-0 py-0 flex items-center justify-center pointer-events-none text-slate-700">
                   {uploading ? 'Wait...' : 'Upload'}
                 </button>
                 <input type="file" multiple accept="image/*" onChange={uploadFileHandler} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
              </div>
            </div>
          </div>
          {/* Variants Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">Product Variants (Optional)</label>
              <button type="button" onClick={addVariant} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1">
                <span>+ Add Variant</span>
              </button>
            </div>
            {form.variants.length > 0 && (
              <div className="space-y-3">
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 items-end bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div><label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Size</label><input placeholder="XL, 8, etc" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="input-field text-xs py-1.5" /></div>
                    <div><label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Color</label><input placeholder="Blue, Red" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} className="input-field text-xs py-1.5" /></div>
                    <div><label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Price</label><input type="number" placeholder="Custom Price" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} className="input-field text-xs py-1.5" /></div>
                    <div><label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Stock</label><input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="input-field text-xs py-1.5" /></div>
                    <div className="text-right pb-1">
                      <button type="button" onClick={() => removeVariant(i)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="submit" className="btn-primary flex-1">{editId ? 'Update Product' : 'Create Product'}</button>
            <button type="button" onClick={reset} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs tracking-wider uppercase">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center space-x-3">
                    <img src={p.images[0] || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <div className="font-semibold text-slate-900">{p.title}</div>
                  </div>
                </td>
                <td className="px-5 py-3 font-medium text-slate-700">{fmt(p.price)}</td>
                <td className="px-5 py-3">{p.stock}</td>
                <td className="px-5 py-3"><span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${p.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
                <td className="px-5 py-3 text-right space-x-2">
                  <button onClick={() => edit(p)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
                  <button onClick={() => del(p._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center text-slate-500 py-10">You haven't added any products yet.</p>}
      </div>
    </div>
  );
};

export default StoreProducts;
