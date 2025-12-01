import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const parsed = JSON.parse(userInfo);
                    setUser(parsed);
                }
            } catch (error) {
                console.error('Error loading user info:', error);
                localStorage.removeItem('userInfo');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            let message = 'Login failed. Please check your credentials.';
            if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
                message = 'Cannot connect to server. Please make sure the backend server is running on port 5001.';
            } else if (error.response?.status === 503) {
                message = 'Database not connected. Please check server configuration.';
            } else {
                message = error.response?.data?.message || error.message || message;
            }
            return { success: false, message };
        }
    };

    const signup = async (userData) => {
        try {
            const { data } = await axios.post('/api/auth/signup', userData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            let message = 'Signup failed. Please try again.';
            if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
                message = 'Cannot connect to server. Please make sure the backend server is running on port 5001.';
            } else if (error.response?.status === 503) {
                message = 'Database not connected. Please check server configuration.';
            } else {
                message = error.response?.data?.message || error.message || message;
            }
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
