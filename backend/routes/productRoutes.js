import express from 'express';
import {
    getProducts,
    getProduct,
    getFeaturedProducts,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// Admin routes
router.post('/', protect, authorize('admin', 'superadmin'), createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);
router.put('/:id/stock', protect, authorize('admin', 'superadmin'), updateStock);

export default router;
