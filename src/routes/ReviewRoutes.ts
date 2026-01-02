import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';

const router = Router();

router.post('/reviews', ReviewController.create);
router.get('/reviews', ReviewController.getByMovie);
router.post('/reviews/_counts', ReviewController.counts);

export default router;
