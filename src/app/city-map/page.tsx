"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, Info, Layers, RefreshCw, Zap } from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import CausalControlPanel from "@/components/ui/CausalControlPanel";
import AgentReasoning from "@/components/ui/AgentReasoning";
import UMRVisualizer from "@/components/3d/UMRVisualizer";
import TrajectoryProjection from "@/components/3d/TrajectoryProjection";
import ProbabilityFog from "@/components/3d/ProbabilityFog";

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
        <main className="w-full h-screen bg-black relative overflow-hidden">
            {/* Top Bar HUD */}
            <div className="absolute top-24 left-8 right-8 z-10 flex justify-between items-start pointer-events-none">
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

                <div className="flex gap-4 pointer-events-auto">
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

            {/* Left Panel: Causal & Reasoning */}
            <div className="absolute left-8 bottom-8 z-10 space-y-6 flex flex-col pointer-events-none">
                <CausalControlPanel 
                    interventions={interventions}
                    onToggle={toggleIntervention}
                    onInference={() => runSimulation()}
                    isPending={isPending}
                />
                
                <GlassCard className="w-80 pointer-events-auto !bg-black/60">
                    <AgentReasoning steps={logs} />
                </GlassCard>
            </div>

            {/* Right Panel: Latent Metadata */}
            <AnimatePresence>
                {alignment && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute right-8 top-1/4 z-10 w-72 space-y-4 pointer-events-none"
                    >
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

                        <GlassCard className="pointer-events-auto">
                            <div className="flex items-center gap-2 text-white/40 mb-3 uppercase text-[10px] font-bold tracking-widest">
                                <Info size={14} /> Saliency Weights
                            </div>
                            <div className="space-y-4">
                                <WeightIndicator label="Reasoning (LLM)" value={alignment.headWeights.reasoning} color="bg-blue-500" />
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

            {/* 3D Visualizer */}
            <div className="absolute inset-0">
                <Canvas
                    camera={{ position: [5, 5, 5], fov: 40 }}
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                    dpr={[1, 2]}
                >
                    <PerspectiveCamera makeDefault position={[6, 4, 8]} fov={35} />
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
                    <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                    <Suspense fallback={null}>
                        <Environment preset="night" />
                        
                        <group position={[0, -0.5, 0]}>
                            {/* The City Grid (Abstract) */}
                            <gridHelper args={[20, 40, 0x333333, 0x111111]} />
                            
                            {/* Fused Components */}
                            <UMRVisualizer alignment={alignment} position={[0, 0.5, 0]} />
                            <TrajectoryProjection path={path} opacity={isPending ? 0.2 : 0.8} />
                            
                            <ProbabilityFog />
                        </group>

                        <ContactShadows 
                            resolution={1024} 
                            scale={20} 
                            blur={2} 
                            opacity={0.4} 
                            far={10} 
                            color="#000000" 
                        />
                    </Suspense>

                    <OrbitControls 
                        enableDamping 
                        dampingFactor={0.05} 
                        rotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 2.1} 
                        minDistance={3}
                        maxDistance={15}
                    />
                </Canvas>
            </div>

            {/* Bottom HUD: Coordinates */}
            <div className="absolute bottom-8 right-8 z-10 text-right pointer-events-none">
                <div className="text-white font-mono text-xl tracking-tighter">
                    40.7128° N, 74.0060° W
                </div>
                <div className="text-white/20 text-xs uppercase tracking-widest font-bold">
                    Temporal Index: T+24.0h
                </div>
            </div>
        </main>
    );
}

function WeightIndicator({ label, value, color }: { label: string, value: number, color: string }) {
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
