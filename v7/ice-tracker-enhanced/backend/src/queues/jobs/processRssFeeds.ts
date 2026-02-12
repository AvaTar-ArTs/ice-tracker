import { Job } from 'bull';
import Parser from 'rss-parser';
import axios from 'axios';
import { Activity, Location, Source, Keyword, ActivityKeyword } from '../../models';
import { sequelize } from '../../database';
import { extractLocationsFromText } from '../../utils/locationExtractor';
import { extractKeywordsFromText } from '../../utils/keywordExtractor';
import { logger } from '../../utils/logger';

// Configure RSS parser
const parser = new Parser({
  timeout: 15000,
  headers: { 
    'User-Agent': 'ICE-Tracker-Enhanced/1.0 (Government Transparency)' 
  },
});

/**
 * Process RSS feeds and extract activities
 */
export const processRssFeeds = async (job: Job): Promise<any> => {
  logger.info('Starting RSS feed processing job', { jobId: job.id });
  
  try {
    // Get all active sources
    const sources = await Source.findAll({
      where: { isActive: true, sourceType: 'rss' }
    });
    
    if (sources.length === 0) {
      logger.warn('No active RSS sources found');
      return { message: 'No active RSS sources to process', processedSources: 0 };
    }
    
    const results: any[] = [];
    
    for (const source of sources) {
      try {
        logger.info(`Processing RSS feed: ${source.name}`, { sourceId: source.id, url: source.url });
        
        // Parse the RSS feed
        const feed = await parser.parseURL(source.url);
        
        // Process each item in the feed
        for (const item of feed.items) {
          if (!item.link) {
            logger.warn('Skipping item without link', { title: item.title });
            continue;
          }
          
          // Check if this item already exists
          const existingActivity = await Activity.findOne({
            where: { link: item.link }
          });
          
          if (existingActivity) {
            logger.debug('Skipping duplicate item', { link: item.link });
            continue;
          }
          
          // Extract locations from title and content
          const textForLocation = `${item.title} ${item.contentSnippet || ''} ${item.content || ''}`;
          const extractedLocations = await extractLocationsFromText(textForLocation);
          
          // Extract keywords from title and content
          const extractedKeywords = await extractKeywordsFromText(textForLocation);
          
          // Calculate confidence score based on location extraction
          const confidenceScore = extractedLocations.length > 0 ? 0.9 : 0.5;
          
          // Create the activity
          const activity = await sequelize.transaction(async (transaction) => {
            const newActivity = await Activity.create({
              title: item.title || 'Untitled',
              description: item.contentSnippet || item.content || '',
              link: item.link!,
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
              sourceId: source.id,
              confidenceScore,
              content: item.content || null
            }, { transaction });
            
            // Associate locations with the activity
            if (extractedLocations.length > 0) {
              // Find or create locations in the database
              const locationInstances = [];
              for (const loc of extractedLocations) {
                let location = await Location.findOne({
                  where: { 
                    name: loc.name,
                    type: loc.type
                  },
                  transaction
                });
                
                if (!location) {
                  location = await Location.create({
                    name: loc.name,
                    type: loc.type,
                    latitude: loc.latitude || null,
                    longitude: loc.longitude || null,
                    stateCode: loc.stateCode || null,
                    countryCode: loc.countryCode || 'US'
                  }, { transaction });
                }
                
                locationInstances.push(location);
              }
              
              await newActivity.$set('locations', locationInstances, { transaction });
            }
            
            // Associate keywords with the activity
            if (extractedKeywords.length > 0) {
              const keywordInstances = [];
              for (const kw of extractedKeywords) {
                let keyword = await Keyword.findOne({
                  where: { term: kw.term },
                  transaction
                });
                
                if (!keyword) {
                  keyword = await Keyword.create({
                    term: kw.term,
                    category: kw.category,
                    frequency: 1
                  }, { transaction });
                } else {
                  // Increment frequency
                  await keyword.increment('frequency', { transaction });
                }
                
                keywordInstances.push(keyword);
              }
              
              await newActivity.$add('keywords', keywordInstances, { transaction });
            }
            
            return newActivity;
          });
          
          logger.debug('Created new activity', { 
            activityId: activity.id, 
            title: activity.title.substring(0, 50) + '...' 
          });
        }
        
        // Update the last fetched timestamp for this source
        await source.update({ 
          lastFetched: new Date() 
        });
        
        results.push({
          sourceId: source.id,
          sourceName: source.name,
          itemsProcessed: feed.items.length,
          newItems: feed.items.filter(item => item.link).length // Approximation
        });
        
        logger.info(`Completed processing RSS feed: ${source.name}`, { 
          sourceId: source.id, 
          itemsProcessed: feed.items.length 
        });
      } catch (error) {
        logger.error(`Error processing RSS feed: ${source.name}`, { 
          sourceId: source.id, 
          error: error.message,
          stack: error.stack 
        });
        // Continue with other sources even if one fails
        results.push({
          sourceId: source.id,
          sourceName: source.name,
          error: error.message
        });
      }
    }
    
    logger.info('Completed RSS feed processing job', { 
      jobId: job.id, 
      totalSources: sources.length,
      results 
    });
    
    return {
      message: 'RSS feeds processed successfully',
      processedSources: results.length,
      results
    };
  } catch (error) {
    logger.error('Critical error in RSS processing job', { 
      jobId: job.id, 
      error: error.message,
      stack: error.stack 
    });
    throw error;
  }
};