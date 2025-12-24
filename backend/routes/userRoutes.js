import express from 'express';
import {
    getProfile,
    updateProfile,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/profile')
    .get(getProfile)
    .put(updateProfile);

router.put('/password', updatePassword);

router.route('/addresses')
    .post(addAddress);

router.route('/addresses/:id')
    .put(updateAddress)
    .delete(deleteAddress);

router.put('/addresses/:id/default', setDefaultAddress);

export default router;
