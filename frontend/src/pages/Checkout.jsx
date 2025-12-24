import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin, Plus, Check, Truck, CreditCard,
    Wallet, ArrowLeft, ArrowRight, Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI, userAPI } from '../services/api';
import { formatPrice } from '../lib/utils';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const { cart, subtotal, fetchCart } = useCart();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [deliveryOption, setDeliveryOption] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({
        label: 'Home',
        street: '',
        city: '',
        postalCode: '',
        isDefault: false,
    });

    useEffect(() => {
        // Set default address
        if (user?.addresses?.length > 0) {
            const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [user]);

    // Redirect if cart is empty
    useEffect(() => {
        if (!cart.items || cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const deliveryFee = deliveryOption === 'express' ? 250 : (subtotal >= 5000 ? 0 : 250);
    const total = subtotal + deliveryFee;

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await userAPI.addAddress(addressForm);
            if (response.data.success) {
                await refreshUser();
                toast.success('Address added successfully');
                setShowAddressForm(false);
                setAddressForm({ label: 'Home', street: '', city: '', postalCode: '', isDefault: false });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add address');
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                shippingAddress: {
                    label: selectedAddress.label,
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    postalCode: selectedAddress.postalCode,
                },
                deliveryOption,
                paymentMethod,
            };

            const response = await ordersAPI.create(orderData);

            if (response.data.success) {
                await fetchCart(); // Refresh cart (should be empty now)
                navigate(`/order-confirmation/${response.data.data.order._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Address', icon: MapPin },
        { number: 2, title: 'Delivery', icon: Truck },
        { number: 3, title: 'Payment', icon: CreditCard },
        { number: 4, title: 'Review', icon: Package },
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-display font-bold text-white mb-8">Checkout</h1>

                {/* Steps */}
                <div className="flex items-center justify-between mb-12">
                    {steps.map((s, index) => (
                        <div key={s.number} className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                          transition-colors ${step >= s.number
                                        ? 'bg-gold border-gold text-black'
                                        : 'border-dark-300 text-gray-500'
                                    }`}
                            >
                                {step > s.number ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <s.icon className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`ml-2 hidden sm:block ${step >= s.number ? 'text-white' : 'text-gray-500'}`}>
                                {s.title}
                            </span>
                            {index < steps.length - 1 && (
                                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > s.number ? 'bg-gold' : 'bg-dark-300'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-dark-100 border border-dark-300 rounded-xl p-6"
                        >
                            {/* Step 1: Address */}
                            {step === 1 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-6">Select Delivery Address</h2>

                                    {user?.addresses?.length > 0 && (
                                        <div className="space-y-3 mb-6">
                                            {user.addresses.map((address) => (
                                                <button
                                                    key={address._id}
                                                    onClick={() => setSelectedAddress(address)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all
                                   ${selectedAddress?._id === address._id
                                                            ? 'border-gold bg-gold/5'
                                                            : 'border-dark-300 hover:border-gold/50'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="text-white font-medium">{address.label}</p>
                                                            <p className="text-gray-400 text-sm mt-1">{address.street}</p>
                                                            <p className="text-gray-400 text-sm">{address.city}, {address.postalCode}</p>
                                                        </div>
                                                        {selectedAddress?._id === address._id && (
                                                            <Check className="w-5 h-5 text-gold" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Address Form */}
                                    {showAddressForm ? (
                                        <form onSubmit={handleAddAddress} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Label (e.g., Home, Office)"
                                                    value={addressForm.label}
                                                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                                    className="input-field"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    className="input-field"
                                                    required
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Street Address"
                                                value={addressForm.street}
                                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Postal Code"
                                                value={addressForm.postalCode}
                                                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                            <div className="flex gap-3">
                                                <button type="submit" className="btn-primary">
                                                    Save Address
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddressForm(false)}
                                                    className="btn-dark"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="flex items-center gap-2 text-gold hover:underline"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add New Address
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Delivery */}
                            {step === 2 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-6">Select Delivery Option</h2>

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setDeliveryOption('standard')}
                                            className={`w-full text-left p-4 rounded-xl border transition-all
                               ${deliveryOption === 'standard'
                                                    ? 'border-gold bg-gold/5'
                                                    : 'border-dark-300 hover:border-gold/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">Standard Delivery</p>
                                                    <p className="text-gray-400 text-sm mt-1">5-7 business days</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gold font-medium">
                                                        {subtotal >= 5000 ? 'Free' : formatPrice(250)}
                                                    </p>
                                                    {deliveryOption === 'standard' && (
                                                        <Check className="w-5 h-5 text-gold ml-auto mt-1" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setDeliveryOption('express')}
                                            className={`w-full text-left p-4 rounded-xl border transition-all
                               ${deliveryOption === 'express'
                                                    ? 'border-gold bg-gold/5'
                                                    : 'border-dark-300 hover:border-gold/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">Express Delivery</p>
                                                    <p className="text-gray-400 text-sm mt-1">2-3 business days</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gold font-medium">{formatPrice(250)}</p>
                                                    {deliveryOption === 'express' && (
                                                        <Check className="w-5 h-5 text-gold ml-auto mt-1" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 3 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-6">Select Payment Method</h2>

                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`w-full text-left p-4 rounded-xl border transition-all
                               ${paymentMethod === 'cod'
                                                    ? 'border-gold bg-gold/5'
                                                    : 'border-dark-300 hover:border-gold/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Wallet className="w-6 h-6 text-gold" />
                                                    <div>
                                                        <p className="text-white font-medium">Cash on Delivery</p>
                                                        <p className="text-gray-400 text-sm mt-1">Pay when you receive your order</p>
                                                    </div>
                                                </div>
                                                {paymentMethod === 'cod' && (
                                                    <Check className="w-5 h-5 text-gold" />
                                                )}
                                            </div>
                                        </button>

                                        <div className="p-4 rounded-xl border border-dark-300 opacity-50">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="w-6 h-6 text-gray-500" />
                                                <div>
                                                    <p className="text-gray-400 font-medium">Card Payment</p>
                                                    <p className="text-gray-500 text-sm mt-1">Coming soon</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review */}
                            {step === 4 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-6">Review Your Order</h2>

                                    {/* Address */}
                                    <div className="mb-6 p-4 bg-dark-200 rounded-xl">
                                        <p className="text-gray-400 text-sm mb-2">Delivery Address</p>
                                        <p className="text-white font-medium">{selectedAddress?.label}</p>
                                        <p className="text-gray-400 text-sm">{selectedAddress?.street}</p>
                                        <p className="text-gray-400 text-sm">{selectedAddress?.city}, {selectedAddress?.postalCode}</p>
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-3 mb-6">
                                        {cart.items?.map((item) => (
                                            <div key={item._id} className="flex items-center gap-4 p-3 bg-dark-200 rounded-lg">
                                                <img
                                                    src={item.product?.images?.[0]}
                                                    alt={item.product?.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-grow">
                                                    <p className="text-white font-medium">{item.product?.name}</p>
                                                    <p className="text-gray-400 text-sm">Qty: {item.quantity} | Size: {item.size}</p>
                                                </div>
                                                <p className="text-gold font-medium">
                                                    {formatPrice(item.product?.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Details */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-dark-200 rounded-xl">
                                            <p className="text-gray-400 text-sm mb-1">Delivery</p>
                                            <p className="text-white font-medium capitalize">{deliveryOption}</p>
                                        </div>
                                        <div className="p-4 bg-dark-200 rounded-xl">
                                            <p className="text-gray-400 text-sm mb-1">Payment</p>
                                            <p className="text-white font-medium">
                                                {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-dark-300">
                                <button
                                    onClick={() => setStep(Math.max(1, step - 1))}
                                    className={`btn-dark ${step === 1 ? 'invisible' : ''}`}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back
                                </button>

                                {step < 4 ? (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        disabled={step === 1 && !selectedAddress}
                                        className="btn-primary"
                                    >
                                        Continue
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="btn-primary"
                                    >
                                        {loading ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-dark-100 border border-dark-300 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal ({cart.items?.length} items)</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Delivery</span>
                                    <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                                </div>
                            </div>

                            <div className="border-t border-dark-300 pt-4">
                                <div className="flex justify-between text-white font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-gold">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
