import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();

    // Don't show navbar on employee pages
    if (location.pathname.startsWith('/employee')) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user && (user.role === 'admin' || user.role === 'washer');

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0D0F12]/90 border-b border-gray-200 dark:border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                <span className="text-white font-bold text-lg">W</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">WashEase</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-400"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {user ? (
                            <>
                                <span className="hidden text-gray-600 dark:text-gray-300 sm:inline font-medium">Hello, {user.name}</span>
                                {isAdmin ? (
                                    <Link
                                        to="/admin"
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                                    >
                                        Admin
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-white text-sm font-medium transition-all bg-red-500 rounded-lg hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full hover:shadow-glow-blue hover:scale-105 transition-all duration-300 border border-transparent dark:border-white/10"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
