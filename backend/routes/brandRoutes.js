import express from 'express';
import {
    getBrands,
    getBrand,
    getBrandBySlug,
    createBrand,
    updateBrand,
    deleteBrand
} from '../controllers/brandController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBrands);
router.get('/slug/:slug', getBrandBySlug);
router.get('/:id', getBrand);

// Admin routes
router.post('/', protect, authorize('admin', 'superadmin'), createBrand);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateBrand);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteBrand);

export default router;
