import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`rounded-full border-2 border-dark-300 border-t-gold ${sizes[size]} ${className}`}
        />
    );
};

export const PageLoader = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px] w-full">
            <LoadingSpinner size="lg" />
        </div>
    );
};
