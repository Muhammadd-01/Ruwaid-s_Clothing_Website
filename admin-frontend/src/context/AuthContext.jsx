import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.role === 'admin' || parsedUser.role === 'superadmin') {
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                    verifyToken();
                } else {
                    logout();
                }
            } catch (error) {
                logout();
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const verifyToken = async () => {
        try {
            const response = await authAPI.getMe();
            if (response.data.success) {
                const userData = response.data.data.user;
                if (userData.role === 'admin' || userData.role === 'superadmin') {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    logout();
                    toast.error('Access denied: You are not an admin');
                }
            }
        } catch (error) {
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            if (response.data.success) {
                const { user, token } = response.data.data;
                if (user.role !== 'admin' && user.role !== 'superadmin') {
                    toast.error('Access denied: Admin privileges required');
                    return { success: false, message: 'Access denied' };
                }
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                setIsAuthenticated(true);
                toast.success('Welcome back, Admin!');
                return { success: true, user };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
        isSuperAdmin: user?.role === 'superadmin',
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
