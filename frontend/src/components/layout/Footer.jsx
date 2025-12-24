import { Link } from 'react-router-dom';
import {
    Facebook, Instagram, Twitter, Youtube,
    Mail, Phone, MapPin, ArrowRight
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const customerService = [
        { name: 'My Account', path: '/profile' },
        { name: 'Track Order', path: '/orders' },
        { name: 'Shipping Info', path: '/about' },
        { name: 'Returns', path: '/contact' },
    ];

    const brands = ['J.', 'Bonanza', 'Alkaram', 'Khaadi', 'Gul Ahmed', 'Sana Safinaz'];

    return (
        <footer className="bg-dark-100 border-t border-dark-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                                <span className="text-black font-display font-bold text-xl">R</span>
                            </div>
                            <div>
                                <span className="text-xl font-display font-bold text-white">Ruwaid's</span>
                                <span className="text-xl font-display font-bold text-gold ml-1">Clothing</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted multi-brand retailer for premium Pakistani fashion.
                            We bring you the finest collections from top brands.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 bg-dark-200 rounded-lg flex items-center justify-center
                           text-gray-400 hover:bg-gold hover:text-black transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-gold transition-colors duration-300 
                             flex items-center group"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 
                                         group-hover:opacity-100 group-hover:translate-x-0 
                                         transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Customer Service</h3>
                        <ul className="space-y-3">
                            {customerService.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-gold transition-colors duration-300 
                             flex items-center group"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 
                                         group-hover:opacity-100 group-hover:translate-x-0 
                                         transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                                <span className="text-sm">123 Fashion Street, Lahore, Pakistan</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                                <span className="text-sm">+92 300 1234567</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                                <span className="text-sm">info@ruwaidsclothing.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Brands Section */}
                <div className="mt-12 pt-8 border-t border-dark-300">
                    <h3 className="text-white font-semibold mb-4 text-center">Featured Brands</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {brands.map((brand) => (
                            <Link
                                key={brand}
                                to={`/shop?brand=${brand}`}
                                className="px-4 py-2 bg-dark-200 rounded-lg text-gray-400 text-sm
                         hover:bg-gold/10 hover:text-gold hover:border-gold/30 
                         border border-dark-300 transition-all duration-300"
                            >
                                {brand}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-dark-300 bg-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            © {currentYear} Ruwaid's Clothing. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-xs text-center md:text-right max-w-xl">
                            <strong className="text-gray-500">Disclaimer:</strong> Ruwaid's Clothing is an independent
                            multi-brand retailer. All brand names, logos, and trademarks displayed on this website are
                            the property of their respective owners. We are not affiliated with, endorsed by, or
                            sponsored by any of the brands we carry.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
