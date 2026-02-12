import { Activity, Location, Keyword } from '../models';
import { Op, fn, col, literal, QueryTypes } from 'sequelize';
import { sequelize } from '../database';
import moment from 'moment';

export interface TrendDataPoint {
  period: string;
  count: number;
  avgConfidence?: number;
}

export interface LocationDistribution {
  locationName: string;
  locationType: string;
  latitude: number | null;
  longitude: number | null;
  count: number;
}

export interface KeywordFrequency {
  term: string;
  count: number;
  category: string;
}

export interface MonthlySummary {
  month: string;
  totalActivities: number;
  avgConfidence: number;
}

export interface HeatmapDataPoint {
  locationName: string;
  latitude: number;
  longitude: number;
  activityCount: number;
}

export class AnalyticsService {
  /**
   * Get activity trends over time
   */
  static async getActivityTrends(
    startDate?: Date,
    endDate?: Date,
    interval: 'day' | 'week' | 'month' | 'year' = 'week'
  ): Promise<TrendDataPoint[]> {
    const whereCondition: any = {};
    if (startDate || endDate) {
      whereCondition.pubDate = {};
      if (startDate) whereCondition.pubDate[Op.gte] = startDate;
      if (endDate) whereCondition.pubDate[Op.lte] = endDate;
    }

    let groupByClause;
    switch (interval) {
      case 'day':
        groupByClause = literal("DATE_TRUNC('day', \"pubDate\")");
        break;
      case 'week':
        groupByClause = literal("DATE_TRUNC('week', \"pubDate\")");
        break;
      case 'month':
        groupByClause = literal("DATE_TRUNC('month', \"pubDate\")");
        break;
      case 'year':
        groupByClause = literal("DATE_TRUNC('year', \"pubDate\")");
        break;
      default:
        groupByClause = literal("DATE_TRUNC('week', \"pubDate\")");
    }

    const trends = await Activity.findAll({
      attributes: [
        [fn('DATE_TRUNC', interval, col('pubDate')), 'period'],
        [fn('COUNT', col('*')), 'count'],
        [fn('AVG', col('confidenceScore')), 'avgConfidence']
      ],
      where: whereCondition,
      group: ['period'],
      order: [[literal('period'), 'ASC']]
    });

    return trends.map(trend => ({
      period: (trend.get('period') as Date).toISOString(),
      count: parseInt(trend.get('count') as string),
      avgConfidence: parseFloat(trend.get('avgConfidence') as string)
    }));
  }

  /**
   * Get location distribution
   */
  static async getLocationDistribution(
    startDate?: Date,
    endDate?: Date,
    locationType: 'city' | 'county' | 'state' | 'country' = 'state'
  ): Promise<LocationDistribution[]> {
    const whereCondition: any = {};
    if (startDate || endDate) {
      whereCondition.pubDate = {};
      if (startDate) whereCondition.pubDate[Op.gte] = startDate;
      if (endDate) whereCondition.pubDate[Op.lte] = endDate;
    }

    const distribution = await Activity.findAll({
      attributes: [
        [col('locations.name'), 'locationName'],
        [col('locations.type'), 'locationType'],
        [col('locations.latitude'), 'latitude'],
        [col('locations.longitude'), 'longitude'],
        [fn('COUNT', col('*')), 'count']
      ],
      include: [{
        model: Location,
        as: 'locations',
        where: { type: locationType },
        attributes: []
      }],
      where: whereCondition,
      group: [
        'locations.name',
        'locations.type',
        'locations.latitude',
        'locations.longitude'
      ],
      order: [[fn('COUNT', col('*')), 'DESC']],
      limit: 50
    });

    return distribution.map(item => ({
      locationName: item.get('locationName') as string,
      locationType: item.get('locationType') as string,
      latitude: item.get('latitude') as number,
      longitude: item.get('longitude') as number,
      count: parseInt(item.get('count') as string)
    }));
  }

