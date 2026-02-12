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
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.type) queryParams.append('type', params.type);
    if (params.name) queryParams.append('name', params.name);

    const response = await axios.get(`/api/locations?${queryParams.toString()}`);
    return response.data.data.locations;
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