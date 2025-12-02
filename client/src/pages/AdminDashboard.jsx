import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [laundry, setLaundry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');

    const fetchAllLaundry = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/laundry/all');
            setLaundry(data);
        } catch (error) {
            console.error(error);
            if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
                setError('Cannot connect to server. Please make sure the backend server is running on port 5001.');
            } else if (error.response?.status === 503) {
                setError('Database not connected. Please check server configuration.');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch laundry requests');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAllLaundry();
        }
    }, [user]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/api/laundry/${id}`, { status: newStatus });
            fetchAllLaundry();
        } catch (error) {
            console.error(error);
            if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
                setError('Cannot connect to server. Please make sure the backend server is running on port 5001.');
            } else {
                setError(error.response?.data?.message || 'Failed to update status');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'picked_up': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-purple-100 text-purple-800';
            case 'ready': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'picked_up', label: 'Picked Up' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'ready', label: 'Ready' },
        { value: 'delivered', label: 'Delivered' }
    ];

    const filteredLaundry = filter === 'all'
        ? laundry
        : laundry.filter(req => req.status === filter);

    const stats = {
        total: laundry.length,
        pending: laundry.filter(r => r.status === 'pending').length,
        in_progress: laundry.filter(r => r.status === 'in_progress' || r.status === 'picked_up').length,
        ready: laundry.filter(r => r.status === 'ready').length,
        delivered: laundry.filter(r => r.status === 'delivered').length
    };

    return (
        <div className="max-w-7xl px-4 py-10 mx-auto sm:px-6 lg:px-8 fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Manage all laundry requests</p>
            </div>

            {error && (
                <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-5">
                <div className="p-4 bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card card-hover border border-gray-100 dark:border-white/5">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card card-hover border border-gray-100 dark:border-white/5">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card card-hover border border-gray-100 dark:border-white/5">
                    <p className="text-sm text-blue-600 dark:text-blue-400">In Progress</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.in_progress}</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card card-hover border border-gray-100 dark:border-white/5">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Ready</p>
                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{stats.ready}</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card card-hover border border-gray-100 dark:border-white/5">
                    <p className="text-sm text-green-600 dark:text-green-400">Delivered</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.delivered}</p>
                </div>
            </div>

            {/* Filter */}
            <div className="p-4 mb-6 bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card card-hover border border-gray-100 dark:border-white/5">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition ${filter === 'all'
                                ? 'bg-blue-600 dark:bg-accent-blue text-white shadow-lg shadow-blue-500/30'
                                : 'bg-gray-100 dark:bg-[#0D0F12] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'
                            }`}
                    >
                        All
                    </button>
                    {statusOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`px-4 py-2 rounded-lg transition ${filter === option.value
                                    ? 'bg-blue-600 dark:bg-accent-blue text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-100 dark:bg-[#0D0F12] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Laundry Requests */}
            <div className="bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card border border-gray-100 dark:border-white/5 overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-accent-blue"></div>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                            <thead className="bg-gray-50 dark:bg-[#0D0F12]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1A1F2E] divide-y divide-gray-200 dark:divide-white/10">
                                {filteredLaundry.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No requests found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLaundry.map((req) => (
                                        <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {req.user?.name || 'Unknown'}
                                                    </div>
                                                    {req.user?.hostelBlock && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {req.user.hostelBlock} - {req.user.roomNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-300">
                                                    {req.clothes.map((c, i) => (
                                                        <div key={i}>{c.quantity}x {c.itemType}</div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                                                    {req.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`/laundry/${req._id}`}
                                                        className="text-blue-600 dark:text-accent-blue hover:text-indigo-700 dark:hover:text-blue-400"
                                                    >
                                                        View
                                                    </Link>
                                                    <select
                                                        value={req.status}
                                                        onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                                                        className="text-sm border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue bg-white dark:bg-[#0D0F12] text-gray-900 dark:text-white"
                                                    >
                                                        {statusOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

