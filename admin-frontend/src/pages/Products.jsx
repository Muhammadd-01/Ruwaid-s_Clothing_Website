import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { productsAPI, brandsAPI, categoriesAPI, uploadAPI } from '../services/api';
import { formatPrice } from '../lib/utils';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        brand: '',
        category: '',
        sizes: '',
        stock: '',
        featured: false,
        images: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const [brandsRes, categoriesRes] = await Promise.all([
                brandsAPI.getAll(),
                categoriesAPI.getAll(),
            ]);
            setBrands(brandsRes.data.data.brands);
            setCategories(categoriesRes.data.data.categories);
        };
        fetchData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productsAPI.getAll({
                page,
                limit: 10,
                search,
            });
            setProducts(response.data.data.products);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            comparePrice: product.comparePrice || '',
            brand: product.brand?._id,
            category: product.category?._id,
            sizes: product.sizes?.join(', ') || '',
            stock: product.stock,
            featured: product.featured,
            images: product.images?.join('\n') || '',
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        toast.custom((t) => (
            <div className="bg-dark-100 border border-dark-300 p-6 rounded-xl shadow-2xl max-w-sm w-full">
                <h3 className="text-white font-semibold mb-2">Delete Product?</h3>
                <p className="text-gray-400 text-sm mb-6">
                    Are you sure you want to delete this product? This will remove it permanently.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmDelete(id);
                        }}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const confirmDelete = async (id) => {
        try {
            await productsAPI.delete(id);
            toast.success('Product deleted');
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            price: Number(formData.price),
            comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
            stock: Number(formData.stock),
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            images: formData.images.split('\n').map(s => s.trim()).filter(Boolean),
        };

        try {
            if (editProduct) {
                await productsAPI.update(editProduct._id, data);
                toast.success('Product updated');
            } else {
                await productsAPI.create(data);
                toast.success('Product created');
            }
            setShowModal(false);
            setEditProduct(null);
            setFormData({
                name: '', description: '', price: '', comparePrice: '',
                brand: '', category: '', sizes: '', stock: '', featured: false, images: '',
            });
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Products</h1>
                    <p className="text-gray-400">Manage your product catalog</p>
                </div>
                <button
                    onClick={() => {
                        setEditProduct(null);
                        setFormData({
                            name: '', description: '', price: '', comparePrice: '',
                            brand: '', category: '', sizes: '', stock: '', featured: false, images: '',
                        });
                        setShowModal(true);
                    }}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-12"
                />
            </div>

            {/* Products Table */}
            {loading ? (
                <PageLoader />
            ) : (
                <div className="bg-dark-100 border border-dark-300 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-300">
                                    <th className="text-left text-gray-400 font-medium p-4">Product</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Brand</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Price</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Stock</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Status</th>
                                    <th className="text-right text-gray-400 font-medium p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b border-dark-300 hover:bg-dark-200">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.images?.[0]?.startsWith('http')
                                                        ? product.images[0]
                                                        : `${import.meta.env.VITE_API_URL}${product.images?.[0]}` || 'https://via.placeholder.com/48'}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                                                />
                                                <div>
                                                    <p className="text-white font-medium">{product.name}</p>
                                                    <p className="text-gray-500 text-sm">{product.category?.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400">{product.brand?.name}</td>
                                        <td className="p-4">
                                            <span className="text-gold font-medium">{formatPrice(product.price)}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge ${product.stock < 10 ? 'badge-danger' : 'badge-success'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-gray-400 hover:text-gold hover:bg-dark-300 rounded-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-300 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 p-4 border-t border-dark-300">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg ${page === p ? 'bg-gold text-black' : 'bg-dark-200 text-gray-400 hover:text-white'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-100 border border-dark-300 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-dark-300">
                            <h2 className="text-xl font-semibold text-white">
                                {editProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                                    <select
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select Brand</option>
                                        {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Compare Price</label>
                                    <input
                                        type="number"
                                        value={formData.comparePrice}
                                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Sizes (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.sizes}
                                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                        placeholder="S, M, L, XL"
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Product Images</label>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        {formData.images.split('\n').filter(Boolean).map((url, index) => (
                                            <div key={index} className="relative group w-24 h-24">
                                                <img
                                                    src={url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg border border-dark-300"
                                                    onError={(e) => { e.target.src = url; }} // Fallback for external URLs if any
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = formData.images.split('\n').filter((_, i) => i !== index).join('\n');
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                                                             opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-300 border-dashed rounded-lg cursor-pointer hover:bg-dark-200 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const files = Array.from(e.target.files);
                                                    if (files.length === 0) return;

                                                    const uploadFormData = new FormData();
                                                    files.forEach(file => {
                                                        uploadFormData.append('images', file);
                                                    });

                                                    try {
                                                        const loadingToast = toast.loading('Uploading images...');
                                                        const response = await uploadAPI.uploadMultiple(uploadFormData);
                                                        toast.dismiss(loadingToast);
                                                        toast.success('Images uploaded');

                                                        const newPaths = response.data.data.paths.join('\n');
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            images: prev.images ? `${prev.images}\n${newPaths}` : newPaths
                                                        }));
                                                    } catch (error) {
                                                        toast.error('Upload failed');
                                                        console.error(error);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <label className="flex items-center text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="mr-2"
                                />
                                Featured Product
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary">
                                    {editProduct ? 'Update Product' : 'Create Product'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-dark">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Products;
