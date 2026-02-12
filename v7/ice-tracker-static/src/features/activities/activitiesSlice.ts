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

    // In the static version, we'll simulate data or connect to an external API
    // For now, returning mock data
    const mockActivities = [
      {
        id: 1,
        title: "ICE Conducts Operation in Chicago Area",
        description: "Immigration officials conducted enforcement actions in the Chicago metropolitan area.",
        link: "https://www.ice.gov/news/releases/example-chicago-operation",
        pubDate: "2023-11-15T10:30:00Z",
        sourceId: 1,
        confidenceScore: 0.9,
        content: "Detailed information about the enforcement operation...",
        createdAt: "2023-11-15T10:30:00Z",
        updatedAt: "2023-11-15T10:30:00Z",
        locations: [
          {
            id: 1,
            name: "Chicago",
            type: "city",
            latitude: 41.8781,
            longitude: -87.6298,
            stateCode: "IL",
            countryCode: "US",
            population: 2693976,
            createdAt: "2023-11-15T10:30:00Z",
            updatedAt: "2023-11-15T10:30:00Z"
          }
        ],
        source: {
          id: 1,
          name: "ICE Breaking News",
          url: "https://www.ice.gov/rss/ice-breaking-news",
          sourceType: "rss",
          isActive: true,
          lastFetched: "2023-11-15T10:30:00Z",
          createdAt: "2023-11-15T10:30:00Z",
          updatedAt: "2023-11-15T10:30:00Z"
        }
      },
      {
        id: 2,
        title: "Workplace Raids in Houston",
        description: "Federal agents conducted workplace enforcement actions in Houston.",
        link: "https://www.ice.gov/news/releases/example-houston-raids",
        pubDate: "2023-11-14T14:20:00Z",
        sourceId: 1,
        confidenceScore: 0.85,
        content: "Details about workplace enforcement in Houston...",
        createdAt: "2023-11-14T14:20:00Z",
        updatedAt: "2023-11-14T14:20:00Z",
        locations: [
          {
            id: 2,
            name: "Houston",
            type: "city",
            latitude: 29.7604,
            longitude: -95.3698,
            stateCode: "TX",
            countryCode: "US",
            population: 2304580,
            createdAt: "2023-11-14T14:20:00Z",
            updatedAt: "2023-11-14T14:20:00Z"
          }
        ],
        source: {
          id: 1,
          name: "ICE Breaking News",
          url: "https://www.ice.gov/rss/ice-breaking-news",
          sourceType: "rss",
          isActive: true,
          lastFetched: "2023-11-15T10:30:00Z",
          createdAt: "2023-11-15T10:30:00Z",
          updatedAt: "2023-11-15T10:30:00Z"
        }
      }
    ];

    return {
      activities: mockActivities,
      pagination: {
        currentPage: 1,
        totalPages: 10,
        totalItems: 100,
        itemsPerPage: 20
      }
    };
  }
);

export const fetchActivityById = createAsyncThunk(
  'activities/fetchActivityById',
  async (id: number) => {
    // Mock implementation
    const mockActivity = {
      id,
      title: `Sample Activity ${id}`,
      description: `Description for activity ${id}`,
      link: "https://www.ice.gov/news/releases/sample",
      pubDate: "2023-11-15T10:30:00Z",
      sourceId: 1,
      confidenceScore: 0.8,
      content: `Detailed content for activity ${id}`,
      createdAt: "2023-11-15T10:30:00Z",
      updatedAt: "2023-11-15T10:30:00Z",
      locations: [
        {
          id: 1,
          name: "Washington",
          type: "city",
          latitude: 38.9072,
          longitude: -77.0369,
          stateCode: "DC",
          countryCode: "US",
          population: 712816,
          createdAt: "2023-11-15T10:30:00Z",
          updatedAt: "2023-11-15T10:30:00Z"
        }
      ],
      source: {
        id: 1,
        name: "ICE Breaking News",
        url: "https://www.ice.gov/rss/ice-breaking-news",
        sourceType: "rss",
        isActive: true,
        lastFetched: "2023-11-15T10:30:00Z",
        createdAt: "2023-11-15T10:30:00Z",
        updatedAt: "2023-11-15T10:30:00Z"
      }
    };
    return mockActivity;
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