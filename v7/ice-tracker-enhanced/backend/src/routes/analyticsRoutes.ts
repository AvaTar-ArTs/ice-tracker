import { Router } from 'express';
import { 
  getActivityTrends,
  getLocationDistribution,
  getKeywordFrequency,
  getMonthlyActivitySummary,
  getGeographicHeatmapData
} from '../controllers/analyticsController';

const router = Router();

router.get('/trends', getActivityTrends);
router.get('/location-distribution', getLocationDistribution);
router.get('/keyword-frequency', getKeywordFrequency);
router.get('/monthly-summary', getMonthlyActivitySummary);
router.get('/heatmap-data', getGeographicHeatmapData);

export const analyticsRoutes = router;