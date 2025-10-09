import React, { useEffect, useState } from "react";
import SearchBar from "@/components/search/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "@/store/features/categorySlice.js";
import {
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
} from "@/store/features/searchSlice.js";
import { getAllProducts } from "@/store/features/productSlice.js";
import ProductImage from "@/components/utils/ProductImage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Products = () => {
    const dispatch = useDispatch();

    // Redux state
    const { categories } = useSelector((state) => state.category);
    const { searchQuery, selectedCategory } = useSelector((state) => state.search);
    const { products, loading, error } = useSelector((state) => state.product);

    // Local UI states
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Fetch categories + products
    useEffect(() => {
        dispatch(getAllCategories());
        dispatch(getAllProducts());
    }, [dispatch]);

    // Filter + Sort
    const filteredProducts = (products || [])
        .filter((product) => {
            if (!product) return false;
            const matchesQuery = product.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === "all" ||
                product.category?.name
                    ?.toLowerCase()
                    .includes(selectedCategory.toLowerCase());
            return matchesQuery && matchesCategory;
        })
        .sort((a, b) =>
            sortOrder === "asc"
                ? (a.price || 0) - (b.price || 0)
                : (b.price || 0) - (a.price || 0)
        );

    // Pagination logic (same as Home)
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handlers
    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSortOrder("asc");
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchQuery(e.target.value));
        setCurrentPage(1);
    };

    const handleCategoryChange = (value) => {
        dispatch(setSelectedCategory(value));
        setCurrentPage(1);
    };

    return (
        <section className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 px-6 py-10 relative">
            {/* Search Bar */}
            <div className="w-full max-w-4xl mx-auto mb-8 bg-white/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md">
                <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onClear={handleClearFilters}
                    categories={categories}
                />
            </div>

            <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-6">
                {/* Sidebar */}
                <aside className="lg:w-72 bg-white/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md lg:sticky lg:top-24 overflow-auto max-h-[80vh]">
                    <h4 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">
                        Category
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li
                            className={`cursor-pointer ${
                                selectedCategory === "all"
                                    ? "text-purple-600 dark:text-purple-400 font-semibold"
                                    : "hover:text-purple-600 dark:hover:text-purple-400"
                            }`}
                            onClick={() => handleCategoryChange("all")}
                        >
                            All
                        </li>
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className={`cursor-pointer ${
                                    selectedCategory === cat.name.toLowerCase()
                                        ? "text-purple-600 dark:text-purple-400 font-semibold"
                                        : "hover:text-purple-600 dark:hover:text-purple-400"
                                }`}
                                onClick={() =>
                                    handleCategoryChange(cat.name.toLowerCase())
                                }
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>

                    {/* Sort */}
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                            Sort by Price
                        </h4>
                        <div className="flex flex-col space-y-2">
                            <Button
                                variant={sortOrder === "asc" ? "default" : "outline"}
                                className="w-full text-sm"
                                onClick={() => setSortOrder("asc")}
                            >
                                Low → High
                            </Button>
                            <Button
                                variant={sortOrder === "desc" ? "default" : "outline"}
                                className="w-full text-sm"
                                onClick={() => setSortOrder("desc")}
                            >
                                High → Low
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button
                            onClick={handleClearFilters}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Clear All
                        </Button>
                    </div>
                </aside>

                {/* Products */}
                <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-10">
                    {loading ? (
                        <p className="col-span-full text-center text-gray-600 dark:text-gray-400 mt-20">
                            Loading products...
                        </p>
                    ) : error ? (
                        <p className="col-span-full text-center text-red-500 mt-20">
                            Failed to load products.
                        </p>
                    ) : currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <div
                                key={product.id || product.name}
                                className="bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition flex flex-col"
                            >
                                <Link to={`/products/${product.name}`}>
                                    <div className="w-full h-48 overflow-hidden">
                                        {product.images?.[0]?.id && (
                                            <ProductImage
                                                productId={product.images[0].id}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                    </div>
                                </Link>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold">{product.name}</h2>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-purple-600 dark:text-purple-400 font-bold">
                                            ₦{product.price?.toLocaleString("en-NG") || "0.00"}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {product.inventory} in stock
                                        </p>
                                        <Link
                                            to={`/products/${product.name}`}
                                            className="mt-4 w-full inline-block bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition text-center"
                                        >
                                            View Product
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-600 dark:text-gray-400 mt-20">
                            No products found.
                        </p>
                    )}
                </section>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex justify-center items-center space-x-2 mt-10">
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
        </section>
    );
};

export default Products;
