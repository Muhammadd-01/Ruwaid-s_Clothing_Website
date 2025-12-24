import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [subtotal, setSubtotal] = useState(0);

    // Fetch cart when authenticated
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart({ items: [] });
            setSubtotal(0);
            return;
        }

        setIsLoading(true);
        try {
            const response = await cartAPI.get();
            if (response.data.success) {
                setCart(response.data.data.cart);
                setSubtotal(response.data.data.subtotal);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1, size, color) => {
        if (!isAuthenticated) {
            return { success: false, requiresAuth: true };
        }

        try {
            const response = await cartAPI.add({ productId, quantity, size, color });
            if (response.data.success) {
                setCart(response.data.data.cart);
                await fetchCart(); // Refresh to get updated subtotal
                toast.success('Added to cart!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add to cart';
            toast.error(message);
            return { success: false, message };
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await cartAPI.update(itemId, { quantity });
            if (response.data.success) {
                setCart(response.data.data.cart);
                await fetchCart(); // Refresh to get updated subtotal
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update quantity';
            toast.error(message);
            return { success: false, message };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const response = await cartAPI.remove(itemId);
            if (response.data.success) {
                setCart(response.data.data.cart);
                await fetchCart(); // Refresh to get updated subtotal
                toast.success('Item removed from cart');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove item';
            toast.error(message);
            return { success: false, message };
        }
    };

    const clearCart = async () => {
        try {
            const response = await cartAPI.clear();
            if (response.data.success) {
                setCart({ items: [] });
                setSubtotal(0);
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to clear cart';
            toast.error(message);
            return { success: false, message };
        }
    };

    const getCartItemCount = () => {
        return cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    };

    const value = {
        cart,
        subtotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartItemCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
