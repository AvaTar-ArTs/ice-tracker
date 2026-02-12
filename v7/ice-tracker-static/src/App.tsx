import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from './features/activities/activitiesSlice';
import { RootState } from './store';
import { toggleSidebar } from './features/ui/uiSlice';
import Sidebar from './components/Sidebar';
import ActivityMap from './components/ActivityMap';
import ActivityList from './components/ActivityList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ActivityDetail from './components/ActivityDetail';
import Header from './components/Header';

function App() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Fetch initial activities
    dispatch(fetchActivities());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      
      <Sidebar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 60}px)` },
          minHeight: '100vh',
          marginTop: '64px', // Account for header height
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '100%', px: 0 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <Box display="flex" flexDirection="column" height="100%">
                <Box display="flex" flex={1} gap={2} height="calc(100vh - 150px)">
                  <ActivityMap />
                  <ActivityList />
                </Box>
              </Box>
            } />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            <Route path="/map" element={<ActivityMap fullScreen />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;