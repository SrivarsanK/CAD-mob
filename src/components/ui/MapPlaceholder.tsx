"use client";

import { motion } from "framer-motion";
import { Grid, Map as MapIcon, ScanLine } from "lucide-react";

export default function MapPlaceholder({ className = "" }: { className?: string }) {
    return (
        <div className={`relative w-full h-full overflow-hidden rounded-2xl glass-panel flex items-center justify-center group ${className}`}>
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Scanning Line */}
            <motion.div
                className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent z-0"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Icon & Label */}
            <div className="relative z-10 flex flex-col items-center gap-3 text-white/40 group-hover:text-white/80 transition-colors duration-500">
                <div className="p-4 rounded-full bg-white/5 border border-white/5 backdrop-blur-md shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <MapIcon size={32} className="stroke-1" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
                    <ScanLine size={14} className="animate-pulse" />
                    <span>Map Visualization Offline</span>
                </div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/10 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/10 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/10 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/10 rounded-br-lg" />
        </div>
    );
}
