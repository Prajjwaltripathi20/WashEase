import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useEmployee } from '../context/EmployeeContext';
import EmployeeNavbar from '../components/EmployeeNavbar';

const EmployeeDashboard = () => {
    const { employee } = useEmployee();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/employee/orders');
            setOrders(data);
        } catch (error) {
            console.error(error);
            if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
                setError('Cannot connect to server. Please make sure the backend server is running.');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch orders');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'accepted': 'bg-blue-100 text-blue-800',
            'rejected': 'bg-red-100 text-red-800',
            'picked_up': 'bg-purple-100 text-purple-800',
            'in_process': 'bg-indigo-100 text-indigo-800',
            'washed': 'bg-cyan-100 text-cyan-800',
            'ironed': 'bg-pink-100 text-pink-800',
            'ready': 'bg-green-100 text-green-800',
            'delivered': 'bg-emerald-100 text-emerald-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredOrders = filter === 'all' 
        ? orders 
        : filter === 'assigned'
        ? orders.filter(o => o.assignedTo && o.assignedTo._id === employee?._id)
        : orders.filter(o => o.status === filter);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        assigned: orders.filter(o => o.assignedTo && o.assignedTo._id === employee?._id).length,
        inProgress: orders.filter(o => ['accepted', 'picked_up', 'in_process', 'washed', 'ironed'].includes(o.status)).length,
        ready: orders.filter(o => o.status === 'ready').length,
        delivered: orders.filter(o => o.status === 'delivered').length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
            <EmployeeNavbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 fade-in">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {employee?.name}</p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow card-hover">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow card-hover">
                        <p className="text-sm text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow card-hover">
                        <p className="text-sm text-blue-600">Assigned</p>
                        <p className="text-2xl font-bold text-blue-700">{stats.assigned}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow card-hover">
                        <p className="text-sm text-indigo-600">In Progress</p>
                        <p className="text-2xl font-bold text-indigo-700">{stats.inProgress}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow card-hover">
                        <p className="text-sm text-green-600">Ready</p>
                        <p className="text-2xl font-bold text-green-700">{stats.ready}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow card-hover">
                        <p className="text-sm text-emerald-600">Delivered</p>
                        <p className="text-2xl font-bold text-emerald-700">{stats.delivered}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg transition ${
                                filter === 'all' 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg transition ${
                                filter === 'pending' 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('assigned')}
                            className={`px-4 py-2 rounded-lg transition ${
                                filter === 'assigned' 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            My Orders
                        </button>
                        <button
                            onClick={() => setFilter('ready')}
                            className={`px-4 py-2 rounded-lg transition ${
                                filter === 'ready' 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Ready
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-lg shadow">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
                            <p className="mt-2 text-gray-500">Loading orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <Link
                                    key={order._id}
                                    to={`/employee/orders/${order._id}`}
                                    className="block p-6 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                                {order.assignedTo && order.assignedTo._id === employee?._id && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                        ASSIGNED TO YOU
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {order.user?.name || 'Unknown Customer'}
                                            </h3>
                                            {order.user?.hostelBlock && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {order.user.hostelBlock} - Room {order.user.roomNumber}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {order.clothes.map((item, idx) => (
                                                    <span key={idx} className="text-sm text-gray-600">
                                                        {item.quantity}x {item.itemType}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Created: {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;

