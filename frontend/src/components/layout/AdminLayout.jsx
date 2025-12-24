import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Package, Tag, Layers, ShoppingCart,
    Users, Menu, X, LogOut, ChevronLeft, Store
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Brands', path: '/admin/brands', icon: Tag },
        { name: 'Categories', path: '/admin/categories', icon: Layers },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Users', path: '/admin/users', icon: Users },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-dark flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 256 : 80 }}
                className="fixed left-0 top-0 h-screen bg-dark-100 border-r border-dark-300 z-40 
                   flex flex-col overflow-hidden"
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-dark-300">
                    {sidebarOpen && (
                        <Link to="/admin" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                                <span className="text-black font-display font-bold text-xl">R</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">Admin Panel</span>
                                <span className="text-xs text-gray-400">Ruwaid's Clothing</span>
                            </div>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-dark-200 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-grow py-6 px-3 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300
                ${isActive
                                    ? 'bg-gold/10 text-gold border border-gold/20'
                                    : 'text-gray-400 hover:bg-dark-200 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="font-medium">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Back to Store & Logout */}
                <div className="p-3 border-t border-dark-300 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-400 
                     hover:bg-dark-200 hover:text-white transition-all duration-300"
                    >
                        <Store className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium">Back to Store</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-red-400 
                     hover:bg-red-500/10 transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div
                className="flex-grow transition-all duration-300"
                style={{ marginLeft: sidebarOpen ? 256 : 80 }}
            >
                {/* Top Bar */}
                <header className="h-20 bg-dark-100 border-b border-dark-300 flex items-center justify-between px-6">
                    <div>
                        <h1 className="text-xl font-semibold text-white">Welcome back, {user?.name?.split(' ')[0]}</h1>
                        <p className="text-sm text-gray-400">Manage your store from here</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="badge badge-gold">{user?.role}</span>
                        <div className="w-10 h-10 bg-dark-200 rounded-full flex items-center justify-center border border-dark-300">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <Users className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                >
                    <Outlet />
                </motion.main>
            </div>
        </div>
    );
};

export default AdminLayout;
