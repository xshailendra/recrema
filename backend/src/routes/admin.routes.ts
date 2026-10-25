import { Router } from 'express';
import {
  createPartner,
  getPartner,
  getPartners,
  updatePartnerStatus,
  resetPartnerPassword,
  getPendingEntries,
  getAllEntries,
  approveEntry,
  rejectEntry,
  updatePartner,
  removePartner,
} from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Apply auth and admin role to all admin routes
router.use(requireAuth);
router.use(requireRole(['admin']));

router.get('/waste/pending', getPendingEntries);
router.get('/waste', getAllEntries);
router.patch('/waste/:id/approve', approveEntry);
router.patch('/waste/:id/reject', rejectEntry);
router.post('/partners', createPartner);
router.get('/partners', getPartners);
router.get('/partners/:id', getPartner);
router.patch('/partners/:id', updatePartner);
router.patch('/partners/:id/status', updatePartnerStatus);
router.patch('/partners/:id/reset-password', resetPartnerPassword);
router.delete('/partners/:id', removePartner);

export default router;
