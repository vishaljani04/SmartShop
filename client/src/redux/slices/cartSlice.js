import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from '../../services/cartService';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.getCart();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const addItem = createAsyncThunk('cart/add', async (data, { rejectWithValue }) => {
  try {
    const res = await cartService.addToCart(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateItem = createAsyncThunk('cart/update', async (data, { rejectWithValue }) => {
  try {
    const res = await cartService.updateCartItem(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const removeItem = createAsyncThunk('cart/remove', async (data, { rejectWithValue }) => {
  try {
    const res = await cartService.removeFromCart(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: { items: [] },
    loading: false,
    error: null
  },
  reducers: {
    clearCartState: (state) => {
      state.cart = { items: [] };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
      });
  }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
