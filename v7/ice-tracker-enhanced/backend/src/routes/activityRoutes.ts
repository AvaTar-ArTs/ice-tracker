import { Router } from 'express';
import { 
  getAllActivities, 
  getActivityById, 
  getActivitiesByLocation, 
  getActivitiesByDateRange,
  getActivitiesBySource,
  createActivity,
  updateActivity,
  deleteActivity 
} from '../controllers/activityController';

const router = Router();

router.get('/', getAllActivities);
router.get('/:id', getActivityById);
router.get('/location/:locationId', getActivitiesByLocation);
router.get('/date-range', getActivitiesByDateRange);
router.get('/source/:sourceId', getActivitiesBySource);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export const activityRoutes = router;