import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchActivityById } from '../features/activities/activitiesSlice';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.activities);
  
  const activity = items.find((item) => item.id === Number(id)) || null;

  useEffect(() => {
    if (!activity) {
      dispatch(fetchActivityById(Number(id)));
    }
  }, [id, activity, dispatch]);

  if (!activity) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5">Activity not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h4" component="h1">
                {activity.title}
              </Typography>
              <Chip 
                label={`Confidence: ${activity.confidenceScore.toFixed(2)}`} 
                color={activity.confidenceScore > 0.7 ? 'primary' : 'secondary'} 
                sx={{ ml: 2 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="body1" paragraph>
                  {activity.description || activity.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Published: {new Date(activity.pubDate).toLocaleString()}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <LinkIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Source: {activity.source?.name || 'Unknown'}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOnIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Locations: {activity.locations?.map(loc => `${loc.name}, ${loc.stateCode}`).join(', ') || 'Not specified'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Keywords:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {activity.keywords?.map((keyword) => (
                    <Chip 
                      key={keyword.id} 
                      label={keyword.term} 
                      size="small" 
                      color="default" 
                    />
                  )) || 'None detected'}
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  External Link:
                </Typography>
                <a href={activity.link} target="_blank" rel="noopener noreferrer">
                  {activity.link}
                </a>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ActivityDetail;