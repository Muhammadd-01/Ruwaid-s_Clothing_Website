import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Brands from './pages/Brands';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="products" element={<Products />} />
                        <Route path="brands" element={<Brands />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="users" element={<Users />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                <Toaster position="top-center" toastOptions={{
                    style: {
                        background: '#1A1A1A',
                        color: '#fff',
                        border: '1px solid #333',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }} />
            </AuthProvider>
        </Router>
    );
}

export default App;
