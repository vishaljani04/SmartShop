import API from './api';

export const createOrder = (data) => API.post('/orders/create', data);
export const verifyPayment = (data) => API.post('/orders/verify-payment', data);
export const getUserOrders = () => API.get('/orders/user');
export const getOrder = (id) => API.get(`/orders/${id}`);
