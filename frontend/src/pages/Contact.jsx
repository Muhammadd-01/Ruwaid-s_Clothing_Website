import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await contactAPI.submit(formData);
            toast.success('Message sent! A confirmation has been sent to ruwaidclothing@gmail.com');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['123 Fashion Street', 'Gulberg III, Lahore', 'Pakistan']
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+92 300 1234567', '+92 42 35761234']
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: ['info@ruwaidsclothing.com', 'support@ruwaidsclothing.com']
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: ['Mon - Sat: 10:00 AM - 9:00 PM', 'Sunday: 12:00 PM - 8:00 PM']
        },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-2 bg-gold/10 border border-gold/20 rounded-full 
                      text-gold text-sm font-medium mb-6"
                    >
                        Get in Touch
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
                    >
                        Contact Us
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Have a question or need assistance? We're here to help.
                        Reach out to us through any of the channels below.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-dark-100 border border-dark-300 rounded-2xl p-8">
                            <h2 className="text-2xl font-display font-bold text-white mb-6">
                                Send us a Message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="John Doe"
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            placeholder="john@example.com"
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        placeholder="How can we help?"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={6}
                                        placeholder="Tell us more about your inquiry..."
                                        className="input-field resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                            Sending...
                                        </span>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="ml-2 w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-dark-100 border border-dark-300 rounded-xl p-6
                         hover:border-gold/30 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <info.icon className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-2">{info.title}</h3>
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className="text-gray-400 text-sm">{detail}</p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Map Placeholder */}
                        <div className="bg-dark-100 border border-dark-300 rounded-xl h-48 flex items-center justify-center">
                            <p className="text-gray-500 text-sm">Map integration coming soon</p>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-display font-bold text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-400">Quick answers to common inquiries</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                q: "What is your delivery timeframe?",
                                a: "We typically deliver within 3-5 business days across Pakistan. International shipping may take 7-14 days."
                            },
                            {
                                q: "Are all products authentic?",
                                a: "Yes, 100%. We source directly from authorized brand distributors to ensure genuine quality."
                            },
                            {
                                q: "How can I track my order?",
                                a: "Once your order is shipped, you'll receive a tracking number via email and SMS."
                            },
                            {
                                q: "What is your return policy?",
                                a: "We offer a 7-day hassle-free return policy for unworn items with original tags."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-dark-100 border border-dark-300 rounded-xl p-6">
                                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                                    {faq.q}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-24 bg-dark-200 rounded-xl overflow-hidden border border-dark-300 h-96">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14480.207914023756!2d67.0911765!3d24.8614622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33ea3db108f41%3A0x42d1e02422709112!2sKarachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1703666666666!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;
