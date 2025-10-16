import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api"; // Axios instance
import ProductImage from "../utils/ProductImage";
import LoadSpinner from "../common/LoadSpinner";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; // filled heart
import SimilarProducts from "./SimilarProducts";

const ProductDetails = () => {
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Number(price));
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const encoded = encodeURIComponent(name);
        const res = await api.get(`/products/products/${encoded}/products`);
        if (!cancelled) setProduct(res.data.data[0] || null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || err.message || "Failed to load product"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [name]);

  const nextImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX.current;
    if (deltaX > 50) nextImage();
    else if (deltaX < -50) prevImage();
  };

  // --- Wishlist toggle handler ---
  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => !prev);
    // TODO: API call to add/remove from wishlist
  };

  // --- Quantity handlers ---
  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) return <LoadSpinner />;

  if (error)
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link to="/">
            <div className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded cursor-pointer">
              Back to Products
            </div>
          </Link>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Product not found.
          </p>
          <Link to="/">
            <div className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded cursor-pointer">
              Back to Products
            </div>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <Link
        to="/"
        className="inline-block mb-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
      >
        ← Back to Products
      </Link>

      {/* Centered content container */}
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center mx-auto max-w-5xl w-full">
        {/* Left: Swipeable Image Slider */}
        <div
          className="flex-1 relative overflow-hidden h-[400px] rounded-lg max-w-[400px]"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {product.images && product.images.length > 0 ? (
              product.images.map((img) => (
                <ProductImage
                  key={img.id}
                  productId={img.id}
                  className="w-full flex-shrink-0 object-cover rounded-lg"
                />
              ))
            ) : (
              <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No image</span>
              </div>
            )}
          </div>

          {/* Slider buttons */}
          {product.images && product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-black/60 p-2 rounded-full shadow hover:bg-white dark:hover:bg-black transition"
              >
                ◀
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-black/60 p-2 rounded-full shadow hover:bg-white dark:hover:bg-black transition"
              >
                ▶
              </button>
            </>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col gap-4 max-w-[450px]">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto pr-2">
            {product.description}
          </p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {formatPrice(product.price)}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {product.inventory} in stock
          </p>

          {/* Cart + Wishlist */}
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            {/* Quantity Updater */}
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
              <button
                onClick={decrementQty}
                className="px-3 py-1 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                −
              </button>
              <span className="px-4 text-lg font-medium">{quantity}</span>
              <button
                onClick={incrementQty}
                className="px-3 py-1 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded cursor-pointer transition">
              <FiShoppingCart size={20} />
              <span>{`Add ${quantity > 1 ? quantity : ""} to Cart`}</span>
            </div>

            {/* Wishlist Heart */}
            <div onClick={handleWishlistToggle} className="relative group cursor-pointer">
              {isWishlisted ? (
                <FaHeart
                  size={24}
                  className="text-purple-500 transition-transform duration-300 transform scale-110"
                />
              ) : (
                <FiHeart
                  size={24}
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-400 transition-colors duration-300"
                />
              )}
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products - Pass the product as currentProduct prop */}
      <div className="mx-auto max-w-7xl w-full">
        <SimilarProducts currentProduct={product} />
      </div>
    </div>
  );
};

export default ProductDetails;