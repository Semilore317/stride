import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadCart, removeItem, updateQuantity, clearCart } from "@/store/features/cartSlice";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import ProductImage from "@/components/utils/ProductImage";
import LoadSpinner from "../common/LoadSpinner";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleRemoveItem = (productId) => {
    dispatch(removeItem({ productId }));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Number(price));
  };

  const handlePlaceOrder = () => {
    alert("Place Order functionality coming soon!");
  };

  // if(isLoading){
  //   return <LoadSpinner />;
  // }

  return (
    <section className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 px-6 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiShoppingBag className="text-purple-600 dark:text-purple-400" />
            Your Cart
          </h1>
          {cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition flex items-center gap-2"
            >
              <FiTrash2 />
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty Cart State */}
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FiShoppingBag className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Looks like you haven't added any items yet.
            </p>
            <Link
              to="/products"
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg p-4 shadow-md hover:shadow-lg transition flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {item.product?.images?.[0]?.id ? (
                      <ProductImage
                        productId={item.product.images[0].id}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.product?.name || "Unknown Product"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.product?.brand || "Unknown Brand"}
                      </p>
                      <p className="text-purple-600 dark:text-purple-400 font-medium mt-1">
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="flex items-center gap-4 sm:min-w-[120px] sm:justify-end">
                      <span className="font-bold text-lg">
                        {formatPrice(item.totalPrice)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition p-2"
                        title="Remove item"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80">
              <div className="bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 shadow-md sticky top-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Items ({cart.totalAmount})</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400">
                      Free
                    </span>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-purple-600 dark:text-purple-400">
                      {formatPrice(cart.totalPrice)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition font-medium mb-3">
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-3 rounded-lg transition font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
