import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    DollarSign, Package, Users, ShoppingCart,
    TrendingUp, AlertTriangle, ArrowRight
} from 'lucide-react';
import { adminAPI } from '../services/api';
import { formatPrice } from '../lib/utils';
import { PageLoader } from '../components/ui/LoadingSpinner';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await adminAPI.getDashboard();
                setStats(response.data.data);
            } catch (error) {
                console.error('Failed to fetch dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <PageLoader />;

    const statCards = [
        {
            title: 'Total Revenue',
            value: formatPrice(stats?.totalRevenue || 0),
            icon: DollarSign,
            color: 'bg-green-500/10 text-green-500',
            link: '/orders',
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: 'bg-blue-500/10 text-blue-500',
            link: '/orders',
        },
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'bg-purple-500/10 text-purple-500',
            link: '/products',
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'bg-gold/10 text-gold',
            link: '/users',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Overview of your store performance</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            to={stat.link}
                            className="block bg-dark-100 border border-dark-300 rounded-xl p-6
                       hover:border-gold/30 transition-colors group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.title}</p>
                                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-dark-100 border border-dark-300 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                        <Link to="/orders" className="text-gold text-sm hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {stats?.recentOrders?.slice(0, 5).map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-3 bg-dark-200 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">{order.orderNumber}</p>
                                    <p className="text-gray-400 text-sm">{order.user?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gold font-medium">{formatPrice(order.total)}</p>
                                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                                        order.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        )) || (
                                <p className="text-gray-500 text-center py-4">No recent orders</p>
                            )}
                    </div>
                </motion.div>

                {/* Low Stock Alert */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-dark-100 border border-dark-300 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Low Stock Alert
                        </h2>
                        <Link to="/products" className="text-gold text-sm hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {stats?.lowStockProducts?.slice(0, 5).map((product) => (
                            <div key={product._id} className="flex items-center justify-between p-3 bg-dark-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/40'}
                                        alt={product.name}
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                    <div>
                                        <p className="text-white font-medium text-sm">{product.name}</p>
                                        <p className="text-gray-400 text-xs">{product.brand?.name}</p>
                                    </div>
                                </div>
                                <span className="badge badge-danger">
                                    {product.stock} left
                                </span>
                            </div>
                        )) || (
                                <p className="text-gray-500 text-center py-4">No low stock items</p>
                            )}
                    </div>
                </motion.div>
            </div>

            {/* Top Products */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-dark-100 border border-dark-300 rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gold" />
                        Top Selling Products
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {stats?.topProducts?.map((product, index) => (
                        <div key={product._id} className="p-4 bg-dark-200 rounded-xl text-center">
                            <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-gold font-bold">#{index + 1}</span>
                            </div>
                            <img
                                src={product.images?.[0] || 'https://via.placeholder.com/80'}
                                alt={product.name}
                                className="w-16 h-16 rounded-lg object-cover mx-auto mb-2"
                            />
                            <p className="text-white font-medium text-sm line-clamp-1">{product.name}</p>
                            <p className="text-gray-400 text-xs">{product.totalSold} sold</p>
                        </div>
                    )) || (
                            <p className="text-gray-500 col-span-full text-center py-4">No sales data yet</p>
                        )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
