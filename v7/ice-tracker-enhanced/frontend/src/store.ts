import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from './features/activities/activitiesSlice';
import locationsReducer from './features/locations/locationsSlice';
import analyticsReducer from './features/analytics/analyticsSlice';
import uiReducer from './features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    locations: locationsReducer,
    analytics: analyticsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;