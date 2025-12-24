import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { productsAPI, brandsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, brandsRes, categoriesRes] = await Promise.all([
                    productsAPI.getFeatured(8),
                    brandsAPI.getAll(),
                    categoriesAPI.getAll(),
                ]);

                setFeaturedProducts(productsRes.data.data.products);
                setBrands(brandsRes.data.data.brands);
                setCategories(categoriesRes.data.data.categories);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const features = [
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over Rs. 5000' },
        { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
        { icon: RefreshCw, title: 'Easy Returns', desc: '7 days return policy' },
        { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920"
                        alt="Fashion"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block px-4 py-2 bg-gold/10 border border-gold/20 rounded-full 
                          text-gold text-sm font-medium mb-6">
                            Your Multi-Brand Fashion Destination
                        </span>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white 
                         leading-tight mb-6">
                            Discover
                            <span className="block gradient-text">Premium Fashion</span>
                        </h1>

                        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl">
                            Shop the finest collections from Pakistan's most loved brands.
                            J., Bonanza, Alkaram, Khaadi, and more under one roof.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/shop" className="btn-primary text-lg px-8 py-4">
                                Shop Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link to="/about" className="btn-secondary text-lg px-8 py-4">
                                Our Story
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-3 bg-gold rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="py-12 border-b border-dark-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-dark-100 
                         transition-colors duration-300"
                            >
                                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="w-6 h-6 text-gold" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-gold text-sm font-medium uppercase tracking-wider"
                            >
                                Handpicked for You
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="section-title mt-2"
                            >
                                Featured Products
                            </motion.h2>
                        </div>
                        <Link
                            to="/shop"
                            className="text-gold hover:text-gold-400 font-medium flex items-center 
                       group mt-4 md:mt-0"
                        >
                            View All Products
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <ProductGridSkeleton count={8} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredProducts.map((product, index) => (
                                <ProductCard key={product._id} product={product} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Shop by Category */}
            <section className="section bg-dark-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-gold text-sm font-medium uppercase tracking-wider"
                        >
                            Browse Collections
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="section-title mt-2"
                        >
                            Shop by Category
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/shop?category=${category._id}`}
                                    className="group block relative aspect-square rounded-xl overflow-hidden"
                                >
                                    <img
                                        src={category.image || 'https://via.placeholder.com/300'}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-500 
                             group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 flex items-end p-4">
                                        <h3 className="text-white font-semibold text-lg group-hover:text-gold 
                                 transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shop by Brand */}
            <section className="section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-gold text-sm font-medium uppercase tracking-wider"
                        >
                            Premium Brands
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="section-title mt-2"
                        >
                            Shop by Brand
                        </motion.h2>
                        <p className="section-subtitle mx-auto mt-4">
                            Authentic products from Pakistan's most trusted fashion brands
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {brands.map((brand, index) => (
                            <motion.div
                                key={brand._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/shop?brand=${brand._id}`}
                                    className="group block p-6 bg-dark-100 border border-dark-300 rounded-xl
                           text-center hover:border-gold/30 hover:bg-dark-200 
                           transition-all duration-300"
                                >
                                    <div className="h-12 flex items-center justify-center mb-3">
                                        <span className="text-2xl font-display font-bold text-white group-hover:text-gold 
                                   transition-colors duration-300">
                                            {brand.name}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm">Shop Collection</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="section bg-dark-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dark-200 to-dark"
                    >
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0 bg-gold-gradient"
                                style={{ mixBlendMode: 'overlay' }} />
                        </div>

                        <div className="relative flex flex-col lg:flex-row items-center justify-between p-12 lg:p-16">
                            <div className="text-center lg:text-left mb-8 lg:mb-0">
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                                    New Arrivals Every Week
                                </h2>
                                <p className="text-gray-300 text-lg max-w-lg">
                                    Stay updated with the latest collections from your favorite brands.
                                    Sign up for exclusive early access.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="input-field w-full sm:w-64"
                                />
                                <button className="btn-primary whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
