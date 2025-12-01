import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axios';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmployee = () => {
            try {
                const employeeInfo = localStorage.getItem('employeeInfo');
                if (employeeInfo) {
                    const parsed = JSON.parse(employeeInfo);
                    setEmployee(parsed);
                }
            } catch (error) {
                console.error('Error loading employee info:', error);
                localStorage.removeItem('employeeInfo');
            } finally {
                setLoading(false);
            }
        };
        loadEmployee();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/api/employee/login', { email, password });
            setEmployee(data);
            localStorage.setItem('employeeInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            let message = 'Login failed. Please check your credentials.';
            if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
                message = 'Cannot connect to server. Please make sure the backend is reachable.';
            } else if (error.response?.status === 503) {
                message = 'Database not connected. Please check server configuration.';
            } else {
                message = error.response?.data?.message || error.message || message;
            }
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('employeeInfo');
        setEmployee(null);
    };

    return (
        <EmployeeContext.Provider value={{ employee, login, logout, loading }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployee = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useEmployee must be used within an EmployeeProvider');
    }
    return context;
};

