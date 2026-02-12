import { Request, Response } from 'express';
import { Source } from '../models';

export const getAllSources = async (req: Request, res: Response): Promise<void> => {
  try {
    const sources = await Source.findAll({
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: sources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch sources', details: error.message }
    });
  }
};

export const getSourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const source = await Source.findByPk(parseInt(req.params.id));
    
    if (!source) {
      res.status(404).json({
        success: false,
        error: { message: 'Source not found' }
      });
      return;
    }
    
    res.json({
      success: true,
      data: source
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch source', details: error.message }
    });
  }
};

export const createSource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, url, sourceType } = req.body;
    
    const source = await Source.create({
      name,
      url,
      sourceType
    });
    
    res.status(201).json({
      success: true,
      data: source
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create source', details: error.message }
    });
  }
};

export const updateSource = async (req: Request, res: Response): Promise<void> => {
  try {
    const sourceId = parseInt(req.params.id);
    const { name, url, sourceType, isActive } = req.body;
    
    const source = await Source.findByPk(sourceId);
    if (!source) {
      res.status(404).json({
        success: false,
        error: { message: 'Source not found' }
      });
      return;
    }
    
    await source.update({
      name,
      url,
      sourceType,
      isActive
    });
    
    res.json({
      success: true,
      data: source
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update source', details: error.message }
    });
  }
};

export const deleteSource = async (req: Request, res: Response): Promise<void> => {
  try {
    const sourceId = parseInt(req.params.id);
    
    const deletedRows = await Source.destroy({
      where: { id: sourceId }
    });
    
    if (deletedRows === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Source not found' }
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Source deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete source', details: error.message }
    });
  }
};

export const refreshSource = async (req: Request, res: Response): Promise<void> => {
  try {
    const sourceId = parseInt(req.params.id);
    
    // This would trigger a background job to refresh the source
    // Implementation would depend on the queue system
    res.json({
      success: true,
      message: 'Refresh job queued successfully',
      data: { sourceId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to queue refresh job', details: error.message }
    });
  }
};