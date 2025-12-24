import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        setLoading(false);

        if (result.success) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                        <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
                            <span className="text-black font-display font-bold text-2xl">R</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">
                        Login to access your account and continue shopping
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6 space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className="input-field pl-12 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-400">
                                <input type="checkbox" className="mr-2 rounded border-dark-300" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="text-gold hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full text-lg py-4"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                Logging in...
                            </span>
                        ) : (
                            <>
                                Login
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-center text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-gold hover:underline font-medium">
                        Create Account
                    </Link>
                </p>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-dark-100 border border-dark-300 rounded-xl">
                    <p className="text-gray-400 text-sm text-center mb-2">Demo Credentials</p>
                    <p className="text-gray-500 text-xs text-center">
                        Admin: superadmin@ruwaids.com / SuperAdmin@123
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
