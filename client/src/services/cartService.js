import API from './api';

const mockCart = {
  items: [
    {
      product: {
        _id: "m1",
        title: "Apple iPhone 16 Pro Max - Titanium Desktop Grade",
        price: 159900,
        discountPrice: 149900,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1470&auto=format&fit=crop'],
      },
      quantity: 1,
      variant: { size: '256GB', color: 'Natural Titanium' }
    }
  ]
};

export const getCart = async () => {
    try { return await API.get('/cart'); }
    catch { return { data: { cart: mockCart } }; }
};
export const addToCart = async (data) => {
    try { return await API.post('/cart/add', data); }
    catch { return { data: { cart: mockCart } }; }
};
export const updateCartItem = async (data) => {
    try { return await API.put('/cart/update', data); }
    catch { return { data: { cart: mockCart } }; }
};
export const removeFromCart = async (data) => {
    try { return await API.delete('/cart/remove', { data }); }
    catch { return { data: { cart: { items: [] } } }; }
};
export const clearCart = () => API.delete('/cart/clear');
