import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus } from 'lucide-react';

const LoginPromptModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                     w-full max-w-md bg-dark-100 border border-dark-300 rounded-2xl 
                     shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative p-6 text-center border-b border-dark-300">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white 
                         hover:bg-dark-200 rounded-lg transition-colors duration-300"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogIn className="w-8 h-8 text-gold" />
                            </div>

                            <h2 className="text-xl font-display font-bold text-white">
                                Login Required
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="p-6 text-center">
                            <p className="text-gray-400 mb-6">
                                {message || 'Please login or register to add items to your cart and complete your purchase.'}
                            </p>

                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    onClick={onClose}
                                    className="btn-primary w-full"
                                >
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Login to Your Account
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={onClose}
                                    className="btn-secondary w-full"
                                >
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Create New Account
                                </Link>
                            </div>

                            <p className="text-gray-500 text-sm mt-6">
                                New here? Registration takes less than a minute.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LoginPromptModal;
