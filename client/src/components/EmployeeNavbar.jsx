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
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-primary">WashEase Employee</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden text-gray-700 sm:inline">Hello, {employee?.name}</span>
                        <Link
                            to="/employee/dashboard"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
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

