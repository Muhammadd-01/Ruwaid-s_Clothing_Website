import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUser: (id) => api.get(`/admin/users/${id}`),
    updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getUserCart: (id) => api.get(`/admin/users/${id}/cart`),
    createAdmin: (data) => api.post('/admin/users/create-admin', data),
    deleteOrder: (orderId) => api.delete(`/admin/orders/${orderId}`),
    updateProfile: (data) => api.put('/admin/profile', data),
};

export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getOne: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

export const brandsAPI = {
    getAll: () => api.get('/brands'),
    getOne: (id) => api.get(`/brands/${id}`),
    create: (data) => api.post('/brands', data),
    update: (id, data) => api.put(`/brands/${id}`, data),
    delete: (id) => api.delete(`/brands/${id}`),
};

export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getOne: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

export const ordersAPI = {
    getAllAdmin: (params) => api.get('/orders/admin/all', { params }),
    getOne: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const uploadAPI = {
    upload: (formData) => api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    uploadMultiple: (formData) => api.post('/upload/multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default api;