  /**
   * Get keyword frequency
   */
  static async getKeywordFrequency(
    startDate?: Date,
    endDate?: Date,
    limit: number = 20
  ): Promise<KeywordFrequency[]> {
    const whereCondition: any = {};
    if (startDate || endDate) {
      whereCondition.pubDate = {};
      if (startDate) whereCondition.pubDate[Op.gte] = startDate;
      if (endDate) whereCondition.pubDate[Op.lte] = endDate;
    }

    // This would typically join with Keywords table
    // For now, we'll implement a basic version that extracts keywords from activity content
    // In a real implementation, we would use the ActivityKeyword junction table
    
    const query = `
      SELECT 
        ak.term,
        COUNT(*) as count,
        ak.category
      FROM "activities" a
      JOIN "activity_keywords" aj ON a.id = aj.activity_id
      JOIN "keywords" ak ON aj.keyword_id = ak.id
      WHERE 1=1
      ${startDate ? `AND a."pubDate" >= '${startDate.toISOString()}'` : ''}
      ${endDate ? `AND a."pubDate" <= '${endDate.toISOString()}'` : ''}
      GROUP BY ak.term, ak.category
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    const results = await sequelize.query(query, { type: QueryTypes.SELECT });

    return results.map((row: any) => ({
      term: row.term,
      count: parseInt(row.count),
      category: row.category
    }));
  }

  /**
   * Get monthly activity summary
   */
  static async getMonthlySummary(year?: number): Promise<MonthlySummary[]> {
    const yearValue = year || new Date().getFullYear();

    const summary = await Activity.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('pubDate')), 'month'],
        [fn('COUNT', col('*')), 'totalActivities'],
        [fn('AVG', col('confidenceScore')), 'avgConfidence']
      ],
      where: {
        pubDate: {
          [Op.between]: [
            new Date(`${yearValue}-01-01`),
            new Date(`${yearValue}-12-31`)
          ]
        }
      },
      group: [literal('DATE_TRUNC(\'month\', "pubDate")')],
      order: [[literal('DATE_TRUNC(\'month\', "pubDate")'), 'ASC']]
    });

    return summary.map(item => ({
      month: (item.get('month') as Date).toISOString(),
      totalActivities: parseInt(item.get('totalActivities') as string),
      avgConfidence: parseFloat(item.get('avgConfidence') as string)
    }));
  }

  /**
   * Get heatmap data
   */
  static async getHeatmapData(
    startDate?: Date,
    endDate?: Date,
    locationType: 'city' | 'county' | 'state' | 'country' = 'state'
  ): Promise<HeatmapDataPoint[]> {
    const whereCondition: any = {};
    if (startDate || endDate) {
      whereCondition.pubDate = {};
      if (startDate) whereCondition.pubDate[Op.gte] = startDate;
      if (endDate) whereCondition.pubDate[Op.lte] = endDate;
    }

    const heatmapData = await Activity.findAll({
      attributes: [
        [col('locations.name'), 'locationName'],
        [col('locations.latitude'), 'latitude'],
        [col('locations.longitude'), 'longitude'],
        [fn('COUNT', col('*')), 'activityCount']
      ],
      include: [{
        model: Location,
        as: 'locations',
        where: { type: locationType },
        attributes: []
      }],
      where: whereCondition,
      group: [
        'locations.name',
        'locations.latitude',
        'locations.longitude'
      ],
      having: literal('COUNT(*) > 0')
    });

    return heatmapData.map(item => ({
      locationName: item.get('locationName') as string,
      latitude: parseFloat(item.get('latitude') as string),
      longitude: parseFloat(item.get('longitude') as string),
      activityCount: parseInt(item.get('activityCount') as string)
    }));
  }

  /**
   * Get predictive analytics (simple moving average)
   */
  static async getPredictiveAnalytics(
    locationIds: number[],
    daysAhead: number = 30
  ): Promise<{ locationId: number; predictedActivity: number; confidence: number }[]> {
    // This is a simplified prediction model
    // In a real implementation, we would use more sophisticated ML models
    
    const predictions = [];
    
    for (const locationId of locationIds) {
      // Get average activity for the past 90 days for this location
      const ninetyDaysAgo = moment().subtract(90, 'days').toDate();
      
      const pastActivities = await Activity.findAll({
        attributes: [
          [fn('DATE_TRUNC', 'week', col('pubDate')), 'week'],
          [fn('COUNT', col('*')), 'count']
        ],
        include: [{
          model: Location,
          as: 'locations',
          where: { id: locationId },
          attributes: []
        }],
        where: {
          pubDate: { [Op.gte]: ninetyDaysAgo }
        },
        group: ['week'],
        order: [[literal('week'), 'ASC']]
      });
      
      // Calculate average weekly activity
      const weeklyCounts = pastActivities.map(a => parseInt(a.get('count') as string));
      const avgWeeklyActivity = weeklyCounts.reduce((sum, val) => sum + val, 0) / weeklyCounts.length;
      
      // Predict next 30 days (approximately 4 weeks)
      const predictedActivity = avgWeeklyActivity * (daysAhead / 7);
      
      predictions.push({
        locationId,
        predictedActivity: Math.round(predictedActivity),
        confidence: 0.7 // Placeholder confidence
      });
    }
    
    return predictions;
  }
}