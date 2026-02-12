import { Router } from 'express';
import { 
  getAllSources, 
  getSourceById, 
  createSource,
  updateSource,
  deleteSource,
  refreshSource 
} from '../controllers/sourceController';

const router = Router();

router.get('/', getAllSources);
router.get('/:id', getSourceById);
router.post('/', createSource);
router.put('/:id', updateSource);
router.delete('/:id', deleteSource);
router.post('/:id/refresh', refreshSource);

export const sourceRoutes = router;