import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Location } from '../../types';

interface LocationsState {
  items: Location[];
  loading: boolean;
  error: string | null;
}

const initialState: LocationsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async (params: { page?: number; limit?: number; type?: string; name?: string } = {}) => {
    // Mock implementation for static version
    const mockLocations = [
      {
        id: 1,
        name: "New York",
        type: "city",
        latitude: 40.7128,
        longitude: -74.0060,
        stateCode: "NY",
        countryCode: "US",
        population: 8336817,
        createdAt: "2023-11-15T10:30:00Z",
        updatedAt: "2023-11-15T10:30:00Z"
      },
      {
        id: 2,
        name: "California",
        type: "state",
        latitude: 36.7783,
        longitude: -119.4179,
        stateCode: "CA",
        countryCode: "US",
        population: 39538223,
        createdAt: "2023-11-15T10:30:00Z",
        updatedAt: "2023-11-15T10:30:00Z"
      },
      {
        id: 3,
        name: "Texas",
        type: "state",
        latitude: 31.9686,
        longitude: -99.9018,
        stateCode: "TX",
        countryCode: "US",
        population: 29145505,
        createdAt: "2023-11-15T10:30:00Z",
        updatedAt: "2023-11-15T10:30:00Z"
      }
    ];
    return mockLocations;
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchLocations.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Failed to fetch locations';
      });
  }
});

export default locationsSlice.reducer;