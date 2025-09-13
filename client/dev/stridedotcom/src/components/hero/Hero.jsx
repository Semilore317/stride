import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/hero/HeroSlider.jsx";
import SearchBar from "@/components/search/SearchBar.jsx";
import { getAllCategories } from "@/components/services/CategoryService";

const Hero = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data); // already unwrapped
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

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
               hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white
               transition-colors duration-300"
                        >
                            Today's Deal
                        </Button>

                    </div>
                </div>

                {/* Pass categories into SearchBar */}
                <div className="w-full bg-white/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md transition-colors duration-300">
                    <SearchBar categories={categories} />
                </div>
            </div>
        </section>
    );
};

export default Hero;
