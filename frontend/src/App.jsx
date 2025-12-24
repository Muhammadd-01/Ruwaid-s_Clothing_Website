import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Layout
import Layout from './components/layout/Layout';

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

// Components
import ProtectedRoute from './components/ProtectedRoute';
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
                </Routes>
            </AnimatePresence>
        </>
    );
}

export default App;
