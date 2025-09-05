import React, { useState } from 'react';

const dummyProducts = Array.from({ length: 53 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: `$${(Math.random() * 100).toFixed(2)}`,
    image: `https://source.unsplash.com/300x300?product&sig=${i}`,
}));

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = dummyProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(dummyProducts.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 text-white bg-black min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">New Arrivals</h1>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                {currentProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                            <p className="text-purple-400 font-bold">{product.price}</p>
                            <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition">
                                View Product
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm rounded bg-black/60 text-white border border-white/10 hover:bg-purple-600 transition disabled:opacity-40"
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
                                : 'bg-black/60 text-white border border-white/10 hover:bg-purple-600'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm rounded bg-black/60 text-white border border-white/10 hover:bg-purple-600 transition disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Home;
