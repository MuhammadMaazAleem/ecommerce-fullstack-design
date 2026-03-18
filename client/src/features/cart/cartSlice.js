import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
import { getSessionId } from '../../api/session';

const initialState = {
  sessionId: getSessionId(),
  cart: null,
  loading: false,
  actionLoading: false,
  error: null,
};

const toApiError = (error, fallbackMessage) => {
  return (
    error.response?.data?.message ||
    error.message ||
    fallbackMessage
  );
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const response = await api.get(`/cart/${cart.sessionId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to fetch cart'));
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const response = await api.post(`/cart/${cart.sessionId}/add`, {
        productId,
        quantity,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to add item to cart'));
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  'cart/updateCartItemQty',
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const response = await api.put(`/cart/${cart.sessionId}/update`, {
        productId,
        quantity,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to update cart item'));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const response = await api.delete(`/cart/${cart.sessionId}/remove/${productId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to remove cart item'));
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { cart } = getState();
      const response = await api.delete(`/cart/${cart.sessionId}/clear`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to clear cart'));
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemQty.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cart = action.payload;
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
