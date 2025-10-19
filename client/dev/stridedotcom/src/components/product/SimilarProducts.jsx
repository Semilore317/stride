import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import ProductImage from "../utils/ProductImage";

const SimilarProducts = ({ currentProduct }) => {
  const [sameBrandAndCategory, setSameBrandAndCategory] = useState([]);
  const [sameCategory, setSameCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPageBrand, setCurrentPageBrand] = useState(1);
  const [currentPageCategory, setCurrentPageCategory] = useState(1);
  const itemsPerPage = 4;

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Number(price));
  };

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!currentProduct) {
        console.log("No current product");
        return;
      }

      console.log("Current Product:", currentProduct);
      console.log("Category:", currentProduct.category);

      if (!currentProduct.category?.name) {
        console.log("No category name found");
        return;
      }

      setIsLoading(true);
      try {
        const categoryName = currentProduct.category.name;
        console.log("Fetching products for category:", categoryName);

        const categoryRes = await api.get(
          `/products/product/${encodeURIComponent(categoryName)}/all/products`
        );

        console.log("API Response:", categoryRes.data);

        const categoryProducts = categoryRes.data.data.filter(
          (p) => p.id !== currentProduct.id
        );

        console.log("Filtered products (excluding current):", categoryProducts);

        // Split into same brand+category vs just same category
        const sameBrandCat = categoryProducts.filter(
          (p) => p.brand === currentProduct.brand
        );
        const diffBrandSameCat = categoryProducts.filter(
          (p) => p.brand !== currentProduct.brand
        );

        console.log("Same brand+category:", sameBrandCat);
        console.log("Different brand, same category:", diffBrandSameCat);

        setSameBrandAndCategory(sameBrandCat);
        setSameCategory(diffBrandSameCat);
      } catch (error) {
        console.error("Failed to fetch similar products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProduct]);

  const ProductCard = ({ product }) => (
    <Link
      to={`/products/${encodeURIComponent(product.name)}`}
      className="group bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full"
    >
      <div className="w-full h-48 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <ProductImage
            productId={product.images[0].id}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {product.brand}
          </p>
        </div>
        <p className="text-purple-600 dark:text-purple-400 font-bold">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );

  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm rounded bg-white border border-black/10 hover:bg-purple-100 dark:bg-black/60 dark:text-white dark:border-white/10 dark:hover:bg-purple-600 transition disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm rounded bg-white border border-black/10 hover:bg-purple-100 dark:bg-black/60 dark:text-white dark:border-white/10 dark:hover:bg-purple-600 transition disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-center text-gray-500">Loading similar products...</p>
      </div>
    );
  }

  if (sameBrandAndCategory.length === 0 && sameCategory.length === 0) {
    return null;
  }

  // Pagination for same brand+category
  const indexOfLastBrand = currentPageBrand * itemsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - itemsPerPage;
  const currentBrandProducts = sameBrandAndCategory.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPagesBrand = Math.ceil(sameBrandAndCategory.length / itemsPerPage);

  // Pagination for same category
  const indexOfLastCategory = currentPageCategory * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategoryProducts = sameCategory.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPagesCategory = Math.ceil(sameCategory.length / itemsPerPage);

  return (
    <div className="mt-12 space-y-10">
      {/* Same Brand AND Category */}
      {sameBrandAndCategory.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            More {currentProduct.brand} {currentProduct.category?.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentBrandProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <PaginationControls
            currentPage={currentPageBrand}
            totalPages={totalPagesBrand}
            onPageChange={setCurrentPageBrand}
          />
        </div>
      )}

      {/* Same Category (Different Brand) */}
      {sameCategory.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            More {currentProduct.category?.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentCategoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <PaginationControls
            currentPage={currentPageCategory}
            totalPages={totalPagesCategory}
            onPageChange={setCurrentPageCategory}
          />
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;