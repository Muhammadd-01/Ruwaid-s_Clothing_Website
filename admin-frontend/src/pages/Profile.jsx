import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Mail, Shield } from 'lucide-react';
import { adminAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profileImage: '',
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                profileImage: user.profileImage || '',
            });
            setImagePreview(user.profileImage || null);
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        try {
            setUploading(true);
            const response = await uploadAPI.upload(uploadFormData);
            const imagePath = response.data.data.path;

            setFormData(prev => ({ ...prev, profileImage: imagePath }));
            setImagePreview(`${import.meta.env.VITE_API_URL}${imagePath}`);
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await adminAPI.updateProfile(formData);
            setUser(response.data.data.user);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Profile</h1>
                <p className="text-gray-400">Manage your admin profile information</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-100 border border-dark-300 rounded-xl p-8 max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-dark-200 border-2 border-dark-300 overflow-hidden">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview.startsWith('http') ? imagePreview : `${import.meta.env.VITE_API_URL}${imagePreview}`}
                                        alt={formData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-16 h-16 text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="profile-image"
                                className="absolute bottom-0 right-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center cursor-pointer hover:bg-gold/90 transition-colors"
                            >
                                {uploading ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Camera className="w-5 h-5 text-black" />
                                )}
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500">Click the camera icon to upload a new photo</p>
                    </div>

                    {/* Role Badge */}
                    <div className="flex items-center justify-center gap-2 p-3 bg-gold/10 border border-gold/20 rounded-lg">
                        <Shield className="w-5 h-5 text-gold" />
                        <span className="text-gold font-medium capitalize">{user?.role}</span>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field pl-12"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field pl-12"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="btn-primary w-full"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                Updating...
                            </span>
                        ) : (
                            'Update Profile'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;
