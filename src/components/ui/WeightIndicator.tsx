"use client";

import { motion } from "framer-motion";

interface WeightIndicatorProps {
    label: string;
    value: number;
    color: string;
}

export default function WeightIndicator({ label, value, color }: WeightIndicatorProps) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white/60">{label}</span>
                <span className="text-white">{(value * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}
