import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
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

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
                // Verify token is still valid
                verifyToken();
            } catch (error) {
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    const verifyToken = async () => {
        try {
            const response = await authAPI.getMe();
            if (response.data.success) {
                setUser(response.data.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
        } catch (error) {
            logout();
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });

            if (response.data.success) {
                const { user, token } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                setIsAuthenticated(true);
                toast.success('Welcome back!');
                return { success: true, user };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const response = await authAPI.register({ name, email, password, phone });

            if (response.data.success) {
                const { user, token } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                setIsAuthenticated(true);
                toast.success('Account created successfully!');
                return { success: true, user };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out successfully');
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const refreshUser = async () => {
        try {
            const response = await userAPI.getProfile();
            if (response.data.success) {
                const updatedUser = response.data.data.user;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
    const isSuperAdmin = user?.role === 'superadmin';

    const value = {
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
