import express from 'express';
import {
    getCategories,
    getCategory,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

// Admin routes
router.post('/', protect, authorize('admin', 'superadmin'), createCategory);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCategory);

export default router;
