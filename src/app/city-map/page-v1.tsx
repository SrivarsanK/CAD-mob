"use client";

import { Suspense, useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Info, RefreshCw } from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import CausalControlPanel from "@/components/ui/CausalControlPanel";
import AgentReasoning from "@/components/ui/AgentReasoning";
import WeightIndicator from "@/components/ui/WeightIndicator";
import LatentVectorVisualizer from "@/components/ui/LatentVectorVisualizer";
import PathMap from "@/components/ui/PathMap";
import ExplainabilityHUD from "@/components/ui/ExplainabilityHUD";

import { alignMobilityUMR } from "@/app/actions";
import { UMRAlignment } from "@/lib/core/umr/types";
import { Point } from "@/lib/prodiff/types";

export default function CityMapPage() {
    const [isPending, startTransition] = useTransition();
    const [alignment, setAlignment] = useState<UMRAlignment | null>(null);
    const [path, setPath] = useState<Point[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    
    const [interventions, setInterventions] = useState({
        historyDisabled: false,
        zoneBlocked: false,
        normsOverridden: false
    });

    const runSimulation = (currentInterventions = interventions) => {
        startTransition(async () => {
            setLogs(["Initializing UMR pipeline...", "Connecting to Reasoning Head..."]);
            // Demo points for NYC Central Park to Times Square area
            const start: [number, number] = [40.785091, -73.968285];
            const end: [number, number] = [40.758896, -73.985130];
            
            const result = await alignMobilityUMR("user_88", start, end, currentInterventions);
            
            setAlignment(result.alignment);
            setPath(result.path);
            setLogs(result.reasoningSteps);
        });
    };

    const toggleIntervention = (key: keyof typeof interventions) => {
        const nextInterventions = { ...interventions, [key]: !interventions[key] };
        setInterventions(nextInterventions);
        // In this architecture, changing a causal toggle immediately re-estimates the latent
        runSimulation(nextInterventions);
    };

    // Initial run
    useEffect(() => {
        runSimulation();
    }, []);

    return (
        <main className="w-full h-screen bg-black relative overflow-hidden flex flex-col pt-24 px-8 pb-8 gap-8">
            {/* Header HUD */}
            <div className="flex justify-between items-start shrink-0">
                <div className="space-y-1">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-light tracking-tight text-white drop-shadow-2xl"
                    >
                        UMR Fusion Dashboard
                    </motion.h1>
                    <div className="flex items-center gap-3 text-white/40 font-mono text-xs uppercase tracking-[0.2em]">
                        <Activity size={14} className="text-green-500 animate-pulse" />
                        <span>Live Simulation Loop • 10Hz</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => runSimulation()}
                        disabled={isPending}
                        className="px-6 py-2 rounded-full glass-panel border-white/10 text-white flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={isPending ? "animate-spin" : ""} />
                        Refresh Latent
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 gap-8 min-h-0">
                {/* Left Column: Controls & Reasoning */}
                <div className="w-80 space-y-6 flex flex-col shrink-0 min-h-0">
                    <CausalControlPanel 
                        interventions={interventions}
                        onToggle={toggleIntervention}
                        onInference={() => runSimulation()}
                        isPending={isPending}
                    />
                    
                    <GlassCard className="flex-1 min-h-0 !bg-black/60 overflow-hidden flex flex-col">
                        <AgentReasoning steps={logs} />
                    </GlassCard>
                </div>

                {/* Center Column: 2D Path Map */}
                <div className="flex-1 relative min-h-0">
                    <PathMap path={path} isPending={isPending} />
                </div>

                {/* Right Column: Latent Metadata */}
                <div className="w-80 space-y-6 shrink-0 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                    <ExplainabilityHUD alignment={alignment} isPending={isPending} />

                    <AnimatePresence mode="wait">
                        {alignment && (
                            <motion.div 
                                key={alignment.metadata.timestamp}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <LatentVectorVisualizer alignment={alignment} />

                                <GlassCard>
                                    <div className="flex items-center gap-2 text-white/40 mb-3 uppercase text-[10px] font-bold tracking-widest">
                                        <Info size={14} /> Saliency Weights
                                    </div>
                                    <div className="space-y-4">
                                        <WeightIndicator label="Reasoning (Head)" value={alignment.headWeights.reasoning} color="bg-blue-500" />
                                        <WeightIndicator label="Diffusion (Gen)" value={alignment.headWeights.diffusion} color="bg-pink-500" />
                                        <WeightIndicator label="Causal (SCM)" value={alignment.headWeights.causal} color="bg-orange-500" />
                                    </div>
                                </GlassCard>

                                <div className="text-[10px] text-white/20 font-mono text-center uppercase tracking-tighter">
                                    Tag: {alignment.metadata.intentionTag}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>


            {/* Footer HUD: Coordinates */}
            <div className="flex justify-end items-end shrink-0">
                <div className="text-right">
                    <div className="text-white font-mono text-xl tracking-tighter">
                        40.7128° N, 74.0060° W
                    </div>
                    <div className="text-white/20 text-xs uppercase tracking-widest font-bold">
                        Temporal Index: T+24.0h
                    </div>
                </div>
            </div>
        </main>
    );
}
