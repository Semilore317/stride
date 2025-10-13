import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
    setSelectedCategory,
    clearFilters,
    setSearchQuery,
} from "@/store/features/searchSlice";
import { useSearchParams } from "react-router-dom";

const Sidebar = ({ brands, priceRange, setPriceRange, sortOrder, setSortOrder }) => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const { selectedCategory } = useSelector((state) => state.search);
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleCategoryChange = (value) => {
        dispatch(setSelectedCategory(value));
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") params.set("category", value);
        else params.delete("category");
        setSearchParams(params);
    };

    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
        const params = new URLSearchParams(searchParams);
        if (brand && brand !== "all") params.set("brand", brand);
        else params.delete("brand");
        setSearchParams(params);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value === "" ? "" : Math.max(0, Number(value));
        const updatedRange = { ...priceRange, [name]: numericValue };
        setPriceRange(updatedRange);

        const params = new URLSearchParams(searchParams);
        if (updatedRange.min) params.set("min", updatedRange.min);
        else params.delete("min");
        if (updatedRange.max) params.set("max", updatedRange.max);
        else params.delete("max");
        setSearchParams(params);
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSelectedBrand("all");
        setPriceRange({ min: "", max: "" });
        setSortOrder("asc");
        setSearchParams({});
    };

    useEffect(() => {
        // Apply filters from URL when page loads
        const category = searchParams.get("category") || "all";
        const brand = searchParams.get("brand") || "all";
        const min = searchParams.get("min") || "";
        const max = searchParams.get("max") || "";
        const order = searchParams.get("sort") || "asc";

        dispatch(setSelectedCategory(category));
        setSelectedBrand(brand);
        setPriceRange({ min, max });
        setSortOrder(order);
    }, [dispatch, searchParams]);

    return (
        <aside className="lg:w-72 bg-white/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md lg:sticky lg:top-24 overflow-auto max-h-[80vh]">
            {/* Category */}
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
                        onClick={() => handleCategoryChange(cat.name.toLowerCase())}
                    >
                        {cat.name}
                    </li>
                ))}
            </ul>

            {/* Brand */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                    Brand
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li
                        className={`cursor-pointer ${
                            selectedBrand === "all"
                                ? "text-purple-600 dark:text-purple-400 font-semibold"
                                : "hover:text-purple-600 dark:hover:text-purple-400"
                        }`}
                        onClick={() => handleBrandChange("all")}
                    >
                        All
                    </li>
                    {brands.map((brand) => (
                        <li
                            key={brand}
                            className={`cursor-pointer ${
                                selectedBrand === brand
                                    ? "text-purple-600 dark:text-purple-400 font-semibold"
                                    : "hover:text-purple-600 dark:hover:text-purple-400"
                            }`}
                            onClick={() => handleBrandChange(brand)}
                        >
                            {brand.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                    Price Range
                </h4>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        name="min"
                        value={priceRange.min}
                        onChange={handlePriceChange}
                        min="0"
                        className="w-1/2 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-gray-200"
                        placeholder="Min"
                    />
                    <span className="text-gray-600 dark:text-gray-400">-</span>
                    <input
                        type="number"
                        name="max"
                        value={priceRange.max}
                        onChange={handlePriceChange}
                        min="0"
                        className="w-1/2 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-gray-200"
                        placeholder="Max"
                    />
                </div>
            </div>

            {/* Sort */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                    Sort by Price
                </h4>
                <div className="flex flex-col space-y-2">
                    <Button
                        variant={sortOrder === "asc" ? "default" : "outline"}
                        className="w-full text-sm"
                        onClick={() => {
                            setSortOrder("asc");
                            const params = new URLSearchParams(searchParams);
                            params.set("sort", "asc");
                            setSearchParams(params);
                        }}
                    >
                        Low → High
                    </Button>
                    <Button
                        variant={sortOrder === "desc" ? "default" : "outline"}
                        className="w-full text-sm"
                        onClick={() => {
                            setSortOrder("desc");
                            const params = new URLSearchParams(searchParams);
                            params.set("sort", "desc");
                            setSearchParams(params);
                        }}
                    >
                        High → Low
                    </Button>
                </div>
            </div>

            {/* Clear */}
            <div className="mt-8">
                <Button
                    onClick={handleClearFilters}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                    Clear All
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
