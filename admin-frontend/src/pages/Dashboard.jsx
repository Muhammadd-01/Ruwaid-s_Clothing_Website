import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, ShoppingBag, DollarSign, Package,
    TrendingUp, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { adminAPI } from '../services/api';
import { formatPrice } from '../lib/utils';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState({
        monthlyRevenue: [],
        ordersByStatus: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await adminAPI.getDashboard();
                const { stats, recentOrders, ordersByStatus, monthlyRevenue, topProducts } = response.data.data;
                setStats({
                    ...stats,
                    recentOrders,
                    topProducts
                });
                setInitialData({
                    monthlyRevenue: monthlyRevenue.map(item => ({
                        ...item,
                        month: `${item._id.month}/${item._id.year}`
                    })),
                    ordersByStatus
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleExport = async (type) => {
        try {
            const loadingToast = toast.loading(`Generating ${type} report...`);
            const response = await adminAPI.exportData(type);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            toast.dismiss(loadingToast);
            toast.success('Report downloaded');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate report');
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400">Welcome back, Admin</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => handleExport('products')} className="btn-secondary">
                        Product Report
                    </button>
                    <button onClick={() => handleExport('orders')} className="btn-secondary">
                        Sales Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
                    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-gold', bg: 'bg-gold/10' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-dark-100 border border-dark-300 p-6 rounded-xl hover:border-gold/50 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            {index === 0 && <span className="text-xs text-green-400 font-medium">+12.5%</span>}
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-dark-100 border border-dark-300 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Revenue Analytics</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={initialData.monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="_id.month" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders by Status */}
                <div className="bg-dark-100 border border-dark-300 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Order Status</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={initialData.ordersByStatus}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="_id" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Orders & Top Products */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-dark-100 border border-dark-300 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Orders</h3>
                    <div className="space-y-4">
                        {stats?.recentOrders?.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">{order.orderNumber}</p>
                                    <p className="text-sm text-gray-400">{order.user?.name || 'Guest'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gold font-medium">{formatPrice(order.total)}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                                            order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-dark-100 border border-dark-300 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Top Selling Products</h3>
                    <div className="space-y-4">
                        {stats?.topProducts?.map((item) => (
                            <div key={item._id} className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.images?.[0]?.startsWith('http')
                                            ? item.images[0]
                                            : `${import.meta.env.VITE_API_URL}${item.images?.[0] || ''}` || 'https://via.placeholder.com/48'}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                                    />
                                    <div>
                                        <p className="text-white font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-400">{formatPrice(item.price)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-white">{item.totalSold}</p>
                                    <p className="text-xs text-gray-400">Sold</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
