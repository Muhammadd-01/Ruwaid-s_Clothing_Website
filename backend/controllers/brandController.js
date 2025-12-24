import Brand from '../models/Brand.js';
import Product from '../models/Product.js';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res, next) => {
    try {
        const brands = await Brand.find({ isActive: true }).sort('name');

        res.status(200).json({
            success: true,
            data: { brands }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
export const getBrand = async (req, res, next) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { brand }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get brand by slug
// @route   GET /api/brands/slug/:slug
// @access  Public
export const getBrandBySlug = async (req, res, next) => {
    try {
        const brand = await Brand.findOne({ slug: req.params.slug });

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { brand }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create brand
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = async (req, res, next) => {
    try {
        const brand = await Brand.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Brand created successfully',
            data: { brand }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrand = async (req, res, next) => {
    try {
        let brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Brand updated successfully',
            data: { brand }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrand = async (req, res, next) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        // Check if brand has products
        const productCount = await Product.countDocuments({ brand: brand._id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete brand. ${productCount} products are associated with this brand.`
            });
        }

        await brand.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Brand deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
