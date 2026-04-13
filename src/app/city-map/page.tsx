"use client";

import { Suspense, useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Info, RefreshCw, BarChart3, Map as MapIcon, BrainCircuit, Sliders } from "lucide-react";

import ClaudeCard from "@/components/ui/v2/ClaudeCard";
import ClaudeButton from "@/components/ui/v2/ClaudeButton";
import CausalControlPanel from "@/components/ui/CausalControlPanel";
import AgentReasoning from "@/components/ui/AgentReasoning";
import WeightIndicator from "@/components/ui/WeightIndicator";
import LatentVectorVisualizer from "@/components/ui/LatentVectorVisualizer";
import PathMap from "@/components/ui/PathMap";
import ExplainabilityHUD from "@/components/ui/ExplainabilityHUD";

import { alignMobilityUMR } from "@/app/actions";
import { UMRAlignment } from "@/lib/core/umr/types";
import { Point } from "@/lib/prodiff/types";

export default function CityMapPageV2() {
    const [isPending, startTransition] = useTransition();
    const [alignment, setAlignment] = useState<UMRAlignment | null>(null);
    const [path, setPath] = useState<Point[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'map' | 'reasoning' | 'analytics'>('map');
    const [currentTime, setCurrentTime] = useState<string>("");
    
    useEffect(() => {
        setCurrentTime(new Date().toISOString());
    }, []);
    
    const [interventions, setInterventions] = useState({
        historyDisabled: false,
        zoneBlocked: false,
        normsOverridden: false
    });

    const runSimulation = (currentInterventions = interventions) => {
        startTransition(async () => {
            setLogs(["Initializing UMR pipeline...", "Connecting to Reasoning Head..."]);
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
        runSimulation(nextInterventions);
    };

    useEffect(() => {
        runSimulation();
    }, []);

    return (
        <main className="v2-root min-h-screen pt-24 px-6 pb-8 flex flex-col gap-6 overflow-hidden">
            {/* Control Header */}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight claude-gradient-text">City Intelligence Studio</h1>
                    <div className="flex items-center gap-3 text-claude-text-muted font-mono text-xs uppercase tracking-[0.2em]">
                        <Activity size={14} className="text-claude-accent animate-pulse" />
                        <span>Real-time Synthesis • Latent L-16</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-claude-border">
                    <TabButton 
                        active={activeTab === 'map'} 
                        onClick={() => setActiveTab('map')} 
                        icon={<MapIcon size={16} />} 
                        label="Spatial" 
                    />
                    <TabButton 
                        active={activeTab === 'reasoning'} 
                        onClick={() => setActiveTab('reasoning')} 
                        icon={<BrainCircuit size={16} />} 
                        label="Reasoning" 
                    />
                    <TabButton 
                        active={activeTab === 'analytics'} 
                        onClick={() => setActiveTab('analytics')} 
                        icon={<BarChart3 size={16} />} 
                        label="Latent" 
                    />
                </div>

                <ClaudeButton 
                    onClick={() => runSimulation()}
                    disabled={isPending}
                    className="px-5 py-2 text-sm"
                >
                    <RefreshCw size={16} className={isPending ? "animate-spin" : ""} />
                    Reset Inference
                </ClaudeButton>
            </div>

            {/* Layout Grid */}
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left: Intervention Controls */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                    <ClaudeCard className="border-claude-accent/20">
                        <div className="flex items-center gap-2 text-claude-accent mb-4">
                            <Sliders size={18} />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Causal Interventions</h2>
                        </div>
                        <CausalControlPanel 
                            interventions={interventions}
                            onToggle={toggleIntervention}
                            onInference={() => runSimulation()}
                            isPending={isPending}
                        />
                    </ClaudeCard>

                    <ClaudeCard className="flex-1 min-h-0 bg-claude-surface/30">
                        <div className="flex items-center gap-2 text-claude-text-muted mb-4">
                            <BrainCircuit size={18} />
                            <h2 className="text-sm font-bold uppercase tracking-widest">Trace Logs</h2>
                        </div>
                        <AgentReasoning steps={logs} />
                    </ClaudeCard>
                </div>

                {/* Center: Main Viewport (Spatial/Reasoning/Analytics) */}
                <div className="col-span-12 lg:col-span-6 relative flex flex-col gap-6 min-h-[400px]">
                    <ClaudeCard variant="glass" className="flex-1 p-0 overflow-hidden relative border-claude-accent/10">
                        <AnimatePresence mode="wait">
                            {activeTab === 'map' && (
                                <motion.div 
                                    key="map"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0"
                                >
                                    <PathMap path={path} isPending={isPending} />
                                </motion.div>
                            )}
                            {/* Analytics/Reasoning full views could go here */}
                        </AnimatePresence>
                        
                        {/* Overlay HUDs */}
                        <div className="absolute top-4 right-4 z-10 w-64">
                            <ExplainabilityHUD alignment={alignment} isPending={isPending} />
                        </div>
                    </ClaudeCard>
                    
                    <div className="flex justify-between items-center px-4 py-2 bg-white/5 rounded-xl border border-claude-border">
                        <div className="text-[10px] font-mono text-claude-text-muted uppercase tracking-widest">
                            {alignment?.metadata.intentionTag || "Awaiting Tag..."}
                        </div>
                        <div className="text-[10px] font-mono text-claude-text-muted">
                            {currentTime}
                        </div>

                    </div>
                </div>

                {/* Right: Latent & Metadata */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                    {alignment && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <ClaudeCard>
                                <LatentVectorVisualizer alignment={alignment} />
                            </ClaudeCard>

                            <ClaudeCard>
                                <div className="flex items-center gap-2 text-claude-text-muted mb-4 uppercase text-[10px] font-bold tracking-widest leading-none">
                                    <Info size={14} /> Saliency Analysis
                                </div>
                                <div className="space-y-5">
                                    <WeightIndicator label="Reasoning (Head)" value={alignment.headWeights.reasoning} color="bg-claude-accent" />
                                    <WeightIndicator label="Diffusion (Gen)" value={alignment.headWeights.diffusion} color="bg-blue-400" />
                                    <WeightIndicator label="Causal (SCM)" value={alignment.headWeights.causal} color="bg-slate-400" />
                                </div>
                            </ClaudeCard>

                            <ClaudeCard className="bg-claude-accent/5 border-claude-accent/20">
                                <p className="text-xs text-claude-text-secondary leading-relaxed italic">
                                    "The latent state indicates a high reliance on historical causal norms (SCM weight: {alignment.headWeights.causal.toFixed(2)}), suggesting stability despite current spatial interventions."
                                </p>
                            </ClaudeCard>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
                ${active ? 'bg-claude-accent text-white shadow-lg shadow-claude-accent/20' : 'text-claude-text-muted hover:text-white hover:bg-white/5'}
            `}
        >
            {icon}
            {label}
        </button>
    );
}
