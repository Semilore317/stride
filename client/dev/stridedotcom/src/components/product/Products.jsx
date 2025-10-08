import React, { useEffect, useState } from "react";
import SearchBar from "@/components/search/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "@/store/features/CategorySlice";
import { setSearchQuery, setSelectedCategory, clearFilters } from "@/store/features/SearchSlice";
import { getDistinctProductsByName } from "@/components/services/ProductService";
import ProductImage from "@/components/utils/ProductImage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Filter, ArrowDownUp } from "lucide-react";

const Products = () => {
  const dispatch = useDispatch();
  const { searchQuery, selectedCategory } = useSelector((state) => state.search);
  const { categories } = useSelector((state) => state.category);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getDistinctProductsByName();
        const productsData = response.data || [];
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let results = products.filter((product) => {
      if (!product || !product.name) return false;
      const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        (product.category &&
          product.category.name &&
          product.category.name.toLowerCase().includes(selectedCategory.toLowerCase()));
      return matchesQuery && matchesCategory;
    });

    if (sortOrder === "asc") {
      results.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "desc") {
      results.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFilteredProducts(results);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, products, sortOrder]);

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSortOrder("asc");
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 flex px-6 py-10">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 mr-6 sticky top-20 max-h-[calc(100vh-80px)] overflow-y-auto bg-white/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">Filters</h4>

        {/* Category Filter */}
        <h4 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">Category</h4>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li
            className={`cursor-pointer ${selectedCategory === "all" ? "text-purple-600 dark:text-purple-400 font-semibold" : "hover:text-purple-600 dark:hover:text-purple-400"}`}
            onClick={() => dispatch(setSelectedCategory("all"))}
          >
            All
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`cursor-pointer ${selectedCategory === cat.name.toLowerCase() ? "text-purple-600 dark:text-purple-400 font-semibold" : "hover:text-purple-600 dark:hover:text-purple-400"}`}
              onClick={() => dispatch(setSelectedCategory(cat.name.toLowerCase()))}
            >
              {cat.name}
            </li>
          ))}
        </ul>

        {/* Sort Filter */}
        <h4 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">Sort by Price</h4>
        <div className="flex flex-col space-y-2 mb-6">
          <Button variant={sortOrder === "asc" ? "default" : "outline"} className="w-full text-sm" onClick={() => setSortOrder("asc")}>
            Low → High
          </Button>
          <Button variant={sortOrder === "desc" ? "default" : "outline"} className="w-full text-sm" onClick={() => setSortOrder("desc")}>
            High → Low
          </Button>
        </div>

        <Button onClick={handleClearFilters} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Clear All
        </Button>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Filters Button */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition"
            onClick={toggleFilters}
          >
            <Filter size={18} />
            Filters
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition"
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            <ArrowDownUp size={18} />
            Sort: {sortOrder === "asc" ? "Low → High" : "High → Low"}
          </Button>
        </div>

        {/* Mobile Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-end lg:hidden">
            <aside className="w-72 bg-white/10 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Filters</h4>
                <Button variant="ghost" className="text-gray-500 hover:text-white" onClick={toggleFilters}>
                  <X size={20} />
                </Button>
              </div>

              {/* Category Filter */}
              <h4 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">Category</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li
                  className={`cursor-pointer ${selectedCategory === "all" ? "text-purple-600 dark:text-purple-400 font-semibold" : "hover:text-purple-600 dark:hover:text-purple-400"}`}
                  onClick={() => dispatch(setSelectedCategory("all"))}
                >
                  All
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className={`cursor-pointer ${selectedCategory === cat.name.toLowerCase() ? "text-purple-600 dark:text-purple-400 font-semibold" : "hover:text-purple-600 dark:hover:text-purple-400"}`}
                    onClick={() => dispatch(setSelectedCategory(cat.name.toLowerCase()))}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>

              {/* Sort */}
              <h4 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">Sort by Price</h4>
              <div className="flex flex-col space-y-2 mb-6">
                <Button variant={sortOrder === "asc" ? "default" : "outline"} className="w-full text-sm" onClick={() => setSortOrder("asc")}>
                  Low → High
                </Button>
                <Button variant={sortOrder === "desc" ? "default" : "outline"} className="w-full text-sm" onClick={() => setSortOrder("desc")}>
                  High → Low
                </Button>
              </div>

              <Button onClick={handleClearFilters} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Clear All
              </Button>
            </aside>
          </div>
        )}

        {/* Search Bar */}
        <div className="w-full max-w-4xl mx-auto mb-8 bg-white/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md">
          <SearchBar
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onCategoryChange={(cat) => dispatch(setSelectedCategory(cat))}
            onClear={handleClearFilters}
            categories={categories}
          />
        </div>

        {/* Products Grid */}
        <section className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div
                  key={product.id || product.name}
                  className="bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <Link to={`/products/${product.name}`}>
                    <div className="w-full h-48 overflow-hidden">
                      {product.images && product.images.length > 0 && (
                        <ProductImage productId={product.images[0].id} className="w-full h-48 object-cover" />
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
                    <p className="text-purple-600 dark:text-purple-400 font-bold">
                      ₦{product.price?.toLocaleString("en-NG") || "0.00"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">{product.inventory} in stock</p>
                    <Link
                      to={`/products/${product.name}`}
                      className="mt-4 w-full inline-block bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition text-center"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-400 mt-20">No products found.</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
      </div>
    </section>
  );
};

export default Products;
