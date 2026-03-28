import API from './api';

export const getDashboard = () => API.get('/admin/dashboard');
export const getUsers = (params) => API.get('/admin/users', { params });
export const updateUserRole = (id, data) => API.put(`/admin/users/${id}`, data);
export const getAdminOrders = (params) => API.get('/admin/orders', { params });
export const updateOrderStatus = (id, data) => API.put(`/admin/orders/${id}`, data);
export const processRefund = (id) => API.post(`/admin/orders/${id}/refund`);
export const getCategories = () => API.get('/admin/categories');
export const createCategory = (data) => API.post('/admin/categories', data);
export const updateCategory = (id, data) => API.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/admin/categories/${id}`);
export const getCoupons = () => API.get('/admin/coupons');
export const createCoupon = (data) => API.post('/admin/coupons', data);
export const updateCoupon = (id, data) => API.put(`/admin/coupons/${id}`, data);
export const deleteCoupon = (id) => API.delete(`/admin/coupons/${id}`);
export const validateCoupon = (data) => API.post('/admin/coupons/validate', data);
