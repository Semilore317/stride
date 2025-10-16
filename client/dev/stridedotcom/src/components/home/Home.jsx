import React, { useEffect, useState } from "react";
import Hero from "../hero/Hero";
import ProductImage from "../utils/ProductImage";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import LoadSpinner from "../common/LoadSpinner";
import NoProductAvailable from "../common/NoProductAvailable";
//import {getDistinctProductsByName   } from "@/store/features/productSlice.js";
import {getDistinctProductsByName} from "@/store/features/productSlice.js"

const Home = () => {
  const dispatch = useDispatch();

    const { distinctProductsByName, isLoading, errorMessage } = useSelector(
        (state) => state.product
      );
      const distinctProducts = distinctProductsByName || [];
      

  const searchState = useSelector((state) => state.search || {});
  const searchQuery = (searchState.searchQuery || "").toString();
  const selectedCategory = (searchState.selectedCategory || "all").toString();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getDistinctProductsByName());
  }, [dispatch]);

  const formatPrice = (price) => {
    if (!price) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // filtering logic
  const filteredProducts = distinctProducts.filter((product) => {
    if (!product || !product.name) return false;
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (product.category &&
        typeof product.category === "object" &&
        product.category.name &&
        product.category.name.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesQuery && matchesCategory;
  });

  // pagination
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <LoadSpinner />;
  if (errorMessage) return <div className="text-red-500 p-4 text-center">{errorMessage}</div>;
  if (distinctProducts.length === 0) return <NoProductAvailable />;

  return (
    <>
      <Hero />
      <ToastContainer />
      <div className="p-6 min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                    {currentProducts.map((product) => (
                        <div
                            key={product.id || product.name}
                            className="bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full cursor-pointer"
                            onClick={() => window.location.href = `/products/${encodeURIComponent(product.name)}`}
                        >
                            <div className="w-full h-48 overflow-hidden">
                                {product.images?.length > 0 ? (
                                    <ProductImage
                                        productId={product.images[0].id}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <span className="text-gray-500 dark:text-gray-400">No Image</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">{product.name}</h2>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
                                </div>
                                <p className="text-purple-600 dark:text-purple-400 font-bold">
                                    {formatPrice(product.price)}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">{product.inventory} in stock</p>

                                <Link
                                    to={`/products/${encodeURIComponent(product.name)}`}
                                    className="mt-4 w-full inline-block bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition text-center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View Product
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm rounded bg-white border border-black/10 hover:bg-purple-100 dark:bg-black/60 dark:text-white dark:border-white/10 dark:hover:bg-purple-600 transition disabled:opacity-40"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => paginate(page)}
                                className={`px-4 py-2 text-sm rounded transition ${
                                    currentPage === page
                                        ? "bg-purple-600 text-white font-bold"
                                        : "bg-white border border-black/10 hover:bg-purple-100 dark:bg-black/60 dark:text-white dark:border-white/10 dark:hover:bg-purple-600"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm rounded bg-white border border-black/10 hover:bg-purple-100 dark:bg-black/60 dark:text-white dark:border-white/10 dark:hover:bg-purple-600 transition disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
    </>
  );
};

export default Home;