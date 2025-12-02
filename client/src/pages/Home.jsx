import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';

const Home = () => {
    const { user } = useAuth();
    const isAdmin = user && (user.role === 'admin' || user.role === 'washer');

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
            color: 'from-blue-600 to-blue-400',
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
            color: 'from-purple-600 to-purple-400',
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
            color: 'from-green-600 to-green-400',
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
            color: 'from-indigo-600 to-indigo-400',
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
            color: 'from-orange-600 to-orange-400',
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
            color: 'from-pink-600 to-pink-400',
            requiresAuth: false,
            adminOnly: false
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0F17] transition-colors duration-300">
            {/* Hero Section */}
            <Hero onGetStarted={() => { }} />

            {/* Quick Access Section */}
            <div className="py-16 bg-gray-50 dark:bg-[#10141C] transition-colors duration-300">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Quick Access</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Navigate to all features and pages</p>
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
                                    className="relative p-6 transition-all transform bg-white dark:bg-[#1A1F2E] border border-gray-200 dark:border-white/5 shadow-lg group rounded-2xl hover:scale-105 hover:shadow-2xl dark:hover:shadow-glow-blue dark:hover:border-blue-500/30"
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${link.color} text-white shadow-lg`}>
                                        {link.icon}
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {link.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{link.description}</p>
                                    <div className="flex items-center mt-4 font-semibold text-blue-600 dark:text-blue-400">
                                        <span>Explore</span>
                                        <svg className="w-5 h-5 ml-2 transition-transform transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <Features />

            {/* How It Works Section */}
            <HowItWorks />

            {/* CTA Section */}
            {!user && (
                <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8 relative z-10">
                        <h2 className="mb-4 text-4xl font-bold text-white">Ready to Get Started?</h2>
                        <p className="mb-8 text-xl text-blue-100">
                            Join thousands of students and residents who trust WashEase for their laundry needs
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                to="/signup"
                                className="flex items-center px-8 py-4 text-lg font-semibold transition-all transform bg-white shadow-lg text-blue-600 rounded-xl hover:bg-gray-50 hover:scale-105 hover:shadow-xl"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Create Free Account
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center px-8 py-4 text-lg font-semibold text-white transition-all transform bg-transparent border-2 border-white rounded-xl hover:bg-white/10 hover:scale-105"
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
