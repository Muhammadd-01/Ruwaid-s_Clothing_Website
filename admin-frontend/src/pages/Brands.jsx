import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { brandsAPI } from '../services/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editBrand, setEditBrand] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: '',
        isActive: true,
    });

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await brandsAPI.getAll();
            setBrands(response.data.data.brands);
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (brand) => {
        setEditBrand(brand);
        setFormData({
            name: brand.name,
            description: brand.description || '',
            logo: brand.logo || '',
            isActive: brand.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this brand?')) return;

        try {
            await brandsAPI.delete(id);
            toast.success('Brand deleted');
            fetchBrands();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete brand');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editBrand) {
                await brandsAPI.update(editBrand._id, formData);
                toast.success('Brand updated');
            } else {
                await brandsAPI.create(formData);
                toast.success('Brand created');
            }
            setShowModal(false);
            setEditBrand(null);
            setFormData({ name: '', description: '', logo: '', isActive: true });
            fetchBrands();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Brands</h1>
                    <p className="text-gray-400">Manage product brands</p>
                </div>
                <button
                    onClick={() => {
                        setEditBrand(null);
                        setFormData({ name: '', description: '', logo: '', isActive: true });
                        setShowModal(true);
                    }}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Brand
                </button>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand, index) => (
                    <motion.div
                        key={brand._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-dark-100 border border-dark-300 rounded-xl p-6 hover:border-gold/30 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                {brand.logo ? (
                                    <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                                        <span className="text-gold font-bold text-lg">{brand.name[0]}</span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-white font-semibold">{brand.name}</h3>
                                    <span className={`badge ${brand.isActive ? 'badge-success' : 'badge-danger'}`}>
                                        {brand.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(brand)}
                                    className="p-2 text-gray-400 hover:text-gold hover:bg-dark-200 rounded-lg"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(brand._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-200 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">
                            {brand.description || 'No description'}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Brand Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-100 border border-dark-300 rounded-xl w-full max-w-md"
                    >
                        <div className="p-6 border-b border-dark-300">
                            <h2 className="text-xl font-semibold text-white">
                                {editBrand ? 'Edit Brand' : 'Add New Brand'}
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                                <input
                                    type="url"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    placeholder="https://example.com/logo.png"
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
                                    {editBrand ? 'Update Brand' : 'Create Brand'}
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

export default Brands;
