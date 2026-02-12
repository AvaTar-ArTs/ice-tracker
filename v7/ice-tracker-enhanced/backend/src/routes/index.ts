import { Application } from 'express';
import { activityRoutes } from './activityRoutes';
import { locationRoutes } from './locationRoutes';
import { sourceRoutes } from './sourceRoutes';
import { analyticsRoutes } from './analyticsRoutes';

export const setupRoutes = (app: Application): void => {
  app.use('/api/activities', activityRoutes);
  app.use('/api/locations', locationRoutes);
  app.use('/api/sources', sourceRoutes);
  app.use('/api/analytics', analyticsRoutes);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  
  // Catch-all for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({ 
      success: false, 
      error: { message: 'Route not found' } 
    });
  });
};