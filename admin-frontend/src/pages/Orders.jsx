import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash2 } from 'lucide-react';
import { ordersAPI, adminAPI } from '../services/api';
import { formatPrice, formatDate } from '../lib/utils';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (statusFilter) params.status = statusFilter;

            const response = await ordersAPI.getAllAdmin(params);
            setOrders(response.data.data.orders);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            toast.success('Order status updated');
            fetchOrders();
            if (selectedOrder?._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleDelete = (orderId, orderNumber) => {
        toast.custom((t) => (
            <div className="bg-dark-100 border border-dark-300 p-6 rounded-xl shadow-2xl max-w-sm w-full">
                <h3 className="text-white font-semibold mb-2">Delete Order?</h3>
                <p className="text-gray-400 text-sm mb-6">
                    Are you sure you want to delete order {orderNumber}? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmDelete(orderId);
                        }}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const confirmDelete = async (orderId) => {
        try {
            await adminAPI.deleteOrder(orderId);
            toast.success('Order deleted successfully');
            fetchOrders();
            if (selectedOrder?._id === orderId) {
                setSelectedOrder(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete order');
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

    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Orders</h1>
                    <p className="text-gray-400">Manage customer orders</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="">All Status</option>
                        {statuses.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            {loading ? (
                <PageLoader />
            ) : (
                <div className="bg-dark-100 border border-dark-300 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-300">
                                    <th className="text-left text-gray-400 font-medium p-4">Order</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Customer</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Items</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Total</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Status</th>
                                    <th className="text-left text-gray-400 font-medium p-4">Date</th>
                                    <th className="text-right text-gray-400 font-medium p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b border-dark-300 hover:bg-dark-200">
                                        <td className="p-4">
                                            <span className="text-gold font-medium">{order.orderNumber}</span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-white">{order.user?.name}</p>
                                            <p className="text-gray-500 text-sm">{order.user?.email}</p>
                                        </td>
                                        <td className="p-4 text-gray-400">{order.items?.length} items</td>
                                        <td className="p-4">
                                            <span className="text-gold font-medium">{formatPrice(order.total)}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="relative">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className={`input-field py-1.5 pr-8 text-sm cursor-pointer ${getStatusColor(order.status)}`}
                                                >
                                                    {statuses.map(s => (
                                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{formatDate(order.createdAt)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-gray-400 hover:text-gold hover:bg-dark-300 rounded-lg"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order._id, order.orderNumber)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-300 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 p-4 border-t border-dark-300">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg ${page === p ? 'bg-gold text-black' : 'bg-dark-200 text-gray-400 hover:text-white'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-100 border border-dark-300 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-dark-300 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    Order {selectedOrder.orderNumber}
                                </h2>
                                <p className="text-gray-400 text-sm">{formatDate(selectedOrder.createdAt)}</p>
                            </div>
                            <span className={`badge ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="text-white font-medium mb-3">Customer</h3>
                                <div className="p-4 bg-dark-200 rounded-lg">
                                    <p className="text-white">{selectedOrder.user?.name}</p>
                                    <p className="text-gray-400 text-sm">{selectedOrder.user?.email}</p>
                                    <p className="text-gray-400 text-sm">{selectedOrder.user?.phone}</p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-white font-medium mb-3">Shipping Address</h3>
                                <div className="p-4 bg-dark-200 rounded-lg">
                                    <p className="text-white">{selectedOrder.shippingAddress?.label}</p>
                                    <p className="text-gray-400 text-sm">{selectedOrder.shippingAddress?.street}</p>
                                    <p className="text-gray-400 text-sm">
                                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="text-white font-medium mb-3">Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-dark-200 rounded-lg">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/48'}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-grow">
                                                <p className="text-white text-sm">{item.name}</p>
                                                <p className="text-gray-400 text-xs">Size: {item.size} | Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-gold text-sm">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="p-4 bg-dark-200 rounded-lg space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Delivery</span>
                                    <span>{selectedOrder.deliveryFee === 0 ? 'Free' : formatPrice(selectedOrder.deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between text-white font-semibold pt-2 border-t border-dark-300">
                                    <span>Total</span>
                                    <span className="text-gold">{formatPrice(selectedOrder.total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="btn-dark w-full"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Orders;
