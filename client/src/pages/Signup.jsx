import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        hostelBlock: '',
        roomNumber: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await signup(formData);
        if (result.success) {
            // Redirect based on user role
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'washer')) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-slate-100 dark:from-[#0B0F17] dark:via-[#10141C] dark:to-[#0B0F17] transition-colors duration-300">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-[#1A1F2E]/80 shadow-xl dark:shadow-premium-card rounded-2xl backdrop-blur fade-in-up card-hover border border-white/20 dark:border-white/10">
                <div className="text-center">
                    <p className="text-sm font-medium tracking-wide text-blue-600 dark:text-accent-blue uppercase">Get started</p>
                    <h2 className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Join WashEase and simplify your hostel laundry.
                    </p>
                </div>
                {error && (
                    <div className="relative px-4 py-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-400 dark:border-red-800 rounded">
                        {error}
                    </div>
                )}
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="relative block w-full px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent transition-colors"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="relative block w-full px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent transition-colors"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="relative block w-full px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent transition-colors"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <select
                                name="role"
                                className="relative block w-full px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent transition-colors"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="student">Student</option>
                                <option value="washer">Washer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        {formData.role === 'student' && (
                            <>
                                <div>
                                    <input
                                        name="hostelBlock"
                                        type="text"
                                        className="relative block w-full px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent transition-colors"
                                        placeholder="Hostel Block"
                                        value={formData.hostelBlock}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <input
                                        name="roomNumber"
                                        type="text"
                                        className="relative block w-full px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 bg-white dark:bg-[#0D0F12] border border-gray-300 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent transition-colors"
                                        placeholder="Room Number"
                                        value={formData.roomNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
