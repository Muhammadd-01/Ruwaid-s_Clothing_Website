import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboard = async (req, res, next) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

        // Revenue calculations
        const completedOrders = await Order.find({ status: 'delivered' });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

        // Pending orders
        const pendingOrders = await Order.countDocuments({
            status: { $in: ['pending', 'confirmed', 'processing'] }
        });

        // Recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort('-createdAt')
            .limit(5);

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'delivered',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // Populate top products
        const populatedTopProducts = await Product.populate(topProducts, {
            path: '_id',
            select: 'name images price'
        });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue,
                    pendingOrders,
                    lowStockProducts
                },
                recentOrders,
                ordersByStatus,
                monthlyRevenue,
                topProducts: populatedTopProducts
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's order history
        const orders = await Order.find({ user: user._id })
            .sort('-createdAt')
            .limit(10);

        res.status(200).json({
            success: true,
            data: { user, orders }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/SuperAdmin
export const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;

        // Validate role
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Only user and admin roles can be assigned.'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent modifying super admin
        if (user.role === 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot modify Super Admin role'
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting super admin
        if (user.role === 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete Super Admin'
            });
        }

        // Check permissions
        if (req.user.role === 'admin' && user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admins cannot delete other admins'
            });
        }

        // Delete user's cart
        await Cart.deleteOne({ user: userId });

        // Delete user
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's cart
// @route   GET /api/admin/users/:id/cart
// @access  Private/Admin
export const getUserCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.params.id })
            .populate({
                path: 'items.product',
                select: 'name price images',
                populate: { path: 'brand', select: 'name' }
            });

        res.status(200).json({
            success: true,
            data: { cart: cart || { items: [] } }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create admin user
// @route   POST /api/admin/users/create-admin
// @access  Private/SuperAdmin
export const createAdmin = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const admin = await User.create({
            name,
            email,
            password,
            phone,
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                user: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
