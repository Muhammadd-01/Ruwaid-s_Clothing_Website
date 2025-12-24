import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../lib/utils';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderDetails = () => {
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

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const response = await ordersAPI.cancel(id);
            if (response.data.success) {
                setOrder(response.data.data.order);
                toast.success('Order cancelled successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'badge-warning',
            confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            delivered: 'badge-success',
            cancelled: 'badge-danger',
        };
        return colors[status] || 'badge-gold';
    };

    if (loading) return <PageLoader />;
    if (!order) return <div className="text-center text-white py-20">Order not found</div>;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            to="/orders"
                            className="flex items-center text-gray-400 hover:text-white mb-2"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Orders
                        </Link>
                        <h1 className="text-3xl font-display font-bold text-white">
                            Order {order.orderNumber}
                        </h1>
                    </div>
                    <span className={`badge ${getStatusColor(order.status)} text-sm px-4 py-2`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-dark-100 border border-dark-300 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-gold" />
                                Order Items
                            </h2>

                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-dark-200 rounded-lg">
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
                        </motion.div>

                        {/* Delivery Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-dark-100 border border-dark-300 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-gold" />
                                Delivery Details
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Shipping Address</p>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-5 h-5 text-gold mt-0.5" />
                                        <div>
                                            <p className="text-white">{order.shippingAddress?.label}</p>
                                            <p className="text-gray-400 text-sm">{order.shippingAddress?.street}</p>
                                            <p className="text-gray-400 text-sm">
                                                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm mb-2">Delivery Option</p>
                                    <p className="text-white capitalize">{order.deliveryOption}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {order.deliveryOption === 'express' ? '2-3 business days' : '5-7 business days'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-dark-100 border border-dark-300 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gold" />
                                Payment Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                                    <p className="text-white">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Payment Status</p>
                                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-dark-100 border border-dark-300 rounded-xl p-6 sticky top-24"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-400">
                                    <span>Order Date</span>
                                    <span>{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Delivery Fee</span>
                                    <span>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span>
                                </div>
                            </div>

                            <div className="border-t border-dark-300 pt-4 mb-6">
                                <div className="flex justify-between text-white font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-gold">{formatPrice(order.total)}</span>
                                </div>
                            </div>

                            {/* Cancel Button */}
                            {['pending', 'confirmed'].includes(order.status) && (
                                <button
                                    onClick={handleCancelOrder}
                                    className="w-full py-3 border border-red-500/30 text-red-400 rounded-lg
                           hover:bg-red-500/10 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
