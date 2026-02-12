import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

export const getActivityTrends = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, interval = 'week' } = req.query;
    
    const trends = await AnalyticsService.getActivityTrends(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      interval as 'day' | 'week' | 'month' | 'year'
    );
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch activity trends', details: error.message }
    });
  }
};

export const getLocationDistribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, locationType = 'state' } = req.query;
    
    const distribution = await AnalyticsService.getLocationDistribution(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      locationType as 'city' | 'county' | 'state' | 'country'
    );
    
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch location distribution', details: error.message }
    });
  }
};

export const getKeywordFrequency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, limit = 20 } = req.query;
    
    const keywords = await AnalyticsService.getKeywordFrequency(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      parseInt(limit as string)
    );
    
    res.json({
      success: true,
      data: keywords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch keyword frequency', details: error.message }
    });
  }
};

export const getMonthlyActivitySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year } = req.query;
    
    const summary = await AnalyticsService.getMonthlySummary(
      year ? parseInt(year as string) : undefined
    );
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch monthly summary', details: error.message }
    });
  }
};

export const getGeographicHeatmapData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, locationType = 'state' } = req.query;
    
    const heatmapData = await AnalyticsService.getHeatmapData(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      locationType as 'city' | 'county' | 'state' | 'country'
    );
    
    res.json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch heatmap data', details: error.message }
    });
  }
};