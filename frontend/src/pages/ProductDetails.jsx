import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShoppingBag, Heart, Minus, Plus, Truck, Shield,
    RefreshCw, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { productsAPI } from '../services/api';
import { formatPrice, getDiscountPercentage } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ui/ProductCard';
import LoginPromptModal from '../components/ui/LoginPromptModal';
import { PageLoader } from '../components/ui/LoadingSpinner';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const [productRes, relatedRes] = await Promise.all([
                    productsAPI.getOne(id),
                    productsAPI.getRelated(id),
                ]);

                setProduct(productRes.data.data.product);
                setRelatedProducts(relatedRes.data.data.products);

                // Set defaults
                const prod = productRes.data.data.product;
                if (prod.sizes?.length > 0) setSelectedSize(prod.sizes[0]);
                if (prod.colors?.length > 0) setSelectedColor(prod.colors[0]);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        setSelectedImage(0);
        setQuantity(1);
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        if (!selectedSize) {
            return;
        }

        setAddingToCart(true);
        await addToCart(product._id, quantity, selectedSize, selectedColor);
        setAddingToCart(false);
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        if (!selectedSize) {
            return;
        }

        setAddingToCart(true);
        const result = await addToCart(product._id, quantity, selectedSize, selectedColor);
        setAddingToCart(false);

        if (result.success) {
            navigate('/checkout');
        }
    };

    if (loading) return <PageLoader />;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-white">Product not found</div>;

    const discount = getDiscountPercentage(product.price, product.comparePrice);

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-gold">{product.name}</span>
                </nav>

                {/* Product Section */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        {/* Main Image */}
                        <div className="relative aspect-product bg-dark-100 rounded-2xl overflow-hidden">
                            <img
                                src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x800'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Navigation Arrows */}
                            {product.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage(prev =>
                                            prev === 0 ? product.images.length - 1 : prev - 1
                                        )}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark/80 
                             rounded-full flex items-center justify-center text-white
                             hover:bg-gold hover:text-black transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(prev =>
                                            prev === product.images.length - 1 ? 0 : prev + 1
                                        )}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark/80 
                             rounded-full flex items-center justify-center text-white
                             hover:bg-gold hover:text-black transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {discount > 0 && (
                                    <span className="badge bg-red-500 text-white border-0">
                                        -{discount}% OFF
                                    </span>
                                )}
                                {product.featured && (
                                    <span className="badge badge-gold">Featured</span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 
                             transition-colors ${selectedImage === index
                                                ? 'border-gold'
                                                : 'border-dark-300 hover:border-gold/50'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Brand */}
                        <Link
                            to={`/shop?brand=${product.brand?._id}`}
                            className="inline-block text-gold text-sm font-medium uppercase tracking-wider
                       hover:underline"
                        >
                            {product.brand?.name}
                        </Link>

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-gold">
                                {formatPrice(product.price)}
                            </span>
                            {product.comparePrice > product.price && (
                                <span className="text-xl text-gray-500 line-through">
                                    {formatPrice(product.comparePrice)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.stock > 0 ? (
                                <>
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-green-500 font-medium">
                                        In Stock ({product.stock} available)
                                    </span>
                                </>
                            ) : (
                                <span className="text-red-500 font-medium">Out of Stock</span>
                            )}
                        </div>

                        {/* Colors */}
                        {product.colors?.length > 0 && (
                            <div>
                                <label className="text-white font-medium mb-3 block">
                                    Color: {selectedColor?.name}
                                </label>
                                <div className="flex gap-3">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all
                               ${selectedColor?.hex === color.hex
                                                    ? 'border-gold scale-110'
                                                    : 'border-dark-300 hover:border-gold/50'
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {product.sizes?.length > 0 && (
                            <div>
                                <label className="text-white font-medium mb-3 block">Size</label>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all
                               ${selectedSize === size
                                                    ? 'bg-gold text-black'
                                                    : 'bg-dark-100 text-gray-400 border border-dark-300 hover:border-gold/50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <label className="text-white font-medium mb-3 block">Quantity</label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 bg-dark-100 border border-dark-300 rounded-lg 
                           flex items-center justify-center text-gray-400 
                           hover:border-gold hover:text-white transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-16 text-center text-white font-medium text-lg">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 bg-dark-100 border border-dark-300 rounded-lg 
                           flex items-center justify-center text-gray-400 
                           hover:border-gold hover:text-white transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addingToCart}
                                className="btn-secondary flex-grow"
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0 || addingToCart}
                                className="btn-primary flex-grow"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dark-300">
                            <div className="text-center">
                                <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <Shield className="w-6 h-6 text-gold mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Secure Payment</p>
                            </div>
                            <div className="text-center">
                                <RefreshCw className="w-6 h-6 text-gold mx-auto mb-2" />
                                <p className="text-sm text-gray-400">7 Days Return</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-display font-bold text-white mb-8">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((prod, index) => (
                                <ProductCard key={prod._id} product={prod} index={index} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Login Modal */}
            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
};

export default ProductDetails;
