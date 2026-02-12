import { Router } from 'express';
import { 
  getAllLocations, 
  getLocationById, 
  getLocationsByType,
  createLocation,
  updateLocation,
  deleteLocation 
} from '../controllers/locationController';

const router = Router();

router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.get('/type/:type', getLocationsByType);
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

export const locationRoutes = router;