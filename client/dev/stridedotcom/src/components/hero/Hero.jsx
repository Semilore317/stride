import React from "react";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/hero/HeroSlider.jsx";

const Hero = () => {
    return (
        <section className="relative w-full h-screen bg-black text-white overflow-hidden flex items-center justify-center">

            {/* 🖼 HeroSlider Background */}
            <div className="absolute inset-0 z-0">
                <HeroSlider />
            </div>

            {/* 🌚 Contrast Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />

            {/* 🔮 Lava lamp purple blob (add later) */}
            {/* <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-700 opacity-30 blur-2xl z-0 animate-[morph_10s_ease-in-out_infinite]" style={{ mixBlendMode: "multiply", transform: "translate(-50%, -50%)" }} /> */}

            {/* 🎯 Hero Content */}
            <div className="relative z-20 text-center px-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
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
                        className="text-lg border-white text-purple hover:bg-purple-900 hover:text-white cursor-pointer"
                    >
                        Today's Deal
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
