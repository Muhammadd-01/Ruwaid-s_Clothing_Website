import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize('admin', 'superadmin'), getContacts);

export default router;
