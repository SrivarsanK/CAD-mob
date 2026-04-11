"use client";

import GlassCard from "./GlassCard";
import { Activity, ShieldCheck, History, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface CausalControlPanelProps {
    interventions: {
        historyDisabled: boolean;
        zoneBlocked: boolean;
        normsOverridden: boolean;
    };
    onToggle: (key: 'historyDisabled' | 'zoneBlocked' | 'normsOverridden') => void;
    onInference: () => void;
    isPending?: boolean;
}

/**
 * CausalControlPanel: Interactive controls for Pearlian do-operators.
 */
export default function CausalControlPanel({ 
    interventions, 
    onToggle, 
    onInference,
    isPending = false 
}: CausalControlPanelProps) {
    return (
        <GlassCard className="w-80 pointer-events-auto">
            <div className="flex items-center gap-2 text-blue-400 mb-6 border-b border-white/5 pb-4">
                <Activity size={18} />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Causal Treatments</h3>
            </div>

            <div className="space-y-4">
                <TreatmentToggle 
                    label="Individual History" 
                    description="Mute historical bias (do-operator H)"
                    active={!interventions.historyDisabled} 
                    icon={<History size={16} />}
                    onClick={() => onToggle('historyDisabled')}
                />
                
                <TreatmentToggle 
                    label="Zone Constraints" 
                    description="Ignore spatial functional zones (do-operator Z)"
                    active={!interventions.zoneBlocked} 
                    icon={<MapPin size={16} />}
                    onClick={() => onToggle('zoneBlocked')}
                />

                <TreatmentToggle 
                    label="Collective Norms" 
                    description="Override societal flow patterns (do-operator N)"
                    active={!interventions.normsOverridden} 
                    icon={<ShieldCheck size={16} />}
                    onClick={() => onToggle('normsOverridden')}
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onInference}
                disabled={isPending}
                className="w-full mt-6 py-3 rounded-xl bg-blue-600 font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
            >
                <Zap size={16} className={isPending ? "animate-pulse" : "group-hover:animate-bounce"} />
                {isPending ? "Estimating Effect..." : "Run Interventional Inference"}
            </motion.button>
            
            <p className="mt-4 text-[10px] text-white/30 text-center font-mono leading-tight">
                Pearlian SCM Engine v0.1-Alpha <br />
                P-value: 0.042 | Entropy: 1.2bit
            </p>
        </GlassCard>
    );
}

function TreatmentToggle({ label, description, active, icon, onClick }: { 
    label: string, 
    description: string, 
    active: boolean, 
    icon: React.ReactNode, 
    onClick: () => void 
}) {
    return (
        <div 
            onClick={onClick}
            className="group cursor-pointer p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
        >
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                    {icon}
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${active ? 'bg-blue-500' : 'bg-white/10'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            </div>
            <p className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors leading-snug">
                {description}
            </p>
        </div>
    );
}
