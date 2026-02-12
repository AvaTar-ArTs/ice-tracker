import { Sequelize } from 'sequelize';
import { logger } from './utils/logger';

// Database configuration
const dbName = process.env.DB_NAME || 'ice_tracker_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432');

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const setupDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Import all models
    await import('./models');
    
    // Sync all models
    await sequelize.sync({ alter: true }); // Use 'alter: true' to update tables
    logger.info('Database synchronized successfully');
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
};