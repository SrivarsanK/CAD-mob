"use client";

import { motion } from "framer-motion";
import ClaudeButton from "@/components/ui/v2/ClaudeButton";
import { ArrowRight, Play, Server, Zap } from "lucide-react";

export default function ClaudeHero() {
    return (
        <section className="relative pt-32 pb-20 px-6 flex flex-col items-center">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-claude-accent/20 blur-[120px] rounded-full -z-10 opacity-30" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-claude-accent/10 border border-claude-accent/20 text-claude-accent text-xs font-bold uppercase tracking-widest mb-8"
            >
                <Zap size={12} fill="currentColor" />
                V0.1 Alpha: UMR Fusion Engine
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-center max-w-4xl claude-gradient-text leading-[1.1]"
            >
                Forecasting the Pulse of <br /> Urban Intelligence
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 text-lg md:text-xl text-claude-text-secondary text-center max-w-2xl leading-relaxed"
            >
                CAD-Mob integrates Agentic Reasoning with Causal Diffusion to predict, optimize, and explain complex mobility patterns in real-time.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
                <ClaudeButton variant="primary" className="px-8 py-3.5 text-base group">
                    Launch Studio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </ClaudeButton>
                <ClaudeButton variant="secondary" className="px-8 py-3.5 text-base">
                    <Play size={18} fill="currentColor" /> Watch Keynote
                </ClaudeButton>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 aspect-video relative group"
            >
                <div className="absolute inset-0 bg-claude-surface/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                            <Server className="text-white" size={32} />
                        </div>
                        <span className="text-claude-text-muted font-mono text-sm uppercase tracking-widest">Connect to Live Stream</span>
                    </div>
                </div>
                {/* Decorative overlay */}
                <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
            </motion.div>
        </section>
    );
}
