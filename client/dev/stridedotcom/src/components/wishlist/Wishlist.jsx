import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadWishlist, removeFromWishlist } from "@/store/features/wishlistSlice";
import { addItem } from "@/store/features/cartSlice";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import ProductImage from "@/components/utils/ProductImage";
import { toast } from "react-toastify";

const Wishlist = () => {
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(loadWishlist());
    }, [dispatch]);

    const handleRemoveFromWishlist = (productId, productName) => {
        dispatch(removeFromWishlist(productId));
        toast.info(`${productName} removed from wishlist`);
    };

    const handleAddToCart = (product) => {
        dispatch(addItem({
            product: {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                images: product.images
            },
            quantity: 1
        }));
        toast.success(`${product.name} added to cart!`);
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) return "₦0.00";
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
        }).format(Number(price));
    };

    return (
        <section className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 px-6 py-10">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FiHeart className="text-purple-600 dark:text-purple-400" />
                        Your Wishlist
                    </h1>
                    <span className="text-gray-600 dark:text-gray-400">
                        {wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {/* Empty Wishlist State */}
                {wishlist.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FiHeart className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">
                            Start adding items you love!
                        </p>
                        <Link
                            to="/products"
                            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition font-medium"
                        >
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.items.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group"
                            >
                                {/* Product Image */}
                                <Link to={`/products/${encodeURIComponent(product.name)}`}>
                                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        {product.images?.[0]?.id ? (
                                            <ProductImage
                                                productId={product.images[0].id}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Product Details */}
                                <div className="p-4">
                                    <Link to={`/products/${encodeURIComponent(product.name)}`}>
                                        <h3 className="font-semibold text-lg truncate hover:text-purple-600 dark:hover:text-purple-400 transition">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {product.brand}
                                    </p>
                                    <p className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-4">
                                        {formatPrice(product.price)}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
                                        >
                                            <FiShoppingCart size={16} />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                            title="Remove from wishlist"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Continue Shopping Link */}
                {wishlist.items.length > 0 && (
                    <div className="mt-8 text-center">
                        <Link
                            to="/products"
                            className="inline-block border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-3 px-6 rounded-lg transition font-medium"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Wishlist;
