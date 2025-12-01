import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user && (user.role === 'admin' || user.role === 'washer');

    return (
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="text-2xl font-bold text-primary hover:text-indigo-700 transition-colors"
                        >
                            WashEase
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="hidden text-gray-700 sm:inline">Hello, {user.name}</span>
                                {isAdmin ? (
                                    <Link
                                        to="/admin"
                                        className="text-gray-600 hover:text-primary transition-colors"
                                    >
                                        Admin
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-600 hover:text-primary transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="text-gray-600 hover:text-primary transition-colors"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 text-white transition-colors rounded-md bg-primary hover:bg-indigo-700"
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
