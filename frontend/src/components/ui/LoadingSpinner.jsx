const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <div className={`${sizeClasses[size]} ${className}`}>
            <div className="w-full h-full border-2 border-dark-300 border-t-gold rounded-full animate-spin" />
        </div>
    );
};

export const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
    </div>
);

export const ButtonLoader = () => (
    <LoadingSpinner size="sm" />
);

export default LoadingSpinner;
