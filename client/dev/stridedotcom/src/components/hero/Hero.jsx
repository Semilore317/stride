import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/hero/HeroSlider.jsx";
import SearchBar from "@/components/search/SearchBar.jsx";
import { getAllCategories } from "@/store/features/categorySlice.js";
import {
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
} from "@/store/features/searchSlice.js";

const Hero = () => {
    const dispatch = useDispatch();

    const { searchQuery } = useSelector((state) => state.search);
    const { categories, isLoading } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    return (
        <section className="relative w-full h-screen bg-black text-white overflow-hidden">
            {/* Slider */}
            <div className="absolute inset-0 z-10">
                <HeroSlider />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none dark:bg-black/30 bg-black/30 transition-colors duration-500" />

            {/* Content */}
            <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center max-w-4xl mx-auto space-y-10">
                <div className="space-y-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                        Welcome To <span className="text-purple-500">𝕾𝖙𝖗𝖎𝖉𝖊</span>
                    </h1>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="#">
                            <Button size="lg" className="text-lg cursor-pointer">
                                SHOP NOW
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg font-bold cursor-pointer border-white text-purple-600 dark:text-purple-400
               hover:bg-purple-900 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white
               transition-colors duration-300"
                        >
                            Today's Deal
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="w-full bg-white/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md transition-colors duration-300">
                    <SearchBar
                        value={searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        onCategoryChange={(category) => dispatch(setSelectedCategory(category))}
                        onClear={() => dispatch(clearFilters())}
                        categories={categories}
                        isLoading={isLoading} // optional: can show loading in SearchBar
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
