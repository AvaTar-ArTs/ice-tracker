import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Activity, ActivityFilters } from '../../types';

interface ActivitiesState {
  items: Activity[];
  filteredItems: Activity[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filters: ActivityFilters;
}

const initialState: ActivitiesState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  filters: {
    page: 1,
    limit: 20,
    startDate: null,
    endDate: null,
    locationId: null,
    sourceId: null
  }
};

// Async thunks
export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (params: { page?: number; limit?: number; startDate?: string; endDate?: string; locationId?: number; sourceId?: number } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.locationId) queryParams.append('locationId', params.locationId.toString());
    if (params.sourceId) queryParams.append('sourceId', params.sourceId.toString());

    const response = await axios.get(`/api/activities?${queryParams.toString()}`);
    return response.data.data;
  }
);

export const fetchActivityById = createAsyncThunk(
  'activities/fetchActivityById',
  async (id: number) => {
    const response = await axios.get(`/api/activities/${id}`);
    return response.data.data;
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ActivityFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload.activities;
        state.filteredItems = payload.activities;
        state.currentPage = payload.pagination.currentPage;
        state.totalPages = payload.pagination.totalPages;
        state.totalItems = payload.pagination.totalItems;
      })
      .addCase(fetchActivities.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Failed to fetch activities';
      })
      .addCase(fetchActivityById.fulfilled, (state, { payload }) => {
        // Add or update the specific activity in the list
        const index = state.items.findIndex(item => item.id === payload.id);
        if (index >= 0) {
          state.items[index] = payload;
        } else {
          state.items.unshift(payload);
        }
      });
  }
});

export const { setFilters, clearFilters, setCurrentPage } = activitiesSlice.actions;
export default activitiesSlice.reducer;