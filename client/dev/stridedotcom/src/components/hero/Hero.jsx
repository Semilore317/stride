import React from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
    return (
        <section className="relative w-full h-screen bg-black text-white flex items-center justify-center overflow-hidden">
            {/* Lava lamp purple blob */}
            <div
                className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-700 opacity-30 blur-2xl z-0 animate-[morph_10s_ease-in-out_infinite]"
                style={{
                    mixBlendMode: "multiply",
                    transform: "translate(-50%, -50%)",
                }}
            />

            {/* Hero Content */}
            <div className="text-center relative z-10 px-6">
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
                        className="text-lg border-white text-white hover:text-purple-500 cursor-pointer"
                    >
                        Today's Deal
                    </Button>
                </div>
            </div>

            {/* 🔥 Morphing animation style */}
            <style>{`
        @keyframes morph {
          0% {
            border-radius: 50% 50% 50% 50%;
            transform: translate(-50%, -50%) scale(1);
          }
          33% {
            border-radius: 40% 60% 55% 45%;
            transform: translate(-48%, -52%) scale(1.1);
          }
          66% {
            border-radius: 60% 40% 40% 60%;
            transform: translate(-52%, -48%) scale(0.9);
          }
          100% {
            border-radius: 50% 50% 50% 50%;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;
