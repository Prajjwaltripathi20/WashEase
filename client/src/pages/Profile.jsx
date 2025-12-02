import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
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

    return (
        <div className="max-w-4xl px-4 py-10 mx-auto sm:px-6 lg:px-8 fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage your profile information</p>
            </div>

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
                            disabled
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
                            disabled
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                            onChange={handleChange}
                            disabled
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
                                    disabled
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
                                    disabled
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-[#0D0F12] text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </>
                    )}

                    <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Profile information is managed by the system. Contact an administrator to update your details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

