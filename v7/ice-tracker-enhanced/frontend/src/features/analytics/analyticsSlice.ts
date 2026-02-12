import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AnalyticsData } from '../../types';

interface AnalyticsState {
  data: Partial<AnalyticsData>;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: {},
  loading: false,
  error: null,
};

// Async thunks for analytics
export const fetchActivityTrends = createAsyncThunk(
  'analytics/fetchActivityTrends',
  async (params: { startDate?: string; endDate?: string; interval?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.interval) queryParams.append('interval', params.interval);

    const response = await axios.get(`/api/analytics/trends?${queryParams.toString()}`);
    return { type: 'trends', data: response.data.data };
  }
);

export const fetchLocationDistribution = createAsyncThunk(
  'analytics/fetchLocationDistribution',
  async (params: { startDate?: string; endDate?: string; locationType?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.locationType) queryParams.append('locationType', params.locationType);

    const response = await axios.get(`/api/analytics/location-distribution?${queryParams.toString()}`);
    return { type: 'locationDistribution', data: response.data.data };
  }
);

export const fetchKeywordFrequency = createAsyncThunk(
  'analytics/fetchKeywordFrequency',
  async (params: { startDate?: string; endDate?: string; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await axios.get(`/api/analytics/keyword-frequency?${queryParams.toString()}`);
    return { type: 'keywordFrequency', data: response.data.data };
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsData: (state) => {
      state.data = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityTrends.fulfilled, (state, { payload }) => {
        state.data = { ...state.data, [payload.type]: payload.data };
      })
      .addCase(fetchLocationDistribution.fulfilled, (state, { payload }) => {
        state.data = { ...state.data, [payload.type]: payload.data };
      })
      .addCase(fetchKeywordFrequency.fulfilled, (state, { payload }) => {
        state.data = { ...state.data, [payload.type]: payload.data };
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, { error }) => {
          state.error = error.message || 'Failed to fetch analytics';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      );
  }
});

export const { clearAnalyticsData } = analyticsSlice.actions;
export default analyticsSlice.reducer;