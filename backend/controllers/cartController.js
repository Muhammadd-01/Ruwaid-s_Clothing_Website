import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate({
                path: 'items.product',
                select: 'name price comparePrice images stock brand',
                populate: { path: 'brand', select: 'name' }
            });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Calculate totals
        let subtotal = 0;
        const validItems = [];

        for (const item of cart.items) {
            if (item.product) {
                subtotal += item.product.price * item.quantity;
                validItems.push(item);
            }
        }

        // Update cart if some items were removed (product deleted)
        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        res.status(200).json({
            success: true,
            data: {
                cart,
                subtotal,
                itemCount: cart.totalItems
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1, size, color } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item =>
                item.product.toString() === productId &&
                item.size === size &&
                JSON.stringify(item.color) === JSON.stringify(color)
        );

        if (existingItemIndex > -1) {
            // Update quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }

            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                size,
                color
            });
        }

        await cart.save();

        // Populate and return
        cart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price comparePrice images stock brand',
            populate: { path: 'brand', select: 'name' }
        });

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: { cart }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const itemId = req.params.itemId;

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Check stock
        const product = await Product.findById(item.product);
        if (!product) {
            // Remove item if product no longer exists
            item.deleteOne();
            await cart.save();
            return res.status(404).json({
                success: false,
                message: 'Product no longer available'
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        if (quantity <= 0) {
            item.deleteOne();
        } else {
            item.quantity = quantity;
        }

        await cart.save();

        // Populate and return
        cart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price comparePrice images stock brand',
            populate: { path: 'brand', select: 'name' }
        });

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            data: { cart }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
    try {
        const itemId = req.params.itemId;

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        item.deleteOne();
        await cart.save();

        // Populate and return
        cart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price comparePrice images stock brand',
            populate: { path: 'brand', select: 'name' }
        });

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: { cart }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: { cart: { items: [] } }
        });
    } catch (error) {
        next(error);
    }
};
