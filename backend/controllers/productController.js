import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 12,
            brand,
            category,
            minPrice,
            maxPrice,
            search,
            sort = '-createdAt',
            featured
        } = req.query;

        // Build query
        const query = { isActive: true };

        if (brand) {
            query.brand = brand;
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (featured === 'true') {
            query.featured = true;
        }

        // Execute query
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .populate('brand', 'name slug')
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                products,
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand', 'name slug description')
            .populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const products = await Product.find({ featured: true, isActive: true })
            .populate('brand', 'name slug')
            .populate('category', 'name slug')
            .limit(limit);

        res.status(200).json({
            success: true,
            data: { products }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const relatedProducts = await Product.find({
            _id: { $ne: product._id },
            isActive: true,
            $or: [
                { category: product.category },
                { brand: product.brand }
            ]
        })
            .populate('brand', 'name slug')
            .populate('category', 'name slug')
            .limit(4);

        res.status(200).json({
            success: true,
            data: { products: relatedProducts }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        const populatedProduct = await Product.findById(product._id)
            .populate('brand', 'name slug')
            .populate('category', 'name slug');

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product: populatedProduct }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate('brand', 'name slug')
            .populate('category', 'name slug');

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res, next) => {
    try {
        const { stock } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Stock updated successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};
