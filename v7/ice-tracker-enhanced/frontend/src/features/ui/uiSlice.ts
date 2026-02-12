import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  mapCenter: [number, number];
  mapZoom: number;
  selectedLocation: number | null;
  selectedActivity: number | null;
  darkMode: boolean;
  loading: boolean;
  toast: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
}

const initialState: UiState = {
  sidebarOpen: true,
  mapCenter: [-98.5795, 39.8283], // Center of USA
  mapZoom: 3,
  selectedLocation: null,
  selectedActivity: null,
  darkMode: false,
  loading: false,
  toast: {
    open: false,
    message: '',
    severity: 'info'
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMapCenter: (state, action: PayloadAction<[number, number]>) => {
      state.mapCenter = action.payload;
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<number | null>) => {
      state.selectedLocation = action.payload;
    },
    setSelectedActivity: (state, action: PayloadAction<number | null>) => {
      state.selectedActivity = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; severity: 'success' | 'error' | 'warning' | 'info' }>
    ) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity
      };
    },
    hideToast: (state) => {
      state.toast.open = false;
    }
  }
});

export const {
  toggleSidebar,
  setMapCenter,
  setMapZoom,
  setSelectedLocation,
  setSelectedActivity,
  toggleDarkMode,
  setLoading,
  showToast,
  hideToast
} = uiSlice.actions;

export default uiSlice.reducer;