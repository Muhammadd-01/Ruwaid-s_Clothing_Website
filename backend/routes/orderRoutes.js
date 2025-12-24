import express from 'express';
import {
    createOrder,
    getOrders,
    getOrder,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.route('/')
    .get(getOrders)
    .post(createOrder);

router.get('/admin/all', authorize('admin', 'superadmin'), getAllOrders);

router.route('/:id')
    .get(getOrder);

router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', authorize('admin', 'superadmin'), updateOrderStatus);

export default router;
