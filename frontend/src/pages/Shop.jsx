import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown, Grid, List } from 'lucide-react';
import { productsAPI, brandsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';

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

    useEffect(() => {
        const fetchFilters = async () => {
            const [brandsRes, categoriesRes] = await Promise.all([
                brandsAPI.getAll(),
                categoriesAPI.getAll(),
            ]);
            setBrands(brandsRes.data.data.brands);
            setCategories(categoriesRes.data.data.categories);
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
    }, [currentBrand, currentCategory, currentSort, currentPage, currentSearch]);

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
    };

    const hasActiveFilters = currentBrand || currentCategory || currentSearch;

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

                        <div className="space-y-6">
                            {/* Active Filters */}
                            {hasActiveFilters && (
                                <div>
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
                                                Brand: {brands.find(b => b._id === currentBrand)?.name}
                                                <button
                                                    onClick={() => updateFilter('brand', '')}
                                                    className="ml-2"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        )}
                                        {currentCategory && (
                                            <span className="badge badge-gold">
                                                Category: {categories.find(c => c._id === currentCategory)?.name}
                                                <button
                                                    onClick={() => updateFilter('category', '')}
                                                    className="ml-2"
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
                                <h3 className="text-white font-semibold mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category._id}
                                            onClick={() => updateFilter('category',
                                                currentCategory === category._id ? '' : category._id
                                            )}
                                            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors
                               ${currentCategory === category._id
                                                    ? 'bg-gold/10 text-gold'
                                                    : 'text-gray-400 hover:bg-dark-200 hover:text-white'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brands */}
                            <div>
                                <h3 className="text-white font-semibold mb-3">Brands</h3>
                                <div className="space-y-2">
                                    {brands.map((brand) => (
                                        <button
                                            key={brand._id}
                                            onClick={() => updateFilter('brand',
                                                currentBrand === brand._id ? '' : brand._id
                                            )}
                                            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors
                               ${currentBrand === brand._id
                                                    ? 'bg-gold/10 text-gold'
                                                    : 'text-gray-400 hover:bg-dark-200 hover:text-white'
                                                }`}
                                        >
                                            {brand.name}
                                        </button>
                                    ))}
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
                            <div className="text-center py-16">
                                <p className="text-gray-400 text-lg mb-4">No products found</p>
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
