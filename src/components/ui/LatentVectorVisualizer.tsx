"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import GlassCard from "./GlassCard";
import { UMRAlignment } from "@/lib/core/umr/types";

interface LatentVectorVisualizerProps {
    alignment: UMRAlignment;
}

export default function LatentVectorVisualizer({ alignment }: LatentVectorVisualizerProps) {
    return (
        <GlassCard className="pointer-events-auto border-purple-500/20">
            <div className="flex items-center gap-2 text-purple-400 mb-4 uppercase text-[10px] font-bold tracking-widest">
                <Zap size={14} /> Fused Latent Vector
            </div>
            <div className="grid grid-cols-8 gap-1 mb-4">
                {alignment.latent.slice(0, 32).map((v, i) => (
                    <div 
                        key={i} 
                        className="aspect-square rounded-[2px] transition-colors duration-500" 
                        style={{ backgroundColor: `rgba(168, 85, 247, ${Math.max(0.1, Math.abs(v))})` }}
                    />
                ))}
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-white/40">Confidence</span>
                    <span className="text-green-400">{(alignment.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${alignment.confidence * 100}%` }}
                        className="h-full bg-green-500"
                    />
                </div>
            </div>
        </GlassCard>
    );
}
