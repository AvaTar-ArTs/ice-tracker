import React, { useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  fetchActivityTrends, 
  fetchLocationDistribution, 
  fetchKeywordFrequency 
} from '../features/analytics/analyticsSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    // Fetch analytics data when component mounts
    dispatch(fetchActivityTrends());
    dispatch(fetchLocationDistribution({ locationType: 'state' }));
    dispatch(fetchKeywordFrequency({ limit: 10 }));
  }, [dispatch]);

  // Prepare data for charts
  const trendData = data.trends?.map((item: any) => ({
    period: new Date(item.period).toLocaleDateString(),
    count: item.count
  })) || [];

  const locationData = data.locationDistribution?.slice(0, 10).map((item: any) => ({
    name: item.locationName,
    count: item.count
  })) || [];

  const keywordData = data.keywordFrequency?.slice(0, 10).map((item: any) => ({
    name: item.term,
    count: item.count
  })) || [];

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      
      {loading && (
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      )}
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Activity Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Activity Trends Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Top Locations */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Top Activity Locations
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={locationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Keyword Frequency */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Top Keywords
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={keywordData}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Activity Distribution by State */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Activity Distribution by State
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {locationData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard;