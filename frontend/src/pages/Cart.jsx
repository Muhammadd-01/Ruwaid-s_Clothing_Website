import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import LoginPromptModal from '../components/ui/LoginPromptModal';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cart, subtotal, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateQuantity(itemId, newQuantity);
    };

    const handleRemove = async (itemId) => {
        await removeFromCart(itemId);
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
        navigate('/checkout');
    };

    // Not authenticated state
    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-4">
                        Your Cart is Waiting
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Please login to view your cart and continue shopping
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login" className="btn-primary">
                            Login
                        </Link>
                        <Link to="/shop" className="btn-secondary">
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Empty cart state
    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-4">
                        Your Cart is Empty
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Looks like you haven't added any items to your cart yet
                    </p>
                    <Link to="/shop" className="btn-primary">
                        Start Shopping
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-display font-bold text-white mb-8">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-dark-100 border border-dark-300 rounded-xl p-4 flex gap-4"
                            >
                                {/* Image */}
                                <Link
                                    to={`/product/${item.product?._id}`}
                                    className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-dark-200"
                                >
                                    <img
                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>

                                {/* Details */}
                                <div className="flex-grow">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gold text-xs font-medium uppercase tracking-wider mb-1">
                                                {item.product?.brand?.name}
                                            </p>
                                            <Link
                                                to={`/product/${item.product?._id}`}
                                                className="text-white font-medium hover:text-gold transition-colors"
                                            >
                                                {item.product?.name}
                                            </Link>
                                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                                                <span>Size: {item.size}</span>
                                                {item.color && (
                                                    <span className="flex items-center gap-1">
                                                        Color:
                                                        <span
                                                            className="w-4 h-4 rounded-full border border-dark-300"
                                                            style={{ backgroundColor: item.color.hex }}
                                                        />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item._id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                className="w-8 h-8 bg-dark-200 rounded-lg flex items-center justify-center
                                 text-gray-400 hover:border-gold hover:text-white border border-dark-300"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                className="w-8 h-8 bg-dark-200 rounded-lg flex items-center justify-center
                                 text-gray-400 hover:border-gold hover:text-white border border-dark-300"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <p className="text-gold font-bold">
                                            {formatPrice(item.product?.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Clear Cart */}
                        <button
                            onClick={clearCart}
                            className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-dark-100 border border-dark-300 rounded-xl p-6 sticky top-24"
                        >
                            <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>{subtotal >= 5000 ? 'Free' : formatPrice(250)}</span>
                                </div>
                            </div>

                            <div className="border-t border-dark-300 pt-4 mb-6">
                                <div className="flex justify-between text-white font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-gold">
                                        {formatPrice(subtotal + (subtotal >= 5000 ? 0 : 250))}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">
                                    {subtotal >= 5000
                                        ? '✓ You qualify for free shipping!'
                                        : `Add ${formatPrice(5000 - subtotal)} more for free shipping`}
                                </p>
                            </div>

                            <button onClick={handleCheckout} className="btn-primary w-full">
                                Proceed to Checkout
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>

                            <Link
                                to="/shop"
                                className="block text-center text-gray-400 hover:text-white mt-4 text-sm"
                            >
                                ← Continue Shopping
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
};

export default Cart;
