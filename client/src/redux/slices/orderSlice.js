import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderService from '../../services/orderService';

export const createNewOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await orderService.createOrder(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const verifyPayment = createAsyncThunk('orders/verify', async (data, { rejectWithValue }) => {
  try {
    const res = await orderService.verifyPayment(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchUserOrders = createAsyncThunk('orders/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const res = await orderService.getUserOrders();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    paymentSuccess: false
  },
  reducers: {
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.paymentSuccess = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.paymentSuccess = true;
        state.currentOrder = action.payload.order;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.paymentSuccess = false;
        state.error = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
