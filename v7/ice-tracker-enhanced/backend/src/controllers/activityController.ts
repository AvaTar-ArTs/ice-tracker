import { Request, Response } from 'express';
import { Activity, Location, Source, Keyword } from '../models';
import { Op } from 'sequelize';
import moment from 'moment';

export const getAllActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    
    // Additional filters
    const filters: any = {};
    if (req.query.startDate) {
      filters.pubDate = { [Op.gte]: new Date(req.query.startDate as string) };
    }
    if (req.query.endDate) {
      filters.pubDate = { ...filters.pubDate, [Op.lte]: new Date(req.query.endDate as string) };
    }
    if (req.query.sourceId) {
      filters.sourceId = parseInt(req.query.sourceId as string);
    }
    
    const { count, rows: activities } = await Activity.findAndCountAll({
      where: filters,
      include: [
        { model: Source, as: 'source' },
        { model: Location, as: 'locations' }
      ],
      limit,
      offset,
      order: [['pubDate', 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch activities', details: error.message }
    });
  }
};

export const getActivityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const activity = await Activity.findByPk(parseInt(req.params.id), {
      include: [
        { model: Source, as: 'source' },
        { model: Location, as: 'locations' },
        { model: Keyword, as: 'keywords' }
      ]
    });
    
    if (!activity) {
      res.status(404).json({
        success: false,
        error: { message: 'Activity not found' }
      });
      return;
    }
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch activity', details: error.message }
    });
  }
};

export const getActivitiesByLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const locationId = parseInt(req.params.locationId);
    
    const activities = await Activity.findAll({
      include: [
        { 
          model: Location, 
          as: 'locations',
          where: { id: locationId },
          through: { attributes: [] } // Exclude junction table attributes
        },
        { model: Source, as: 'source' }
      ],
      order: [['pubDate', 'DESC']],
      limit: 50
    });
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch activities by location', details: error.message }
    });
  }
};

export const getActivitiesByDateRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: { message: 'Both startDate and endDate are required' }
      });
      return;
    }
    
    const activities = await Activity.findAll({
      where: {
        pubDate: {
          [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
        }
      },
      include: [
        { model: Source, as: 'source' },
        { model: Location, as: 'locations' }
      ],
      order: [['pubDate', 'DESC']]
    });
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch activities by date range', details: error.message }
    });
  }
};

export const getActivitiesBySource = async (req: Request, res: Response): Promise<void> => {
  try {
    const sourceId = parseInt(req.params.sourceId);
    
    const activities = await Activity.findAll({
      where: { sourceId },
      include: [
        { model: Source, as: 'source' },
        { model: Location, as: 'locations' }
      ],
      order: [['pubDate', 'DESC']],
      limit: 50
    });
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch activities by source', details: error.message }
    });
  }
};

export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, link, pubDate, sourceId, confidenceScore, content } = req.body;
    
    const activity = await Activity.create({
      title,
      description,
      link,
      pubDate: new Date(pubDate),
      sourceId,
      confidenceScore,
      content
    });
    
    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create activity', details: error.message }
    });
  }
};

export const updateActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const activityId = parseInt(req.params.id);
    const { title, description, link, pubDate, sourceId, confidenceScore, content } = req.body;
    
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      res.status(404).json({
        success: false,
        error: { message: 'Activity not found' }
      });
      return;
    }
    
    await activity.update({
      title,
      description,
      link,
      pubDate: new Date(pubDate),
      sourceId,
      confidenceScore,
      content
    });
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update activity', details: error.message }
    });
  }
};

export const deleteActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const activityId = parseInt(req.params.id);
    
    const deletedRows = await Activity.destroy({
      where: { id: activityId }
    });
    
    if (deletedRows === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Activity not found' }
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete activity', details: error.message }
    });
  }
};