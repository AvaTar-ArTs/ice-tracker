import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, Marker, Popup, NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl';
import { Box, Paper, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Activity } from '../types';
import { setMapCenter, setMapZoom, setSelectedActivity } from '../features/ui/uiSlice';

// @ts-ignore
mapboxgl.workerClass = () => new Worker(new URL('mapbox-gl/dist/mapbox-gl-csp-worker', import.meta.url));

interface ActivityMapProps {
  fullScreen?: boolean;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''; // Mapbox token should be set in environment variables

const ActivityMap: React.FC<ActivityMapProps> = ({ fullScreen = false }) => {
  const dispatch = useDispatch();
  const { activities } = useSelector((state: RootState) => state.activities);
  const { mapCenter, mapZoom, selectedActivity } = useSelector((state: RootState) => state.ui);
  const [popupInfo, setPopupInfo] = useState<Activity | null>(null);

  // Set mapbox token
  useEffect(() => {
    if (MAPBOX_TOKEN) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
    }
  }, []);

  // Handle map interaction
  const handleMapClick = (event: any) => {
    // Close popup when clicking elsewhere
    setPopupInfo(null);
    dispatch(setSelectedActivity(null));
  };

  // Handle marker click
  const handleMarkerClick = (activity: Activity) => {
    setPopupInfo(activity);
    dispatch(setSelectedActivity(activity.id));
  };

  // Prepare markers from activities
  const markers = activities
    .filter(activity => 
      activity.locations && 
      activity.locations.length > 0 && 
      activity.locations[0].latitude && 
      activity.locations[0].longitude
    )
    .map(activity => {
      const location = activity.locations![0];
      return (
        <Marker
          key={activity.id}
          latitude={parseFloat(location.latitude!.toString())}
          longitude={parseFloat(location.longitude!.toString())}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            handleMarkerClick(activity);
          }}
        >
          <Box
            sx={{
              fontSize: 20,
              color: activity.confidenceScore > 0.7 ? '#1976d2' : '#e57373',
              cursor: 'pointer',
              '&:hover': {
                color: '#f50057',
              }
            }}
          >
            📍
          </Box>
        </Marker>
      );
    });

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: fullScreen ? '100vh' : '100%', 
        width: fullScreen ? '100vw' : '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Map
        initialViewState={{
          longitude: mapCenter[0],
          latitude: mapCenter[1],
          zoom: mapZoom
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={handleMapClick}
        onMove={(evt) => {
          dispatch(setMapCenter([evt.viewState.longitude, evt.viewState.latitude]));
          dispatch(setMapZoom(evt.viewState.zoom));
        }}
      >
        {markers}
        
        {popupInfo && (
          <Popup
            longitude={parseFloat(popupInfo.locations![0].longitude!.toString())}
            latitude={parseFloat(popupInfo.locations![0].latitude!.toString())}
            onClose={() => {
              setPopupInfo(null);
              dispatch(setSelectedActivity(null));
            }}
          >
            <Box>
              <Typography variant="subtitle2">{popupInfo.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {popupInfo.pubDate.split('T')[0]}
              </Typography>
              <Typography variant="body2">
                {popupInfo.locations![0].name}, {popupInfo.locations![0].stateCode}
              </Typography>
            </Box>
          </Popup>
        )}
        
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl />
      </Map>
    </Paper>
  );
};

export default ActivityMap;