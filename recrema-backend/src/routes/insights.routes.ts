import { Router } from 'express';
import { getSummary, getTrends, getContributors } from '../controllers/insights.controller';

const router = Router();

// Insights endpoints are public read-only.
router.get('/', getSummary);
router.get('/trends', getTrends);
router.get('/contributors', getContributors);

export default router;
