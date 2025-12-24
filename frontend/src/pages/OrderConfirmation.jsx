import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Truck } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { formatPrice, formatDate } from '../lib/utils';
import { PageLoader } from '../components/ui/LoadingSpinner';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersAPI.getOne(id);
                setOrder(response.data.data.order);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <PageLoader />;
    if (!order) return <div className="text-center text-white py-20">Order not found</div>;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>

                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-400">
                        Thank you for your order. We'll send you a confirmation email shortly.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-dark-100 border border-dark-300 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-dark-300">
                        <div>
                            <p className="text-gray-400 text-sm">Order Number</p>
                            <p className="text-gold font-bold text-lg">{order.orderNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Order Date</p>
                            <p className="text-white">{formatDate(order.createdAt)}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <img
                                    src={item.image || 'https://via.placeholder.com/80'}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-grow">
                                    <p className="text-white font-medium">{item.name}</p>
                                    <p className="text-gray-400 text-sm">
                                        Size: {item.size} | Qty: {item.quantity}
                                    </p>
                                </div>
                                <p className="text-gold font-medium">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-2 pt-4 border-t border-dark-300">
                        <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>Delivery ({order.deliveryOption})</span>
                            <span>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between text-white font-semibold text-lg pt-2">
                            <span>Total</span>
                            <span className="text-gold">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Delivery Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-dark-100 border border-dark-300 rounded-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Truck className="w-6 h-6 text-gold" />
                        <h2 className="text-white font-semibold">Delivery Details</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Shipping Address</p>
                            <p className="text-white">{order.shippingAddress?.street}</p>
                            <p className="text-gray-400">
                                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                            <p className="text-white">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Estimated delivery: {order.deliveryOption === 'express' ? '2-3' : '5-7'} business days
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link to="/orders" className="btn-secondary flex-grow">
                        <Package className="w-5 h-5 mr-2" />
                        View All Orders
                    </Link>
                    <Link to="/shop" className="btn-primary flex-grow">
                        Continue Shopping
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
