import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchUserOrders } from "@/store/features/orderSlice";
import { FiPackage, FiCalendar, FiShoppingBag } from "react-icons/fi";
import LoadSpinner from "../common/LoadSpinner";

const Order = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const { orders, loading, errorMessage } = useSelector((state) => state.order);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserOrders(userId));
        }
    }, [dispatch, userId]);

    const formatPrice = (price) => {
        if (price === null || price === undefined) return "₦0.00";
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
        }).format(Number(price));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "processing":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "shipped":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            case "delivered":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    if (loading) {
        return <LoadSpinner />;
    }

    return (
        <section className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FiPackage className="text-purple-600 dark:text-purple-400" />
                        Your Orders
                    </h1>
                </div>

                {/* Error State */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                        {errorMessage}
                    </div>
                )}

                {/* Empty Orders State */}
                {orders.length === 0 && !errorMessage ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FiShoppingBag className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No orders yet
                        </h2>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">
                            Looks like you haven't placed any orders yet.
                        </p>
                        <Link
                            to="/products"
                            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition font-medium"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.orderId}
                                className="bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 shadow-md hover:shadow-lg transition"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <span className="font-semibold text-lg">
                                            Order #{order.orderId}
                                        </span>
                                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                            <FiCalendar />
                                            {formatDate(order.orderDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status || "Unknown"}
                                        </span>
                                        <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                                            {formatPrice(order.totalAmount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        Items ({order.orderItems?.length || 0})
                                    </h3>
                                    {order.orderItems && order.orderItems.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {order.orderItems.map((item, index) => (
                                                <div
                                                    key={item.productId || index}
                                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg"
                                                >
                                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FiPackage className="text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            Product #{item.productId}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <span>Qty: {item.quantity}</span>
                                                            <span>•</span>
                                                            <span className="text-purple-600 dark:text-purple-400">
                                                                {formatPrice(item.price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            No items found
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Order;