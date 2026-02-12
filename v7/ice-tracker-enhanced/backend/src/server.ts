import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { WebSocketServer } from 'ws';
import http from 'http';
import { setupRoutes } from './routes';
import { setupDatabase } from './database';
import { setupQueues } from './queues';
import { setupWebSocket } from './websocket';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Database setup
setupDatabase()
  .then(() => {
    logger.info('Database connected successfully');
    
    // Setup queues for background processing
    setupQueues();
    
    // Setup API routes
    setupRoutes(app);
    
    // Setup WebSocket server
    const wss = setupWebSocket(server);
    
    // Error handling middleware
    app.use(errorHandler);
    
    // Start server
    const PORT = process.env.PORT || 3007;
    server.listen(PORT, () => {
      logger.info(`Enhanced ICE Tracker server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Failed to connect to database:', err);
    process.exit(1);
  });