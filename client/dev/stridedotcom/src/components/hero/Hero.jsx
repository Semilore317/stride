import React from "react";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/hero/HeroSlider.jsx";
import SearchBar from "@/components/search/SearchBar.jsx";

const Hero = () => {
    return (
        <section className="relative w-full h-screen bg-black text-white overflow-hidden">

            {/* Background Slider */}
            <div className="absolute inset-0 z-10">
                <HeroSlider />
            </div>

            {/* Fullscreen dark overlay (dark mode only) */}
            //<div className="absolute inset-0 z-20 pointer-events-none dark:bg-black/60" />
            {/* Dark overlay (light + dark mode handled) */}
            <div className="absolute inset-0 z-20 pointer-events-none dark:bg-black/30 bg-black/30 transition-colors duration-500" />

            {/* Content */}
            <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center max-w-4xl mx-auto space-y-10">

                {/* Heading */}
                <div className="space-y-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                        Welcome To <span className="text-purple-500">𝕾𝖙𝖗𝖎𝖉𝖊</span>
                    </h1>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="#">
                            <Button size="lg" className="text-lg cursor-pointer">
                                SHOP NOW
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg border-white text-purple font-bold hover:bg-purple-900 hover:text-white cursor-pointer"
                        >
                            Today's Deal
                        </Button>
                    </div>
                </div>

                {/* SearchBar Container (glass in light, dim in dark) */}
                <div className="w-full bg-white/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md transition-colors duration-300">
                    <SearchBar />
                </div>

            </div>
        </section>
    );
};

export default Hero;
