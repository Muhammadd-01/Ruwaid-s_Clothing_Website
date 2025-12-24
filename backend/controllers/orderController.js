import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, deliveryOption, paymentMethod, notes } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'items.product',
            select: 'name price images stock'
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate stock and prepare order items
        const orderItems = [];
        let subtotal = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product not found: ${item.product.name}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for: ${product.name}`
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: product.images[0]
            });

            subtotal += product.price * item.quantity;
        }

        // Calculate delivery fee
        const deliveryFee = deliveryOption === 'express' ? 250 : 0;
        const total = subtotal + deliveryFee;

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            deliveryOption,
            deliveryFee,
            paymentMethod: paymentMethod || 'cod',
            subtotal,
            total,
            notes
        });

        // Reduce stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find({ user: req.user._id })
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments({ user: req.user._id });

        res.status(200).json({
            success: true,
            data: {
                orders,
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order belongs to user or user is admin
        if (order.user._id.toString() !== req.user._id.toString() &&
            !['admin', 'superadmin'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order belongs to user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // If cancelling, restore stock
        if (status === 'cancelled' && order.status !== 'cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });
            }
            order.cancelledAt = new Date();
        }

        // If delivering, update payment status and delivered date
        if (status === 'delivered') {
            order.deliveredAt = new Date();
            if (order.paymentMethod === 'cod') {
                order.paymentStatus = 'paid';
            }
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: { order }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                orders,
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
