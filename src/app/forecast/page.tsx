"use client";

import ClaudeCard from "@/components/ui/v2/ClaudeCard";
import ClaudeButton from "@/components/ui/v2/ClaudeButton";
import { ArrowUpRight, Calendar, TrendingUp, Database, Map, Info } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ForecastPageV2() {
    const [dataset, setDataset] = useState<"foursquare" | "porto" | "tdrive">("porto");
    const [isSwitching, setIsSwitching] = useState(false);

    const handleDatasetSwitch = async (ds: "foursquare" | "porto" | "tdrive") => {
        setIsSwitching(true);
        setDataset(ds);
        try {
            const { switchDataset } = await import("@/app/actions");
            await switchDataset(ds);
        } catch (error) {
            console.error("Failed to switch dataset:", error);
        } finally {
            setIsSwitching(false);
        }
    };

    return (
        <main className={`v2-root min-h-screen pt-24 px-8 pb-12 w-full max-w-7xl mx-auto space-y-8 flex flex-col transition-opacity duration-300 ${isSwitching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <header className="space-y-4 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-white claude-gradient-text">Predictive Forecast</h1>
                    <p className="text-claude-text-secondary max-w-2xl leading-relaxed">
                        LLM-augmented trajectory prediction across multi-modal urban networks. Selecting <span className="text-claude-accent font-mono">{dataset.toUpperCase()}</span> as the primary truth source.
                    </p>
                </div>
                
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {(["foursquare", "porto", "tdrive"] as const).map((ds) => (
                        <button
                            key={ds}
                            onClick={() => handleDatasetSwitch(ds)}
                            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                                dataset === ds 
                                ? "bg-claude-accent text-white shadow-lg shadow-claude-accent/20" 
                                : "text-claude-text-muted hover:text-white"
                            }`}
                        >
                            {ds.toUpperCase()}
                        </button>
                    ))}
                </div>
            </header>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Predicted Congestion", value: "+12.4%", trend: "up", color: "text-red-400" },
                    { label: "Transit Efficiency", value: "94.2%", trend: "stable", color: "text-green-400" },
                    { label: "Predictive Latency", value: "128ms", trend: "down", color: "text-green-400" },
                    { label: "Dataset Coverage", value: "98.1%", trend: "stable", color: "text-blue-400" },
                ].map((stat, i) => (
                    <ClaudeCard key={i} className="flex flex-col gap-2 relative group overflow-hidden">
                        <span className="text-claude-text-muted text-[10px] uppercase tracking-widest font-mono">{stat.label}</span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-bold text-white group-hover:text-claude-accent transition-colors">{stat.value}</span>
                            <ArrowUpRight size={16} className={`${stat.color} mb-1`} />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/5 blur-xl rounded-full" />
                    </ClaudeCard>
                ))}
            </div>

            {/* Main Forecast Body */}
            <div className="grid grid-cols-12 gap-6 flex-1">
                {/* Visualizer Panel */}
                <ClaudeCard className="col-span-12 lg:col-span-8 h-[500px] flex flex-col relative group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-claude-accent" size={18} />
                            <h3 className="font-bold text-white uppercase text-xs tracking-widest">Temporal Flow Analysis</h3>
                        </div>
                        <div className="flex gap-2">
                             <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-claude-accent" />
                                Predicted
                             </div>
                             <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Historical
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between px-1 gap-1 relative overflow-hidden">
                        {[...Array(48)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${15 + Math.random() * 80}%` }}
                                transition={{ duration: 1, delay: i * 0.01 }}
                                className={`w-full ${i % 3 === 0 ? 'bg-claude-accent/40 hover:bg-claude-accent' : 'bg-white/10 hover:bg-white/20'} rounded-t-lg transition-colors cursor-help group/bar`}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-black text-white text-[8px] px-1.5 py-0.5 rounded pointer-events-none">
                                    {(Math.random() * 10).toFixed(1)}k vectors
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[10px] text-claude-text-muted font-mono tracking-tighter">
                        <span>00:00</span>
                        <span>04:00</span>
                        <span>08:00</span>
                        <span>12:00</span>
                        <span>16:00</span>
                        <span>20:00</span>
                        <span>24:00</span>
                    </div>
                </ClaudeCard>

                {/* Dataset Intelligence Panel */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <ClaudeCard className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Database className="text-blue-400" size={18} />
                            <h3 className="font-bold text-white">Dataset Summary</h3>
                        </div>
                        <div className="space-y-4">
                            <DatasetStat label="Total Records" value={dataset === "porto" ? "1.7M" : dataset === "tdrive" ? "15M" : "4.2k"} />
                            <DatasetStat label="Sampling Rate" value={dataset === "porto" ? "15s" : dataset === "tdrive" ? "2-5m" : "Irregular"} />
                            <DatasetStat label="Primary Mode" value={dataset === "foursquare" ? "POI Visits" : "Vehicle GPS"} />
                            
                            <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                <div className="flex items-start gap-3">
                                    <Info className="text-blue-400 shrink-0" size={16} />
                                    <p className="text-[11px] text-blue-200/70 leading-relaxed">
                                        Trajectories from {dataset.toUpperCase()} are automatically normalized into the UMR latent space.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ClaudeCard>

                    <ClaudeCard className="shrink-0 bg-claude-accent/10 border-claude-accent/30">
                        <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Model Confidence</h4>
                        <div className="text-4xl font-black text-white mb-4">0.962</div>
                        <ClaudeButton variant="primary" className="w-full !py-3">Run Retraining Cycle</ClaudeButton>
                    </ClaudeCard>
                </div>
            </div>
        </main>
    );
}

function DatasetStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-xs text-claude-text-secondary">{label}</span>
            <span className="text-xs font-mono text-white font-bold">{value}</span>
        </div>
    );
}
