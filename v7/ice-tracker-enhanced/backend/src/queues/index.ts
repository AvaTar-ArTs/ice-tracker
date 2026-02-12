import Queue from 'bull';
import { processRssFeeds } from './jobs/processRssFeeds';
import { logger } from '../utils/logger';

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined
};

// Create queues
export const rssQueue = new Queue('rss processing', {
  redis: redisConfig
});

export const emailQueue = new Queue('email notifications', {
  redis: redisConfig
});

export const analyticsQueue = new Queue('analytics processing', {
  redis: redisConfig
});

export const setupQueues = (): void => {
  // Process RSS feeds queue
  rssQueue.process('process feeds', processRssFeeds);
  
  // Handle queue events
  rssQueue.on('completed', (job) => {
    logger.info(`Job ${job.id} completed successfully`, { result: job.returnvalue });
  });
  
  rssQueue.on('failed', (job, err) => {
    logger.error(`Job ${job.id} failed`, { error: err.message, stack: err.stack });
  });
  
  rssQueue.on('error', (err) => {
    logger.error('RSS queue error', { error: err.message, stack: err.stack });
  });
  
  logger.info('Queues initialized successfully');
};