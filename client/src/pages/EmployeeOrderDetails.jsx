import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useEmployee } from '../context/EmployeeContext';
import EmployeeNavbar from '../components/EmployeeNavbar';

const EmployeeOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { employee } = useEmployee();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [statusNotes, setStatusNotes] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/employee/orders/${id}`);
            setOrder(data);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        try {
            setActionLoading('accept');
            await api.post(`/api/employee/orders/${id}/accept`);
            await fetchOrderDetails();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to accept order');
        } finally {
            setActionLoading('');
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            setError('Please provide a reason for rejection');
            return;
        }
        try {
            setActionLoading('reject');
            await api.post(`/api/employee/orders/${id}/reject`, { reason: rejectReason });
            setShowRejectModal(false);
            setRejectReason('');
            await fetchOrderDetails();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reject order');
        } finally {
            setActionLoading('');
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setActionLoading(newStatus);
            await api.put(`/api/employee/orders/${id}/status`, {
                status: newStatus,
                notes: statusNotes || undefined
            });
            setStatusNotes('');
            await fetchOrderDetails();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update status');
        } finally {
            setActionLoading('');
        }
    };

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

    const getNextStatus = (currentStatus) => {
        const flow = {
            'accepted': 'picked_up',
            'picked_up': 'in_process',
            'in_process': 'washed',
            'washed': 'ironed',
            'ironed': 'ready',
            'ready': 'delivered'
        };
        return flow[currentStatus];
    };

    const statusButtons = [
        { status: 'picked_up', label: 'Mark as Picked Up', icon: '📦' },
        { status: 'in_process', label: 'Start Processing', icon: '🔄' },
        { status: 'washed', label: 'Mark as Washed', icon: '🧼' },
        { status: 'ironed', label: 'Mark as Ironed', icon: '👔' },
        { status: 'ready', label: 'Mark as Ready', icon: '✅' },
        { status: 'delivered', label: 'Mark as Delivered', icon: '🚚' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
                    <p className="mt-2 text-gray-500">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                    <button
                        onClick={() => navigate('/employee/dashboard')}
                        className="text-primary hover:text-indigo-700"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const isAssigned = order.assignedTo && order.assignedTo._id === employee?._id;
    const nextStatus = getNextStatus(order.status);
    const canUpdateStatus = isAssigned && ['accepted', 'picked_up', 'in_progress', 'washed', 'ironed', 'ready'].includes(order.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-[#0B0F17] dark:to-[#10141C] transition-colors duration-300">
            <EmployeeNavbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6 fade-in">
                    <button
                        onClick={() => navigate('/employee/dashboard')}
                        className="text-blue-600 dark:text-accent-blue hover:text-indigo-700 dark:hover:text-blue-400 mb-4 inline-flex items-center transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Details</h1>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Order Status Card */}
                    <div className="bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card p-6 card-hover border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Status</p>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                            {order.assignedTo && (
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{order.assignedTo.name}</p>
                                </div>
                            )}
                        </div>

                        {/* Accept/Reject Buttons for Pending Orders */}
                        {order.status === 'pending' && !isAssigned && (
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleAccept}
                                    disabled={actionLoading === 'accept'}
                                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 transition shadow-lg shadow-green-500/30"
                                >
                                    {actionLoading === 'accept' ? 'Accepting...' : '✓ Accept Order'}
                                </button>
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={actionLoading === 'reject'}
                                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50 transition shadow-lg shadow-red-500/30"
                                >
                                    ✗ Reject Order
                                </button>
                            </div>
                        )}

                        {/* Status Update Buttons */}
                        {canUpdateStatus && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Status:</p>
                                <div className="space-y-2">
                                    {statusButtons
                                        .filter(btn => {
                                            if (order.status === 'accepted') return btn.status === 'picked_up';
                                            return btn.status === nextStatus;
                                        })
                                        .map((btn) => (
                                            <button
                                                key={btn.status}
                                                onClick={() => handleStatusUpdate(btn.status)}
                                                disabled={actionLoading === btn.status}
                                                className="w-full bg-blue-600 dark:bg-accent-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                                            >
                                                <span>{btn.icon}</span>
                                                {actionLoading === btn.status ? 'Updating...' : btn.label}
                                            </button>
                                        ))}
                                </div>
                                <textarea
                                    placeholder="Add notes (optional)"
                                    className="w-full mt-2 px-3 py-2 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                                    rows="2"
                                    value={statusNotes}
                                    onChange={(e) => setStatusNotes(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card p-6 card-hover border border-gray-100 dark:border-white/5">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Customer Information</h2>
                        <div className="space-y-2 text-gray-600 dark:text-gray-300">
                            <p><span className="font-medium text-gray-900 dark:text-white">Name:</span> {order.user?.name}</p>
                            <p><span className="font-medium text-gray-900 dark:text-white">Email:</span> {order.user?.email}</p>
                            {order.user?.hostelBlock && (
                                <>
                                    <p><span className="font-medium text-gray-900 dark:text-white">Hostel Block:</span> {order.user.hostelBlock}</p>
                                    <p><span className="font-medium text-gray-900 dark:text-white">Room Number:</span> {order.user.roomNumber}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card p-6 card-hover border border-gray-100 dark:border-white/5">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Items</h2>
                        <div className="space-y-2">
                            {order.clothes.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#0D0F12] rounded-lg border border-gray-100 dark:border-white/5">
                                    <span className="font-medium text-gray-900 dark:text-white">{item.itemType}</span>
                                    <span className="text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</span>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    Total Items: {order.clothes.reduce((sum, item) => sum + item.quantity, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    {order.specialInstructions && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Special Instructions</h2>
                            <p className="text-gray-800 dark:text-yellow-100">{order.specialInstructions}</p>
                        </div>
                    )}

                    {/* Activity Timeline */}
                    <div className="bg-white dark:bg-[#1A1F2E] rounded-lg shadow dark:shadow-premium-card p-6 card-hover border border-gray-100 dark:border-white/5">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Activity Timeline</h2>
                        <div className="space-y-4">
                            {order.activityLog && order.activityLog.length > 0 ? (
                                order.activityLog
                                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                                    .map((activity, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-blue-600 dark:bg-accent-blue rounded-full mt-2"></div>
                                                {idx < order.activityLog.length - 1 && (
                                                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 ml-1"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(activity.status)}`}>
                                                        {activity.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        by {activity.updatedBy?.name || 'System'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{activity.notes}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    {new Date(activity.updatedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No activity logged yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1A1F2E] rounded-lg p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-white/10">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Reject Order</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please provide a reason for rejecting this order:</p>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue mb-4 text-gray-900 dark:text-white"
                            rows="3"
                            placeholder="Enter rejection reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading === 'reject'}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50 transition shadow-lg shadow-red-500/30"
                            >
                                {actionLoading === 'reject' ? 'Rejecting...' : 'Reject Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeOrderDetails;

