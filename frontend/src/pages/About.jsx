import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

const About = () => {
    const stats = [
        { number: '50+', label: 'Premium Brands' },
        { number: '10K+', label: 'Happy Customers' },
        { number: '25K+', label: 'Products Sold' },
        { number: '5+', label: 'Years Experience' },
    ];

    const values = [
        {
            icon: Award,
            title: 'Quality First',
            description: 'We only carry authentic products from trusted brands, ensuring you receive genuine quality every time.'
        },
        {
            icon: Users,
            title: 'Customer Focus',
            description: 'Your satisfaction is our priority. We provide exceptional service and support at every step.'
        },
        {
            icon: Heart,
            title: 'Passion for Fashion',
            description: 'We\'re passionate about bringing you the latest trends and timeless classics from top Pakistani brands.'
        },
        {
            icon: ShieldCheck,
            title: 'Trusted & Secure',
            description: 'Shop with confidence knowing your transactions are secure and your data is protected.'
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920"
                        alt="Fashion"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-dark/80" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-2 bg-gold/10 border border-gold/20 rounded-full 
                      text-gold text-sm font-medium mb-6"
                    >
                        Our Story
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
                    >
                        Your Trusted Multi-Brand
                        <span className="block gradient-text">Fashion Destination</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-300 text-lg max-w-2xl mx-auto"
                    >
                        Ruwaid's Clothing brings together Pakistan's most beloved fashion brands
                        under one roof, making premium fashion accessible to everyone.
                    </motion.p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 border-y border-dark-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-4xl md:text-5xl font-display font-bold text-gold mb-2">
                                    {stat.number}
                                </p>
                                <p className="text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="section">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="section-title mb-6">Who We Are</h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Founded with a vision to bring Pakistan's finest fashion brands to your doorstep,
                                    Ruwaid's Clothing has grown into a trusted name in multi-brand retail.
                                </p>
                                <p>
                                    We partner with renowned brands like J., Bonanza, Alkaram, Khaadi, Gul Ahmed,
                                    and Sana Safinaz to offer you authentic, high-quality clothing that meets
                                    the highest standards.
                                </p>
                                <p>
                                    Our mission is simple: to make premium Pakistani fashion accessible, affordable,
                                    and convenient for everyone.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="relative"
                        >
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800"
                                    alt="Fashion store"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gold/10 rounded-2xl -z-10" />
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gold/5 rounded-2xl -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section bg-dark-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="section-title mb-4"
                        >
                            Our Values
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="section-subtitle mx-auto"
                        >
                            What makes us different
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-dark border border-dark-300 rounded-xl 
                         hover:border-gold/30 transition-colors"
                            >
                                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                                    <value.icon className="w-6 h-6 text-gold" />
                                </div>
                                <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                                <p className="text-gray-400 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-12 border-t border-dark-300">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-dark-100 border border-dark-300 rounded-xl p-6">
                        <h3 className="text-white font-semibold mb-3">Important Notice</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Ruwaid's Clothing is an independent multi-brand retailer. All brand names, logos,
                            and trademarks displayed on this website are the property of their respective owners.
                            We are not affiliated with, endorsed by, or sponsored by any of the brands we carry.
                            All products sold are genuine and sourced through authorized channels.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="section-title mb-6"
                    >
                        Ready to Explore?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg mb-8"
                    >
                        Discover the latest collections from your favorite brands
                    </motion.p>
                    <Link to="/shop" className="btn-primary text-lg px-8 py-4">
                        Shop Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
