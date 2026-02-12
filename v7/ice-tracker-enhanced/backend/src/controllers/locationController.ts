import { Request, Response } from 'express';
import { Location } from '../models';
import { Op } from 'sequelize';

export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    
    // Additional filters
    const filters: any = {};
    if (req.query.type) {
      filters.type = req.query.type;
    }
    if (req.query.name) {
      filters.name = { [Op.iLike]: `%${req.query.name}%` };
    }
    
    const { count, rows: locations } = await Location.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: {
        locations,
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
      error: { message: 'Failed to fetch locations', details: error.message }
    });
  }
};

export const getLocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const location = await Location.findByPk(parseInt(req.params.id));
    
    if (!location) {
      res.status(404).json({
        success: false,
        error: { message: 'Location not found' }
      });
      return;
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch location', details: error.message }
    });
  }
};

export const getLocationsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const locationType = req.params.type as 'city' | 'county' | 'state' | 'country';
    
    const locations = await Location.findAll({
      where: { type: locationType },
      order: [['name', 'ASC']],
      limit: 100
    });
    
    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch locations by type', details: error.message }
    });
  }
};

export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, latitude, longitude, stateCode, countryCode, population } = req.body;
    
    const location = await Location.create({
      name,
      type,
      latitude,
      longitude,
      stateCode,
      countryCode,
      population
    });
    
    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create location', details: error.message }
    });
  }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const locationId = parseInt(req.params.id);
    const { name, type, latitude, longitude, stateCode, countryCode, population } = req.body;
    
    const location = await Location.findByPk(locationId);
    if (!location) {
      res.status(404).json({
        success: false,
        error: { message: 'Location not found' }
      });
      return;
    }
    
    await location.update({
      name,
      type,
      latitude,
      longitude,
      stateCode,
      countryCode,
      population
    });
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update location', details: error.message }
    });
  }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const locationId = parseInt(req.params.id);
    
    const deletedRows = await Location.destroy({
      where: { id: locationId }
    });
    
    if (deletedRows === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Location not found' }
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete location', details: error.message }
    });
  }
};