import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [laundry, setLaundry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [newRequest, setNewRequest] = useState({
        clothes: [{ itemType: 'T-Shirt', quantity: 1 }],
        specialInstructions: ''
    });

    const fetchLaundry = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/laundry');
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
            fetchLaundry();
        }
    }, [user]);

    const handleRemoveRow = (index) => {
        if (newRequest.clothes.length > 1) {
            const updatedClothes = newRequest.clothes.filter((_, i) => i !== index);
            setNewRequest({ ...newRequest, clothes: updatedClothes });
        }
    };

    const handleAddRow = () => {
        setNewRequest({
            ...newRequest,
            clothes: [...newRequest.clothes, { itemType: '', quantity: 1 }]
        });
    };

    const handleItemChange = (index, field, value) => {
        const updatedClothes = [...newRequest.clothes];
        updatedClothes[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;
        setNewRequest({ ...newRequest, clothes: updatedClothes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            await api.post('/api/laundry', newRequest);
            setSuccess('Laundry request submitted successfully!');
            fetchLaundry();
            setNewRequest({ clothes: [{ itemType: 'T-Shirt', quantity: 1 }], specialInstructions: '' });
        } catch (error) {
            if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
                setError('Cannot connect to server. Please make sure the backend server is running on port 5001.');
            } else if (error.response?.status === 503) {
                setError('Database not connected. Please check server configuration.');
            } else {
                setError(error.response?.data?.message || 'Failed to submit request');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault(); // Prevent navigation to details page
        if (!window.confirm('Are you sure you want to delete this laundry request?')) {
            return;
        }

        setDeleteLoading(id);
        try {
            await api.delete(`/laundry/${id}`);
            setSuccess('Laundry request deleted successfully!');
            fetchLaundry();
        } catch (error) {
            console.error('Delete error:', error);
            setError(error.response?.data?.message || 'Failed to delete request');
        } finally {
            setDeleteLoading(null);
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

    const itemTypes = ['T-Shirt', 'Shirt', 'Pant', 'Jeans', 'Trouser', 'Shorts', 'Jacket', 'Sweater', 'Dress', 'Skirt', 'Socks', 'Underwear', 'Towel', 'Bed Sheet', 'Pillow Cover', 'Other'];

    return (
        <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8 fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your laundry requests</p>
            </div>

            {error && (
                <div className="relative px-4 py-3 mb-4 text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-400 dark:border-red-800 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="relative px-4 py-3 mb-4 text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-400 dark:border-green-800 rounded">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* New Request Form */}
                <div className="p-6 bg-white dark:bg-[#1A1F2E] shadow-lg dark:shadow-premium-card rounded-xl card-hover border border-gray-100 dark:border-white/5">
                    <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">New Laundry Request</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            {newRequest.clothes.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <select
                                        className="flex-1 px-3 py-2 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent text-gray-900 dark:text-white"
                                        value={item.itemType}
                                        onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Item Type</option>
                                        {itemTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-24 px-3 py-2 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent text-gray-900 dark:text-white"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        required
                                    />
                                    {newRequest.clothes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRow(index)}
                                            className="px-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddRow}
                            className="text-sm font-medium text-blue-600 dark:text-accent-blue hover:text-indigo-700 dark:hover:text-blue-400"
                        >
                            + Add Another Item
                        </button>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Special Instructions (Optional)
                            </label>
                            <textarea
                                placeholder="Any special instructions for washing..."
                                className="w-full px-3 py-2 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent text-gray-900 dark:text-white"
                                rows="3"
                                value={newRequest.specialInstructions}
                                onChange={(e) => setNewRequest({ ...newRequest, specialInstructions: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 font-medium text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>

                {/* Recent Requests */}
                <div className="p-6 bg-white dark:bg-[#1A1F2E] shadow-lg dark:shadow-premium-card rounded-xl card-hover border border-gray-100 dark:border-white/5">
                    <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">Your Requests</h2>
                    {loading ? (
                        <div className="py-8 text-center">
                            <div className="inline-block w-8 h-8 border-b-2 rounded-full animate-spin border-blue-600 dark:border-accent-blue"></div>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {laundry.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">No requests yet. Create your first request!</p>
                                </div>
                            ) : (
                                laundry.map((req) => (
                                    <div key={req._id} className="relative group">
                                        <Link
                                            to={`/laundry/${req._id}`}
                                            className="block p-4 transition border border-gray-200 dark:border-white/10 rounded-lg cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 bg-gray-50 dark:bg-[#0D0F12]"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                                                    {req.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Items:</p>
                                                <ul className="space-y-1">
                                                    {req.clothes.map((c, i) => (
                                                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                                                            • {c.quantity}x {c.itemType}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {req.specialInstructions && (
                                                <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-500">
                                                    Note: {req.specialInstructions}
                                                </p>
                                            )}
                                        </Link>
                                        <button
                                            onClick={(e) => handleDelete(e, req._id)}
                                            disabled={deleteLoading === req._id}
                                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100"
                                            title="Delete Request"
                                        >
                                            {deleteLoading === req._id ? (
                                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
