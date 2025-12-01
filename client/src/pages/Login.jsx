import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
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
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-slate-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/80 shadow-xl rounded-2xl backdrop-blur fade-in-up card-hover">
                <div className="text-center">
                    <p className="text-sm font-medium tracking-wide text-primary uppercase">Welcome back</p>
                    <h2 className="mt-3 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your credentials to access your dashboard.
                    </p>
                </div>
                {error && (
                    <div className="relative px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
                        {error}
                    </div>
                )}
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="email"
                                required
                                className="relative block w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="relative block w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
