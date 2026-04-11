"use client";

import GlassCard from "./GlassCard";
import { Info, MessageSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UMRAlignment } from "@/lib/core/umr/types";

interface ExplainabilityHUDProps {
    alignment: UMRAlignment | null;
    isPending?: boolean;
}

/**
 * ExplainabilityHUD: Provides textual summaries of interventional impacts.
 * Explains WHY the trajectory changed based on latent head weights.
 */
export default function ExplainabilityHUD({ alignment, isPending }: ExplainabilityHUDProps) {
    if (!alignment && !isPending) return null;

    const getImpactAnalysis = () => {
        if (!alignment) return "Analyzing causal structure...";

        const { reasoning, diffusion, causal } = alignment.headWeights;
        const tag = alignment.metadata.intentionTag;

        if (causal > 0.45) {
            return `Heavy interventional shift detected. Causal constraints (SCM) are overriding historical patterns to simulate a specific 'do' operation. Intention: ${tag}.`;
        }

        if (reasoning > 0.5) {
            return `System is prioritizing individual historical trends. High adherence to user ${alignment.metadata.userId.split('_')[1]}'s recurrent behavior patterns.`;
        }

        if (diffusion > 0.5) {
            return `Generative priors are dominant. The trajectory follows a standard proto-typical flow pattern with high diffusion guidance.`;
        }

        return `Balanced multi-modal alignment. Integrating reasoning context with generative diffusion headers.`;
    };

    const getCausalInsight = () => {
        if (!alignment) return null;
        const { causal } = alignment.headWeights;
        if (causal < 0.3) return null;

        return "Counterfactual logic active. The system is calculating the causal difference between observed history and the intended intervention path.";
    };

    return (
        <GlassCard className="!bg-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-300 mb-3 uppercase text-[10px] font-bold tracking-widest">
                <MessageSquare size={14} /> Explainability HUD
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={alignment?.metadata.timestamp || 'pending'}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-white/70 leading-relaxed italic font-serif"
                    >
                        "{getImpactAnalysis()}"
                    </motion.div>
                </AnimatePresence>

                {alignment && getCausalInsight() && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-2 rounded bg-orange-500/10 border border-orange-500/20 flex gap-2"
                    >
                        <AlertCircle size={12} className="text-orange-400 shrink-0 mt-0.5" />
                        <span className="text-[10px] text-orange-200/80 leading-tight">
                            {getCausalInsight()}
                        </span>
                    </motion.div>
                )}

                {!alignment && isPending && (
                    <div className="flex items-center gap-2 text-white/20">
                        <div className="w-1 h-1 bg-white animate-bounce" />
                        <div className="w-1 h-1 bg-white animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-white animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[10px] uppercase font-mono tracking-tighter">De-biasing latent space...</span>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
