import React, { useEffect, useState } from "react";
import slide1 from "@/assets/images/pexels-bigshowlamar-30713966.jpg";
import slide2 from "@/assets/images/pexels-cottonbro-6616656.jpg";
import slide3 from "@/assets/images/pexels-cottonbro-10547928.jpg"
import slide4 from "@/assets/images/ao-dai-6152097_1280.jpg";
import slide5 from "@/assets/images/pexels-polina-tankilevitch-6939175.jpg";
import slide6 from "@/assets/images/pexels-pnw-prod-7576612.jpg";
import slide7 from "@/assets/images/pexels-nerdcinema-19435732.jpg";
import slide8 from "@/assets/images/pexels-polina-tankilevitch-6939137.jpg"

import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    // Auto-slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const prevSlide = () =>
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

    return (
        <div className="relative w-full h-[80vh] overflow-hidden">
            {/* Slides */}
            <div className="flex transition-transform duration-1000 ease-in-out"
                 style={{ transform: `translateX(-${current * 100}%)` }}>
                {slides.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`slide-${index}`}
                        className="w-full flex-shrink-0 object-cover h-[80vh]"
                    />
                ))}
            </div>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white z-10"
            >
                <ChevronLeft />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white z-10"
            >
                <ChevronRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === current ? "bg-white" : "bg-gray-400"}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
