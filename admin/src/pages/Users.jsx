import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { HiOutlineSearch } from 'react-icons/hi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    API.get('/admin/users', { params: { page, limit: 20, search, role: roleFilter } })
      .then(r => { setUsers(r.data.users); setPagination(r.data.pagination); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, search, roleFilter]);

  const updateRole = async (id, role) => {
    try { await API.put(`/admin/users/${id}`, { role }); toast.success('Role updated'); load(); }
    catch { toast.error('Failed'); }
  };

  const roleBadge = { user: 'badge-info', storeOwner: 'badge-purple', admin: 'badge-warning' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Users ({pagination.total || 0})</h2>
        <div className="flex items-center space-x-3">
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="input-field !w-auto text-sm !py-2">
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="storeOwner">Store Owners</option>
            <option value="admin">Admins</option>
          </select>
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600/30" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field !pl-9 !py-2 text-sm w-48" />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {['User', 'Role', 'Store', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-[11px] uppercase tracking-wider text-gray-600/30 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-gray-900 text-xs font-bold">
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{u.name}</p>
                      <p className="text-[11px] text-gray-600/40">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4"><span className={roleBadge[u.role]}>{u.role}</span></td>
                <td className="py-3 px-4 text-gray-600/50 text-xs">
                  {u.store ? (
                    <span className="flex items-center space-x-1">
                      <span>{u.store.name}</span>
                      {u.store.isVerified && <span className="text-emerald-400">✓</span>}
                    </span>
                  ) : '—'}
                </td>
                <td className="py-3 px-4 text-gray-600/40 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)}
                    className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
                    <option value="user">User</option>
                    <option value="storeOwner">Store Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-gray-600/30 text-center py-12 text-sm">No users found</p>}
      </div>
    </div>
  );
};

export default Users;
