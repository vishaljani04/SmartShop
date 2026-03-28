import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';

export const fetchDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try { const res = await adminService.getDashboard(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchAdminUsers = createAsyncThunk('admin/users', async (params, { rejectWithValue }) => {
  try { const res = await adminService.getUsers(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchAdminOrders = createAsyncThunk('admin/orders', async (params, { rejectWithValue }) => {
  try { const res = await adminService.getAdminOrders(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchCategories = createAsyncThunk('admin/categories', async (_, { rejectWithValue }) => {
  try { const res = await adminService.getCategories(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchCoupons = createAsyncThunk('admin/coupons', async (_, { rejectWithValue }) => {
  try { const res = await adminService.getCoupons(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    users: [],
    orders: [],
    categories: [],
    coupons: [],
    pagination: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload.coupons;
      });
  }
});

export default adminSlice.reducer;
