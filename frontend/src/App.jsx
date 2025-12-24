import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Layout
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Profile from './pages/user/Profile';
import Orders from './pages/user/Orders';
import OrderDetails from './pages/user/OrderDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminBrands from './pages/admin/Brands';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return (
        <>
            <ScrollToTop />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="shop" element={<Shop />} />
                        <Route path="product/:id" element={<ProductDetails />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="cart" element={<Cart />} />

                        {/* Auth Routes */}
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />

                        {/* Protected User Routes */}
                        <Route path="profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="orders" element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        } />
                        <Route path="orders/:id" element={
                            <ProtectedRoute>
                                <OrderDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="checkout" element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        } />
                        <Route path="order-confirmation/:id" element={
                            <ProtectedRoute>
                                <OrderConfirmation />
                            </ProtectedRoute>
                        } />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="brands" element={<AdminBrands />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />
                    </Route>
                </Routes>
            </AnimatePresence>
        </>
    );
}

export default App;
