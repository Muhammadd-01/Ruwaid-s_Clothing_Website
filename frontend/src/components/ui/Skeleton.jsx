const ProductCardSkeleton = () => (
    <div className="bg-dark-100 border border-dark-300 rounded-xl overflow-hidden animate-pulse">
        <div className="aspect-product bg-dark-200" />
        <div className="p-4 space-y-3">
            <div className="h-3 bg-dark-200 rounded w-16" />
            <div className="h-4 bg-dark-200 rounded w-full" />
            <div className="h-4 bg-dark-200 rounded w-3/4" />
            <div className="h-5 bg-dark-200 rounded w-24" />
        </div>
    </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

export default ProductCardSkeleton;
