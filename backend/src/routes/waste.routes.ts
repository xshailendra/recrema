import { Router } from 'express';
import { createWasteEntry, getMyWasteEntries, getMyWasteEntryById } from '../controllers/waste.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Apply auth and client role to all waste routes
router.use(requireAuth);
router.use(requireRole(['client']));

router.post('/', createWasteEntry);
router.get('/', getMyWasteEntries);
router.get('/:id', getMyWasteEntryById);

export default router;
