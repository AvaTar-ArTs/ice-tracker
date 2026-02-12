import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction): void => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  };

  res.status(statusCode).json(errorResponse);
};