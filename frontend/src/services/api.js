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
            // Optionally redirect to login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    updatePassword: (data) => api.put('/users/password', data),
    addAddress: (data) => api.post('/users/addresses', data),
    updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
    deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
    setDefaultAddress: (id) => api.put(`/users/addresses/${id}/default`),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getOne: (id) => api.get(`/products/${id}`),
    getFeatured: (limit = 8) => api.get('/products/featured', { params: { limit } }),
    getRelated: (id) => api.get(`/products/${id}/related`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Brands API
export const brandsAPI = {
    getAll: () => api.get('/brands'),
    getOne: (id) => api.get(`/brands/${id}`),
    getBySlug: (slug) => api.get(`/brands/slug/${slug}`),
    create: (data) => api.post('/brands', data),
    update: (id, data) => api.put(`/brands/${id}`, data),
    delete: (id) => api.delete(`/brands/${id}`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getOne: (id) => api.get(`/categories/${id}`),
    getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart', data),
    update: (itemId, data) => api.put(`/cart/${itemId}`, data),
    remove: (itemId) => api.delete(`/cart/${itemId}`),
    clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getAll: (params) => api.get('/orders', { params }),
    getOne: (id) => api.get(`/orders/${id}`),
    cancel: (id) => api.put(`/orders/${id}/cancel`),
    getAllAdmin: (params) => api.get('/orders/admin/all', { params }),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUser: (id) => api.get(`/admin/users/${id}`),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getUserCart: (id) => api.get(`/admin/users/${id}/cart`),
    createAdmin: (data) => api.post('/admin/users/create-admin', data),
};

// Upload API
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

// Contact API
export const contactAPI = {
    submit: (data) => api.post('/contact', data),
};

export default api;
