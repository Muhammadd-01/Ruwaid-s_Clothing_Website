import express from 'express';
import {
    getDashboard,
    getUsers,
    getUser,
    updateUserRole,
    deleteUser,
    getUserCart,
    createAdmin,
    getLogs,
    exportData,
    deleteOrder,
    updateAdminProfile
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/dashboard', getDashboard);
router.get('/export/:type', exportData);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.get('/users/:id/cart', getUserCart);
router.delete('/users/:id', deleteUser);

// Admin profile
router.put('/profile', updateAdminProfile);

// Orders
router.delete('/orders/:id', deleteOrder);

// Super admin only
router.get('/logs', authorize('superadmin'), getLogs);
router.put('/users/:id/role', authorize('superadmin'), updateUserRole);
router.post('/users/create-admin', authorize('superadmin'), createAdmin);

export default router;
