import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { categoriesAPI } from '../services/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setEditCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            isActive: category.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        toast.custom((t) => (
            <div className="bg-dark-100 border border-dark-300 p-6 rounded-xl shadow-2xl max-w-sm w-full">
                <h3 className="text-white font-semibold mb-2">Delete Category?</h3>
                <p className="text-gray-400 text-sm mb-6">
                    Are you sure you want to delete this category? All associated products will be affected.
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
            await categoriesAPI.delete(id);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editCategory) {
                await categoriesAPI.update(editCategory._id, formData);
                toast.success('Category updated');
            } else {
                await categoriesAPI.create(formData);
                toast.success('Category created');
            }
            setShowModal(false);
            setEditCategory(null);
            setFormData({ name: '', description: '', image: '', isActive: true });
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Categories</h1>
                    <p className="text-gray-400">Manage product categories</p>
                </div>
                <button
                    onClick={() => {
                        setEditCategory(null);
                        setFormData({ name: '', description: '', image: '', isActive: true });
                        setShowModal(true);
                    }}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Category
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <motion.div
                        key={category._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-dark-100 border border-dark-300 rounded-xl overflow-hidden hover:border-gold/30 transition-colors"
                    >
                        <div className="aspect-video bg-dark-200 relative">
                            {category.image ? (
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-4xl font-display font-bold text-gray-600">{category.name[0]}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-white font-semibold">{category.name}</h3>
                                    <span className={`badge ${category.isActive ? 'badge-success' : 'badge-danger'}`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="p-2 text-gray-400 hover:text-gold hover:bg-dark-200 rounded-lg"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-200 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">
                                {category.description || 'No description'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-100 border border-dark-300 rounded-xl w-full max-w-md"
                    >
                        <div className="p-6 border-b border-dark-300">
                            <h2 className="text-xl font-semibold text-white">
                                {editCategory ? 'Edit Category' : 'Add New Category'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="input-field"
                                />
                            </div>

                            <label className="flex items-center text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="mr-2"
                                />
                                Active
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary">
                                    {editCategory ? 'Update Category' : 'Create Category'}
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

export default Categories;
