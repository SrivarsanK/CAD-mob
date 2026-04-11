"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <div className="flex flex-col items-center justify-center text-center z-10 w-full px-4 py-20 pointer-events-none">
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/20 pb-4"
            >
                Predicting the Flow <br /> of the Future
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-lg md:text-xl text-blue-200/60 font-medium tracking-wide mt-6"
            >
                Agentic Reasoning • Causal Robustness • Generative Diffusion
            </motion.p>
        </div>
    );
}
