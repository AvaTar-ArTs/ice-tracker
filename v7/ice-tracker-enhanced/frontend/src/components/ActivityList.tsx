import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Paper, 
  Typography, 
  Chip,
  Box,
  Pagination
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Activity } from '../types';
import { setCurrentPage } from '../features/activities/activitiesSlice';
import { setSelectedActivity } from '../features/ui/uiSlice';
import { Link } from 'react-router-dom';

const ActivityList = () => {
  const dispatch = useDispatch();
  const { items: activities, currentPage, totalPages, totalItems } = useSelector(
    (state: RootState) => state.activities
  );
  const { loading } = useSelector((state: RootState) => state.activities);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setCurrentPage(value));
    dispatch(setSelectedActivity(null));
  };

  return (
    <Paper elevation={3} sx={{ width: '400px', maxHeight: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities ({totalItems})
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography>Loading activities...</Typography>
        </Box>
      ) : (
        <>
          <List dense>
            {activities.map((activity: Activity) => (
              <ListItem 
                key={activity.id} 
                button
                component={Link}
                to={`/activity/${activity.id}`}
                onClick={() => dispatch(setSelectedActivity(activity.id))}
                sx={{ 
                  borderBottom: '1px solid #eee',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography 
                        variant="subtitle2" 
                        noWrap
                        sx={{ 
                          maxWidth: '200px',
                          display: 'inline-block'
                        }}
                      >
                        {activity.title}
                      </Typography>
                      <Chip 
                        label={activity.confidenceScore.toFixed(2)} 
                        size="small" 
                        color={activity.confidenceScore > 0.7 ? 'primary' : 'secondary'} 
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {activity.pubDate.split('T')[0]} • {activity.source?.name || 'Unknown Source'}
                      </Typography>
                      <br />
                      {activity.locations && activity.locations.length > 0 && (
                        <Typography component="span" variant="body2" color="textSecondary">
                          {activity.locations[0].name}, {activity.locations[0].stateCode}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default ActivityList;