import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../redux/slices/authSlice';
import { HiOutlineUser, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => { dispatch(loadUser()); }, [dispatch]);

  if (!user) return null;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-dark-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-900">{user.name}</h2>
              <p className="text-dark-400 text-sm">{user.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-dark-50 rounded-xl">
              <HiOutlineUser className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-dark-400">Name</p>
                <p className="text-sm font-semibold text-dark-800">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-50 rounded-xl">
              <HiOutlineMail className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-dark-400">Email</p>
                <p className="text-sm font-semibold text-dark-800">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-dark-900 mb-4 flex items-center space-x-2">
            <HiOutlineLocationMarker className="w-5 h-5 text-primary-600" />
            <span>Saved Addresses</span>
          </h3>

          {user.addresses?.length === 0 ? (
            <p className="text-dark-400 text-sm">No addresses saved yet</p>
          ) : (
            <div className="grid gap-3">
              {user.addresses?.map(addr => (
                <div key={addr._id} className="p-4 rounded-xl border border-dark-200 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-dark-800 text-sm">{addr.fullName}</p>
                      <p className="text-sm text-dark-500 mt-0.5">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-xs text-dark-400 mt-0.5">📱 {addr.phone}</p>
                    </div>
                    {addr.isDefault && <span className="badge-success">Default</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
