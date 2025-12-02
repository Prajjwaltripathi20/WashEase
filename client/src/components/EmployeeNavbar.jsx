import { Link, useNavigate } from 'react-router-dom';
import { useEmployee } from '../context/EmployeeContext';

const EmployeeNavbar = () => {
    const { employee, logout } = useEmployee();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/employee/login');
    };

    return (
        <nav className="sticky top-0 z-30 bg-white/80 dark:bg-[#1A1F2E]/80 backdrop-blur border-b border-gray-100 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600 dark:text-white">WashEase Employee</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden text-gray-700 dark:text-gray-300 sm:inline">Hello, {employee?.name}</span>
                        <Link
                            to="/"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/employee/dashboard"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default EmployeeNavbar;

