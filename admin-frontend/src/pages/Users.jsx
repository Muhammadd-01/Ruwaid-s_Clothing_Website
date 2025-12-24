import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Trash2, Shield } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/utils';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Users = () => {
    const { isSuperAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUsers({ page, limit: 10, search });
            setUsers(response.data.data.users);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            toast.success('User role updated');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminAPI.deleteUser(userId);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();

        try {
            await adminAPI.createAdmin(formData);
            toast.success('Admin created successfully');
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'admin' });
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create admin');
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'superadmin':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'admin':
                return 'badge-gold';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Users</h1>
                    <p className="text-gray-400">Manage user accounts</p>
                </div>
                {isSuperAdmin && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Add Admin
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-12"
                />
            </div>

            {/* Users Table */}
            {loading ? (
                <PageLoader />
            ) : (
                <div className="bg-dark-100 border border-dark-300 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-300">
                                    <th className="text-left text-gray-400 font-medium p-4">User</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Email</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Phone</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Role</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Joined</th>
                                    <th className="text-right text-gray-400 font-medium p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-dark-300 hover:bg-dark-200">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-dark-200 rounded-full flex items-center justify-center border border-dark-300">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-gold font-medium">{user.name[0]}</span>
                                                    )}
                                                </div>
                                                <span className="text-white font-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400">{user.email}</td>
                                        <td className="p-4 text-gray-400">{user.phone || '-'}</td>
                                        <td className="p-4">
                                            {isSuperAdmin && user.role !== 'superadmin' ? (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className={`input-field py-1.5 pr-8 text-sm cursor-pointer ${getRoleBadge(user.role)}`}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className={`badge ${getRoleBadge(user.role)}`}>
                                                    {user.role === 'superadmin' && <Shield className="w-3 h-3 mr-1" />}
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{formatDate(user.createdAt)}</td>
                                        <td className="p-4">
                                            {user.role !== 'superadmin' && (
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-300 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
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

            {/* Create Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-100 border border-dark-300 rounded-xl w-full max-w-md"
                    >
                        <div className="p-6 border-b border-dark-300">
                            <h2 className="text-xl font-semibold text-white">Create Admin Account</h2>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary">
                                    Create Admin
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

export default Users;
