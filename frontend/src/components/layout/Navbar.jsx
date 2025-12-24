import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ShoppingBag, User, ChevronDown,
    LogOut, Package, Settings, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { getCartItemCount } = useCart();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    const cartCount = getCartItemCount();

    return (
        <nav className="sticky top-0 z-50 glass border-b border-dark-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center
                          group-hover:shadow-lg group-hover:shadow-gold/20 transition-all duration-300">
                            <span className="text-black font-display font-bold text-xl">R</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-display font-bold text-white">Ruwaid's</span>
                            <span className="text-xl font-display font-bold text-gold ml-1">Clothing</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-300 relative group
                  ${isActive ? 'text-gold' : 'text-gray-300 hover:text-white'}`
                                }
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                        >
                            <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold 
                           rounded-full flex items-center justify-center"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* Profile */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white 
                           transition-colors duration-300"
                                >
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-dark-300"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-dark-200 rounded-full flex items-center justify-center border border-dark-300">
                                            <User className="w-4 h-4" />
                                        </div>
                                    )}
                                    <span className="hidden sm:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 bg-dark-100 border border-dark-300 rounded-xl 
                               shadow-xl overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-dark-300">
                                                <p className="text-white font-medium">{user?.name}</p>
                                                <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white 
                                   hover:bg-dark-200 rounded-lg transition-colors duration-200"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white 
                                   hover:bg-dark-200 rounded-lg transition-colors duration-200"
                                                >
                                                    <Package className="w-4 h-4" />
                                                    <span>My Orders</span>
                                                </Link>
                                                {isAdmin && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center space-x-3 px-3 py-2 text-gold hover:bg-dark-200 
                                     rounded-lg transition-colors duration-200"
                                                    >
                                                        <LayoutDashboard className="w-4 h-4" />
                                                        <span>Admin Panel</span>
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="p-2 border-t border-dark-300">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-3 w-full px-3 py-2 text-red-400 
                                   hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="p-2 text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                <User className="w-6 h-6" />
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-dark-100 border-t border-dark-300"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-lg font-medium transition-colors duration-300
                    ${isActive ? 'bg-gold/10 text-gold' : 'text-gray-300 hover:bg-dark-200 hover:text-white'}`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close profile dropdown */}
            {isProfileOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;
