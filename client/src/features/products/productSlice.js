import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const initialFilters = {
  search: '',
  category: '',
  brands: [],
  minPrice: '',
  maxPrice: '',
  rating: '',
  sort: 'featured',
  page: 1,
  limit: 9,
};

const initialState = {
  featured: [],
  items: [],
  categories: [],
  brands: [],
  singleProduct: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  },
  filters: initialFilters,
  loading: false,
  featuredLoading: false,
  productLoading: false,
  error: null,
};

const toApiError = (error, fallbackMessage) => {
  return (
    error.response?.data?.message ||
    error.message ||
    fallbackMessage
  );
};

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/featured');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to fetch featured products'));
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/categories');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to fetch categories'));
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { products } = getState();
      const filters = {
        ...products.filters,
        ...params,
      };

      const query = {
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.search) query.search = filters.search;
      if (filters.category) query.category = filters.category;
      if (filters.brands.length > 0) query.brand = filters.brands.join(',');
      if (filters.minPrice) query.minPrice = filters.minPrice;
      if (filters.maxPrice) query.maxPrice = filters.maxPrice;
      if (filters.rating) query.rating = filters.rating;
      if (filters.sort && filters.sort !== 'featured') query.sort = filters.sort;

      const response = await api.get('/products', { params: query });
      return {
        items: response.data.data.items,
        brands: response.data.data.brands || [],
        pagination: response.data.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to fetch products'));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Failed to fetch product details'));
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.filters = {
        ...initialFilters,
        limit: state.filters.limit,
      };
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
        state.brands = action.payload.brands;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.singleProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;
