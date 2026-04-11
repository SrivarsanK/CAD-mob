"use client";

import { motion } from "framer-motion";
import { Point } from "@/lib/prodiff/types";

interface PathMapProps {
    path: Point[];
    isPending?: boolean;
    className?: string;
}

export default function PathMap({ path, isPending = false, className = "" }: PathMapProps) {
    if (!path || path.length === 0) return (
        <div className={`w-full h-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20 font-mono text-sm uppercase tracking-widest ${className}`}>
            No Trajectory Data
        </div>
    );

    // Simple projection logic for SVG
    const lats = path.map(p => p.lat);
    const lngs = path.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const padding = 0.1;
    const latRange = (maxLat - minLat) || 0.001;
    const lngRange = (maxLng - minLng) || 0.001;

    const project = (p: Point) => {
        const x = ((p.lng - minLng) / lngRange) * 80 + 10;
        const y = 90 - (((p.lat - minLat) / latRange) * 80 + 10);
        return `${x},${y}`;
    };

    const pointsString = path.map(project).join(" ");

    return (
        <div className={`relative w-full h-full bg-black/40 border border-white/5 rounded-2xl overflow-hidden ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                {/* Abstract Grid */}
                <g className="stroke-white/5 stroke-[0.2]">
                    {[...Array(11)].map((_, i) => (
                        <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" />
                    ))}
                    {[...Array(11)].map((_, i) => (
                        <line key={`h-${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />
                    ))}
                </g>

                {/* Trajectory Path */}
                <motion.polyline
                    points={pointsString}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                        pathLength: 1, 
                        opacity: isPending ? 0.3 : 1 
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Start/End Points */}
                <circle cx={project(path[0]).split(",")[0]} cy={project(path[0]).split(",")[1]} r="2" fill="white" />
                <circle cx={project(path[path.length-1]).split(",")[0]} cy={project(path[path.length-1]).split(",")[1]} r="3" fill="#8b5cf6" />
            </svg>
            
            <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white" /> Start Origin
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Predicted Dest
                </div>
            </div>
        </div>
    );
}
