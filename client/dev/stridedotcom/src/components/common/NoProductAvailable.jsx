const NoProductAvailable = () => (
    <div className="flex flex-col justify-center items-center h-[60vh] text-center">
        <img src="/no-products.svg" alt="No products" className="w-40 mb-4 opacity-80" />
        <h2 className="text-lg font-semibold text-gray-700">No products available</h2>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search again.</p>
    </div>
);

export default NoProductAvailable;
