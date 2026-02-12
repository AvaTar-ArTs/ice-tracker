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
    // Mock implementation
    const mockTrends = [
      { period: '2023-10-01', count: 12 },
      { period: '2023-10-08', count: 18 },
      { period: '2023-10-15', count: 15 },
      { period: '2023-10-22', count: 22 },
      { period: '2023-10-29', count: 19 },
      { period: '2023-11-05', count: 25 },
      { period: '2023-11-12', count: 30 }
    ];
    return { type: 'trends', data: mockTrends };
  }
);

export const fetchLocationDistribution = createAsyncThunk(
  'analytics/fetchLocationDistribution',
  async (params: { startDate?: string; endDate?: string; locationType?: string } = {}) => {
    // Mock implementation
    const mockDistribution = [
      { locationName: 'Texas', locationType: 'state', latitude: 31.9686, longitude: -99.9018, count: 45 },
      { locationName: 'California', locationType: 'state', latitude: 36.7783, longitude: -119.4179, count: 38 },
      { locationName: 'Florida', locationType: 'state', latitude: 27.6648, longitude: -81.5158, count: 32 },
      { locationName: 'New York', locationType: 'state', latitude: 43.2994, longitude: -74.2179, count: 28 },
      { locationName: 'Illinois', locationType: 'state', latitude: 40.6331, longitude: -89.3985, count: 25 }
    ];
    return { type: 'locationDistribution', data: mockDistribution };
  }
);

export const fetchKeywordFrequency = createAsyncThunk(
  'analytics/fetchKeywordFrequency',
  async (params: { startDate?: string; endDate?: string; limit?: number } = {}) => {
    // Mock implementation
    const mockKeywords = [
      { term: 'enforcement', count: 120, category: 'activity' },
      { term: 'raid', count: 95, category: 'activity' },
      { term: 'detention', count: 87, category: 'legal' },
      { term: 'deportation', count: 78, category: 'legal' },
      { term: 'border', count: 65, category: 'geographic' },
      { term: 'workplace', count: 54, category: 'location' },
      { term: 'asylum', count: 49, category: 'legal' },
      { term: 'ICE', count: 234, category: 'entity' },
      { term: 'CBP', count: 32, category: 'entity' },
      { term: 'HSA', count: 18, category: 'entity' }
    ];
    return { type: 'keywordFrequency', data: mockKeywords };
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