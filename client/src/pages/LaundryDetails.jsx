import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const LaundryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [laundry, setLaundry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            fetchLaundryDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user]);

    const fetchLaundryDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/laundry');
            const found = data.find(req => req._id === id);
            if (found) {
                setLaundry(found);
            } else {
                // Try to get from all laundry if user is admin/washer
                if (user?.role === 'admin' || user?.role === 'washer') {
                    const { data: allData } = await api.get('/laundry/all');
                    const foundAll = allData.find(req => req._id === id);
                    if (foundAll) {
                        setLaundry(foundAll);
                    } else {
                        setError('Laundry request not found');
                    }
                } else {
                    setError('Laundry request not found');
                }
            }
        } catch (error) {
            console.error(error);
            setError('Failed to fetch laundry details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!(user?.role === 'admin' || user?.role === 'washer')) {
            return;
        }

        try {
            setUpdating(true);
            await api.put(`/api/laundry/${id}`, { status: newStatus });
            fetchLaundryDetails();
        } catch (error) {
            console.error(error);
            setError('Failed to update status');
        } finally {
            setUpdating(false);
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

    if (loading) {
        return (
            <div className="max-w-4xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
                <div className="py-12 text-center">
                    <div className="inline-block w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
                    <p className="mt-2 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !laundry) {
        return (
            <div className="max-w-4xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
                <div className="relative px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                    {error || 'Laundry request not found'}
                </div>
                <Link
                    to="/dashboard"
                    className="text-primary hover:text-indigo-700"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl px-4 py-10 mx-auto sm:px-6 lg:px-8 fade-in-up">
            <div className="mb-6">
                <Link
                    to="/dashboard"
                    className="text-blue-600 dark:text-accent-blue hover:text-indigo-700 dark:hover:text-blue-400 mb-4 inline-block"
                >
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Laundry Request Details</h1>
            </div>

            <div className="p-8 bg-white dark:bg-[#1A1F2E] rounded-xl shadow-lg dark:shadow-premium-card card-hover border border-gray-100 dark:border-white/5">
                <div className="space-y-6">
                    {/* Status */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(laundry.status)}`}>
                                {laundry.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        {(user?.role === 'admin' || user?.role === 'washer') && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Update Status</p>
                                <select
                                    value={laundry.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    disabled={updating}
                                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue bg-white dark:bg-[#0D0F12] text-gray-900 dark:text-white disabled:opacity-50"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* User Info (for admin/washer) */}
                    {(user?.role === 'admin' || user?.role === 'washer') && laundry.user && (
                        <div className="pb-4 border-b border-gray-200 dark:border-white/10">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Customer</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">{laundry.user.name}</p>
                            {laundry.user.hostelBlock && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {laundry.user.hostelBlock} - Room {laundry.user.roomNumber}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Items */}
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Items</p>
                        <div className="bg-gray-50 dark:bg-[#0D0F12] rounded-lg p-4 border border-gray-100 dark:border-white/5">
                            <ul className="space-y-2">
                                {laundry.clothes.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span className="text-gray-900 dark:text-white font-medium">{item.itemType}</span>
                                        <span className="text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Total Items: {laundry.clothes.reduce((sum, item) => sum + item.quantity, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    {laundry.specialInstructions && (
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Special Instructions</p>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-4">
                                <p className="text-gray-800 dark:text-yellow-200">{laundry.specialInstructions}</p>
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Request Date</p>
                            <p className="text-gray-900 dark:text-white">
                                {new Date(laundry.createdAt).toLocaleString()}
                            </p>
                        </div>
                        {laundry.pickupDate && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pickup Date</p>
                                <p className="text-gray-900 dark:text-white">
                                    {new Date(laundry.pickupDate).toLocaleString()}
                                </p>
                            </div>
                        )}
                        {laundry.deliveryDate && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Delivery Date</p>
                                <p className="text-gray-900 dark:text-white">
                                    {new Date(laundry.deliveryDate).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaundryDetails;

