import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, ChevronRight } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../lib/utils';
import { PageLoader } from '../../components/ui/LoadingSpinner';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await ordersAPI.getAll();
                setOrders(response.data.data.orders);
                setPagination(response.data.data.pagination);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-display font-bold text-white mb-8">My Orders</h1>

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/orders/${order._id}`}
                                    className="block bg-dark-100 border border-dark-300 rounded-xl p-6
                           hover:border-gold/30 transition-colors group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-gold font-medium">{order.orderNumber}</span>
                                                <span className={`badge ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                {formatDate(order.createdAt)} • {order.items.length} item(s)
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-white font-semibold">{formatPrice(order.total)}</p>
                                                <p className="text-gray-500 text-sm capitalize">{order.paymentMethod}</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gold 
                                             transition-colors" />
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dark-300">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="w-12 h-12 rounded-lg bg-dark-200 overflow-hidden"
                                            >
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/48'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-12 h-12 rounded-lg bg-dark-200 flex items-center 
                                    justify-center text-gray-400 text-sm">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white mb-4">
                            No Orders Yet
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Start shopping to see your orders here
                        </p>
                        <Link to="/shop" className="btn-primary">
                            Start Shopping
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Orders;
