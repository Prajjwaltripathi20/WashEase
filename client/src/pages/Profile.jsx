import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        hostelBlock: '',
        roomNumber: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || '',
                hostelBlock: user.hostelBlock || '',
                roomNumber: user.roomNumber || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel edit - reset form data
            if (user) {
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    role: user.role || '',
                    hostelBlock: user.hostelBlock || '',
                    roomNumber: user.roomNumber || ''
                });
            }
        }
        setIsEditing(!isEditing);
        setMessage({ type: '', content: '' });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage({ type: '', content: '' });

        const result = await updateProfile(formData);

        setLoading(false);
        if (result.success) {
            setMessage({ type: 'success', content: 'Profile updated successfully!' });
            setIsEditing(false);
        } else {
            setMessage({ type: 'error', content: result.message });
        }
    };

    return (
        <div className="max-w-4xl px-4 py-10 mx-auto sm:px-6 lg:px-8 fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage your profile information</p>
                </div>
                <button
                    onClick={handleEditToggle}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {message.content && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                        : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                    }`}>
                    {message.content}
                </div>
            )}

            <div className="p-8 bg-white dark:bg-[#1A1F2E] rounded-xl shadow-lg dark:shadow-premium-card card-hover border border-gray-100 dark:border-white/5">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full border rounded-lg px-4 py-2 transition-colors ${isEditing
                                    ? 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0D0F12] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true} // Email is immutable
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                        {isEditing && <p className="mt-1 text-xs text-gray-500">Email cannot be changed.</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : ''}
                            onChange={handleChange}
                            disabled={true} // Role is immutable
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {formData.role === 'student' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hostel Block
                                </label>
                                <input
                                    type="text"
                                    name="hostelBlock"
                                    value={formData.hostelBlock}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-2 transition-colors ${isEditing
                                            ? 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0D0F12] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Room Number
                                </label>
                                <input
                                    type="text"
                                    name="roomNumber"
                                    value={formData.roomNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-2 transition-colors ${isEditing
                                            ? 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0D0F12] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                />
                            </div>
                        </>
                    )}

                    <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex justify-end">
                        {isEditing ? (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-wait' : ''
                                    }`}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 w-full">
                                Profile information is managed by the system. Contact an administrator to update your Email or Role.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

