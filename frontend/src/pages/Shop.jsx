import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { productsAPI, brandsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { formatPrice } from '../lib/utils';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Get current filters from URL
    const currentBrand = searchParams.get('brand') || '';
    const currentCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sort') || '-createdAt';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const currentSearch = searchParams.get('search') || '';
    const currentSize = searchParams.get('size') || '';
    const currentColor = searchParams.get('color') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    // Internal state for price inputs to avoid re-fetching on every keystroke
    const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });

    useEffect(() => {
        // Update internal price state when URL params change
        setPriceRange({ min: minPrice, max: maxPrice });
    }, [minPrice, maxPrice]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [brandsRes, categoriesRes] = await Promise.all([
                    brandsAPI.getAll(),
                    categoriesAPI.getAll(),
                ]);
                setBrands(brandsRes.data.data.brands);
                setCategories(categoriesRes.data.data.categories);
            } catch (error) {
                console.error('Failed to fetch filter data:', error);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: 12,
                    sort: currentSort,
                };

                if (currentBrand) params.brand = currentBrand;
                if (currentCategory) params.category = currentCategory;
                if (currentSearch) params.search = currentSearch;
                if (minPrice) params.minPrice = minPrice;
                if (maxPrice) params.maxPrice = maxPrice;
                if (currentSize) params.size = currentSize;
                if (currentColor) params.color = currentColor;

                const response = await productsAPI.getAll(params);
                setProducts(response.data.data.products);
                setPagination(response.data.data.pagination);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentBrand, currentCategory, currentSort, currentPage, currentSearch, minPrice, maxPrice, currentSize, currentColor]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset to page 1 when filtering
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchParams({ page: '1' });
        setPriceRange({ min: '', max: '' });
    };

    const hasActiveFilters = currentBrand || currentCategory || currentSearch || minPrice || maxPrice || currentSize || currentColor;

    const sortOptions = [
        { value: '-createdAt', label: 'Newest First' },
        { value: 'createdAt', label: 'Oldest First' },
        { value: 'price', label: 'Price: Low to High' },
        { value: '-price', label: 'Price: High to Low' },
        { value: 'name', label: 'Name: A to Z' },
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Shop</h1>
                        <p className="text-gray-400">
                            {pagination.total || 0} products found
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden btn-dark"
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Filters
                        </button>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={currentSort}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                                className="input-field pr-10 appearance-none cursor-pointer"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <motion.aside
                        initial={false}
                        animate={{
                            x: showFilters ? 0 : -320,
                            opacity: showFilters ? 1 : 0
                        }}
                        className={`fixed lg:relative lg:block lg:opacity-100 lg:translate-x-0
                       top-0 left-0 h-full lg:h-auto w-72 bg-dark-100 lg:bg-transparent
                       border-r lg:border-0 border-dark-300 z-40 p-6 lg:p-0
                       ${showFilters ? 'block' : 'hidden lg:block'}`}
                    >
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setShowFilters(false)}
                            className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="space-y-8">
                            {/* Active Filters */}
                            {hasActiveFilters && (
                                <div className="pb-6 border-b border-dark-300">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-white font-semibold">Active Filters</h3>
                                        <button
                                            onClick={clearFilters}
                                            className="text-gold text-sm hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {currentBrand && (
                                            <span className="badge badge-gold">
                                                {brands.find(b => b._id === currentBrand)?.name}
                                                <button
                                                    onClick={() => updateFilter('brand', '')}
                                                    className="ml-2 hover:text-white"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        )}
                                        {currentCategory && (
                                            <span className="badge badge-gold">
                                                {categories.find(c => c._id === currentCategory)?.name}
                                                <button
                                                    onClick={() => updateFilter('category', '')}
                                                    className="ml-2 hover:text-white"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        )}
                                        {(minPrice || maxPrice) && (
                                            <span className="badge badge-gold">
                                                {minPrice ? formatPrice(minPrice) : '0'} - {maxPrice ? formatPrice(maxPrice) : '∞'}
                                                <button
                                                    onClick={() => {
                                                        const params = new URLSearchParams(searchParams);
                                                        params.delete('minPrice');
                                                        params.delete('maxPrice');
                                                        setSearchParams(params);
                                                    }}
                                                    className="ml-2 hover:text-white"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        )}
                                        {currentSize && (
                                            <span className="badge badge-gold">
                                                Size: {currentSize}
                                                <button
                                                    onClick={() => updateFilter('size', '')}
                                                    className="ml-2 hover:text-white"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        )}
                                        {currentColor && (
                                            <span className="badge badge-gold">
                                                Color: {currentColor}
                                                <button
                                                    onClick={() => updateFilter('color', '')}
                                                    className="ml-2 hover:text-white"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Categories */}
                            <div>
                                <h3 className="text-white font-semibold mb-3 text-lg">Categories</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                                    {categories.map((category) => (
                                        <label key={category._id} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                ${currentCategory === category._id
                                                    ? 'bg-gold border-gold'
                                                    : 'border-gray-600 group-hover:border-gold'}`}>
                                                {currentCategory === category._id && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={currentCategory === category._id}
                                                onChange={() => updateFilter('category',
                                                    currentCategory === category._id ? '' : category._id
                                                )}
                                            />
                                            <span className={`transition-colors ${currentCategory === category._id ? 'text-white' : 'text-gray-400 group-hover:text-gold'}`}>
                                                {category.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Brands */}
                            <div>
                                <h3 className="text-white font-semibold mb-3 text-lg">Brands</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                                    {brands.map((brand) => (
                                        <label key={brand._id} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                ${currentBrand === brand._id
                                                    ? 'bg-gold border-gold'
                                                    : 'border-gray-600 group-hover:border-gold'}`}>
                                                {currentBrand === brand._id && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={currentBrand === brand._id}
                                                onChange={() => updateFilter('brand',
                                                    currentBrand === brand._id ? '' : brand._id
                                                )}
                                            />
                                            <span className={`transition-colors ${currentBrand === brand._id ? 'text-white' : 'text-gray-400 group-hover:text-gold'}`}>
                                                {brand.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <h3 className="text-white font-semibold mb-3 text-lg">Sizes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => updateFilter('size', currentSize === size ? '' : size)}
                                            className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors
                                                ${currentSize === size
                                                    ? 'bg-gold border-gold text-black'
                                                    : 'border-dark-300 text-gray-400 hover:border-gold hover:text-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <h3 className="text-white font-semibold mb-3 text-lg">Colors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { name: 'Black', hex: '#000000' },
                                        { name: 'White', hex: '#FFFFFF' },
                                        { name: 'Red', hex: '#EF4444' },
                                        { name: 'Blue', hex: '#3B82F6' },
                                        { name: 'Green', hex: '#10B981' },
                                        { name: 'Yellow', hex: '#F59E0B' },
                                        { name: 'Purple', hex: '#8B5CF6' },
                                        { name: 'Pink', hex: '#EC4899' },
                                        { name: 'Gray', hex: '#6B7280' },
                                    ].map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => updateFilter('color', currentColor === color.name ? '' : color.name)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                                                ${currentColor === color.name
                                                    ? 'border-gold scale-110'
                                                    : 'border-dark-300'
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-white font-semibold mb-3 text-lg">Price Range</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                className="input-field py-1 px-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                className="input-field py-1 px-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            updateFilter('minPrice', priceRange.min);
                                            updateFilter('maxPrice', priceRange.max);
                                        }}
                                        className="btn-secondary w-full py-2 text-sm"
                                    >
                                        Apply Price
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Filter Overlay */}
                    {showFilters && (
                        <div
                            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                            onClick={() => setShowFilters(false)}
                        />
                    )}

                    {/* Products Grid */}
                    <div className="flex-grow">
                        {loading ? (
                            <ProductGridSkeleton count={12} />
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product, index) => (
                                        <ProductCard key={product._id} product={product} index={index} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex justify-center mt-12 gap-2">
                                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => updateFilter('page', page.toString())}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors
                                 ${currentPage === page
                                                        ? 'bg-gold text-black'
                                                        : 'bg-dark-100 text-gray-400 hover:bg-dark-200 hover:text-white'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16 bg-dark-100/50 rounded-xl border border-dark-300 border-dashed">
                                <p className="text-gray-400 text-lg mb-4">No products match your filters</p>
                                <button onClick={clearFilters} className="btn-secondary">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
