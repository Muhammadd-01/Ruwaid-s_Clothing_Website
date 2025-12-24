import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { name, email, phone, profileImage } = req.body;

        // Check if email is being changed and if it exists
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, phone, profileImage },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
    try {
        const { label, street, city, postalCode, isDefault } = req.body;

        const user = await User.findById(req.user._id);

        // If this is the first address or marked as default, update other addresses
        if (isDefault || user.addresses.length === 0) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        user.addresses.push({
            label,
            street,
            city,
            postalCode,
            isDefault: isDefault || user.addresses.length === 0
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: { addresses: user.addresses }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
    try {
        const { label, street, city, postalCode, isDefault } = req.body;
        const addressId = req.params.id;

        const user = await User.findById(req.user._id);

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // If marking as default, unset other defaults
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        address.label = label || address.label;
        address.street = street || address.street;
        address.city = city || address.city;
        address.postalCode = postalCode || address.postalCode;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: { addresses: user.addresses }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
    try {
        const addressId = req.params.id;

        const user = await User.findById(req.user._id);

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        const wasDefault = address.isDefault;
        address.deleteOne();

        // If deleted address was default, make first remaining address default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data: { addresses: user.addresses }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res, next) => {
    try {
        const addressId = req.params.id;

        const user = await User.findById(req.user._id);

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Unset all defaults
        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });

        // Set this as default
        address.isDefault = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Default address updated',
            data: { addresses: user.addresses }
        });
    } catch (error) {
        next(error);
    }
};
