import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const isAdmin = user && (user.role === 'admin' || user.role === 'washer');

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Real-Time Tracking',
            description: 'Track your laundry status from pending to delivered in real-time'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Easy Scheduling',
            description: 'Schedule pickups and deliveries with just a few clicks'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: 'Secure & Safe',
            description: 'Your data is protected with modern security practices'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Analytics Dashboard',
            description: 'View statistics and insights for admins and washers'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Role-Based Access',
            description: 'Different access levels for students, washers, and admins'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Fast & Efficient',
            description: 'Lightning-fast interface for quick laundry management'
        }
    ];

    const quickLinks = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            title: 'Dashboard',
            description: 'Manage your laundry requests',
            path: '/dashboard',
            color: 'bg-blue-500',
            requiresAuth: true,
            adminOnly: false
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Admin Panel',
            description: 'Manage all laundry requests',
            path: '/admin',
            color: 'bg-purple-500',
            requiresAuth: true,
            adminOnly: true
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            title: 'Profile',
            description: 'View your profile information',
            path: '/profile',
            color: 'bg-green-500',
            requiresAuth: true,
            adminOnly: false
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            ),
            title: 'Login',
            description: 'Sign in to your account',
            path: '/login',
            color: 'bg-indigo-500',
            requiresAuth: false,
            adminOnly: false
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Employee Login',
            description: 'Employee dashboard access',
            path: '/employee/login',
            color: 'bg-orange-500',
            requiresAuth: false,
            adminOnly: false
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            title: 'Sign Up',
            description: 'Create a new account',
            path: '/signup',
            color: 'bg-pink-500',
            requiresAuth: false,
            adminOnly: false
        }
    ];

    const stats = [
        { number: '100%', label: 'Digital', icon: '📱' },
        { number: '24/7', label: 'Available', icon: '🕐' },
        { number: 'Fast', label: 'Processing', icon: '⚡' },
        { number: 'Secure', label: 'Protected', icon: '🔒' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10"></div>
                <div className="relative max-w-7xl px-4 py-20 mx-auto sm:px-6 lg:px-8 fade-in">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-semibold text-primary bg-primary/10 rounded-full">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Trusted by Hostels & Residences
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
                            <span className="block">Laundry Management</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                                Made Simple
                            </span>
                        </h1>
                        <p className="max-w-3xl mx-auto mt-6 text-xl text-gray-600">
                            WashEase digitizes the laundry process for hostels and residences. Track your clothes, schedule pickups, and get notified instantly.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
                            {!user ? (
                                <>
                                    <Link
                                        to="/signup"
                                        className="flex items-center px-8 py-4 text-lg font-semibold text-white transition-all transform bg-primary rounded-xl hover:bg-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Get Started Free
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="flex items-center px-8 py-4 text-lg font-semibold text-gray-700 transition-all transform bg-white rounded-xl hover:bg-gray-50 hover:scale-105 shadow-lg hover:shadow-xl border-2 border-gray-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Sign In
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to={isAdmin ? "/admin" : "/dashboard"}
                                    className="flex items-center px-8 py-4 text-lg font-semibold text-white transition-all transform bg-primary rounded-xl hover:bg-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Go to {isAdmin ? 'Admin Panel' : 'Dashboard'}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Access Section */}
            <div className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="mb-12 text-center fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Access</h2>
                        <p className="text-lg text-gray-600">Navigate to all features and pages</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {quickLinks
                            .filter(link => {
                                if (link.requiresAuth && !user) return false;
                                if (link.adminOnly && !isAdmin) return false;
                                return true;
                            })
                            .map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className="group relative p-6 bg-white rounded-2xl shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl card-hover fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl ${link.color} text-white`}>
                                        {link.icon}
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {link.title}
                                    </h3>
                                    <p className="text-gray-600">{link.description}</p>
                                    <div className="mt-4 flex items-center text-primary font-semibold">
                                        <span>Explore</span>
                                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="mb-12 text-center fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose WashEase?</h2>
                        <p className="text-lg text-gray-600">Everything you need for efficient laundry management</p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all card-hover fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-primary/10 text-primary">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!user && (
                <div className="py-20 bg-gradient-to-r from-primary to-purple-600">
                    <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
                        <p className="text-xl text-indigo-100 mb-8">
                            Join thousands of students and residents who trust WashEase for their laundry needs
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                to="/signup"
                                className="flex items-center px-8 py-4 text-lg font-semibold text-primary bg-white rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Create Free Account
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-xl hover:bg-white/10 transition-all transform hover:scale-105"
                            >
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
