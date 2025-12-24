import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Plus, Trash2,
    Edit2, Check, X, Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser, refreshUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profileImage: user?.profileImage || '',
    });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({
        label: 'Home',
        street: '',
        city: '',
        postalCode: '',
        isDefault: false,
    });
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await userAPI.updateProfile(formData);
            if (response.data.success) {
                updateUser(response.data.data.user);
                toast.success('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await userAPI.addAddress(addressForm);
            if (response.data.success) {
                await refreshUser();
                toast.success('Address added successfully');
                setShowAddressForm(false);
                setAddressForm({ label: 'Home', street: '', city: '', postalCode: '', isDefault: false });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await userAPI.deleteAddress(addressId);
            if (response.data.success) {
                await refreshUser();
                toast.success('Address deleted');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete address');
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const response = await userAPI.setDefaultAddress(addressId);
            if (response.data.success) {
                await refreshUser();
                toast.success('Default address updated');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to set default');
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-display font-bold text-white mb-8">My Profile</h1>

                {/* Profile Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-100 border border-dark-300 rounded-xl p-6 mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-2 text-gold hover:underline"
                        >
                            {isEditing ? (
                                <>
                                    <X className="w-4 h-4" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </>
                            )}
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            {/* Profile Image */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-dark-200 border-2 border-dark-300 overflow-hidden">
                                        {formData.profileImage ? (
                                            <img
                                                src={formData.profileImage.startsWith('http')
                                                    ? formData.profileImage
                                                    : `${import.meta.env.VITE_API_URL}${formData.profileImage}`}
                                                alt={formData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-12 h-12 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-gold text-black p-1.5 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-lg">
                                        <Camera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                const uploadFormData = new FormData();
                                                uploadFormData.append('image', file);

                                                try {
                                                    const loadingToast = toast.loading('Uploading image...');
                                                    const response = await uploadAPI.upload(uploadFormData);

                                                    // Construct full URL if response is relative
                                                    const imagePath = response.data.data.path;
                                                    const fullUrl = imagePath.startsWith('http')
                                                        ? imagePath
                                                        : `${import.meta.env.VITE_API_URL}${imagePath}`;

                                                    setFormData({ ...formData, profileImage: fullUrl });
                                                    toast.dismiss(loadingToast);
                                                    toast.success('Image uploaded');
                                                } catch (error) {
                                                    toast.error('Failed to upload image');
                                                    console.error(error);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-white font-medium mb-1">Profile Photo</h3>
                                    <p className="text-gray-400 text-sm">
                                        Click the camera icon to upload a new profile photo.
                                        Supports JPG, PNG or WEBP (max 5MB).
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={loading} className="btn-primary">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-full bg-dark-200 border-2 border-dark-300 overflow-hidden flex-shrink-0">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-12 h-12 text-gray-500" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-white">
                                    <User className="w-5 h-5 text-gold" />
                                    <span>{user?.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Mail className="w-5 h-5 text-gold" />
                                    <span>{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Phone className="w-5 h-5 text-gold" />
                                    <span>{user?.phone || 'Not provided'}</span>
                                </div>
                                <span className="badge badge-gold">{user?.role}</span>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Addresses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-100 border border-dark-300 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">My Addresses</h2>
                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="flex items-center gap-2 text-gold hover:underline"
                        >
                            <Plus className="w-4 h-4" />
                            Add Address
                        </button>
                    </div>

                    {/* Add Address Form */}
                    {showAddressForm && (
                        <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-dark-200 rounded-xl">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Label (e.g., Home, Office)"
                                    value={addressForm.label}
                                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                    className="input-field"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Street Address"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                className="input-field mb-4"
                                required
                            />
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Postal Code"
                                    value={addressForm.postalCode}
                                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                    className="input-field"
                                    required
                                />
                                <label className="flex items-center text-gray-400">
                                    <input
                                        type="checkbox"
                                        checked={addressForm.isDefault}
                                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Set as default
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={loading} className="btn-primary">
                                    {loading ? 'Adding...' : 'Add Address'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddressForm(false)}
                                    className="btn-dark"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Address List */}
                    {user?.addresses?.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            {user.addresses.map((address) => (
                                <div
                                    key={address._id}
                                    className="p-4 border border-dark-300 rounded-xl hover:border-gold/30 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-gold" />
                                            <span className="text-white font-medium">{address.label}</span>
                                            {address.isDefault && (
                                                <span className="badge badge-gold text-xs">Default</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!address.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefault(address._id)}
                                                    className="text-gray-400 hover:text-gold text-sm"
                                                >
                                                    Set Default
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteAddress(address._id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm">{address.street}</p>
                                    <p className="text-gray-400 text-sm">{address.city}, {address.postalCode}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            No addresses saved yet. Add your first address to speed up checkout.
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
