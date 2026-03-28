import API from './api';

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const updatePassword = (data) => API.put('/auth/password', data);
export const addAddress = (data) => API.post('/auth/address', data);
export const updateAddress = (id, data) => API.put(`/auth/address/${id}`, data);
export const deleteAddress = (id) => API.delete(`/auth/address/${id}`);
export const toggleWishlist = (productId) => API.post(`/auth/wishlist/${productId}`);
