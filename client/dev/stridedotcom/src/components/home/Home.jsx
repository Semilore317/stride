import React, { useEffect, useState } from 'react';
import Hero from '../hero/Hero';
import ProductImage from '../utils/ProductImage';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { getDistinctProductsByName } from '../services/ProductService';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Safer Redux selector with defaults
    const searchState = useSelector((state) => state.search || {});
    const searchQuery = (searchState.searchQuery || '').toString(); // Ensure it's a string
    const selectedCategory = (searchState.selectedCategory || 'all').toString();

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await getDistinctProductsByName();  // Still { message: "success", data: [...] }
                //console.log('Raw response:', response);  // Keep for debugging
                const productsData = response.data || [];  // Extract the array; fallback to empty if missing
                //console.log('Extracted products array:', productsData);
                //console.log('Is Array?', Array.isArray(productsData));
                if (!Array.isArray(productsData)) {
                    throw new Error("Fetched products is not an array");
                }
                setProducts(productsData);
                setErrorMessage(null);
            } catch (error) {
                console.error('Full API Error:', error);
                const message = error?.message || "Unknown error occurred";
                setErrorMessage(message);
                toast.error(`Error fetching products: ${message}`);
            }
        };
        getProducts();
    }, []);

    useEffect(() => {
        const results = products.filter((product) => {
            if (!product || !product.name) return false; // Guard against invalid products
            const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' ||
                (product.category && typeof product.category === 'object' && product.category.name &&
                 product.category.name.toLowerCase().includes(selectedCategory.toLowerCase()));
            return matchesQuery && matchesCategory;
        });
        setFilteredProducts(results);
    }, [searchQuery, selectedCategory, products]);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Hero />
            <ToastContainer />
            <div className="p-6 min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
                <h1 className="text-3xl font-bold mb-6 text-center">Stride.com</h1>

                {errorMessage && (
                    <div className="mb-6 text-center">
                        <p className="text-red-600 dark:text-red-400 font-medium text-sm bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 px-4 py-2 rounded-md inline-block">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                    {currentProducts.map((product) => (
                        <div
                            key={product.id || product.name} // Fallback key if id missing
                            className="bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition relative group"
                        >
                            <Link to={`products/${product.name}`}>
                                <div className="w-full h-48 overflow-hidden">
                                    {product.images && product.images.length > 0 && (
                                        <ProductImage
                                            productId={product.images[0].id}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                </div>
                            </Link>

                            <div className="p-4">
                                <h2 className="text-lg font-semibold">{product.name}</h2>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
                                <p className="text-purple-600 dark:text-purple-400 font-bold">{product.price}</p>
                                <p className="text-gray-700 dark:text-gray-300">{product.inventory} in stock</p>
                                <Link
                                    to={`products/${product.name}`}
                                    className="mt-4 w-full inline-block bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition text-center"
                                >
                                    View Product
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 0 && (
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
                                        ? 'bg-purple-600 text-white font-bold'
                                        : 'bg-white border border-black/10 hover:bg-purple-100 dark:bg-black/60 dark:text-white dark:border-white/10 dark:hover:bg-purple-600'
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