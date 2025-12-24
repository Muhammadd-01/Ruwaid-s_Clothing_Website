import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { formatPrice, getDiscountPercentage } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import LoginPromptModal from './LoginPromptModal';

const ProductCard = ({ product, index = 0 }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const discount = getDiscountPercentage(product.price, product.comparePrice);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        const defaultSize = product.sizes?.[0] || 'M';
        const defaultColor = product.colors?.[0] || { name: 'Default', hex: '#000' };

        await addToCart(product._id, 1, defaultSize, defaultColor);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="product-card group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link to={`/product/${product._id}`}>
                    {/* Image Container */}
                    <div className="product-image aspect-product">
                        <img
                            src={product.images?.[0]?.startsWith('http')
                                ? product.images[0]
                                : `${import.meta.env.VITE_API_URL}${product.images?.[0]}` || 'https://via.placeholder.com/400x500'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div className="product-overlay" />

                        {/* Quick Actions */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleAddToCart}
                                className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center
                         shadow-lg hover:bg-gold-500 transition-colors duration-300"
                            >
                                <ShoppingBag className="w-5 h-5" />
                            </motion.button>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full 
                         flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                            >
                                <Eye className="w-5 h-5" />
                            </motion.div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {discount > 0 && (
                                <span className="badge bg-red-500 text-white border-0">
                                    -{discount}%
                                </span>
                            )}
                            {product.featured && (
                                <span className="badge badge-gold">
                                    Featured
                                </span>
                            )}
                        </div>

                        {/* Stock Warning */}
                        {product.stock < 10 && product.stock > 0 && (
                            <div className="absolute bottom-3 left-3">
                                <span className="badge badge-warning">
                                    Only {product.stock} left
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                        {/* Brand */}
                        <p className="text-gold text-xs font-medium uppercase tracking-wider mb-1">
                            {product.brand?.name || 'Brand'}
                        </p>

                        {/* Name */}
                        <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-gold 
                         transition-colors duration-300">
                            {product.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <span className="text-gold font-bold text-lg">
                                {formatPrice(product.price)}
                            </span>
                            {product.comparePrice > product.price && (
                                <span className="text-gray-500 line-through text-sm">
                                    {formatPrice(product.comparePrice)}
                                </span>
                            )}
                        </div>

                        {/* Colors */}
                        {product.colors?.length > 0 && (
                            <div className="flex items-center gap-1 mt-3">
                                {product.colors.slice(0, 4).map((color, idx) => (
                                    <div
                                        key={idx}
                                        className="w-4 h-4 rounded-full border border-dark-300"
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                                {product.colors.length > 4 && (
                                    <span className="text-xs text-gray-500">
                                        +{product.colors.length - 4}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </Link>
            </motion.div>

            {/* Login Modal */}
            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

export default ProductCard;
