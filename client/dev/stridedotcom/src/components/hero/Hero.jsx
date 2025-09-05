import React from "react";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/hero/HeroSlider.jsx";
import SearchBar from "@/components/search/SearchBar.jsx";

const Hero = () => {
    return (
        <section className="relative w-full h-screen bg-black text-white overflow-hidden">

            {/* Background slider with higher z-index so buttons remain clickable */}
            <div className="absolute inset-0 z-10">
                <HeroSlider />
            </div>

            {/* Dark overlay for contrast (below content, above slider) */}
            <div className="absolute inset-0 bg-black/60 z-20 pointer-events-none" />

            {/* Content wrapper */}
            <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center max-w-4xl mx-auto space-y-10">

                {/* Welcome Heading */}
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

                {/* Search Bar Below Heading */}
                <div className="w-full bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md">
                    <SearchBar />
                </div>
            </div>
        </section>
    );
};

export default Hero;
