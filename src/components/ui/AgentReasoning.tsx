"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Step {
    id: string;
    text: string;
    status: 'pending' | 'processing' | 'completed';
}

export default function AgentReasoning({ steps }: { steps: string[] }) {
    const [displaySteps, setDisplaySteps] = useState<Step[]>([]);

    useEffect(() => {
        if (!steps || steps.length === 0) return;

        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex >= steps.length) {
                clearInterval(interval);
                return;
            }

            const newStep = {
                id: Math.random().toString(36),
                text: steps[currentIndex],
                status: 'processing' as const
            };

            setDisplaySteps(prev => {
                const updated = prev.map(s => ({ ...s, status: 'completed' as const }));
                return [...updated, newStep];
            });

            currentIndex++;
        }, 1200); // Simulate "Thinking" time per step

        return () => clearInterval(interval);
    }, [steps]);

    return (
        <div className="flex flex-col gap-3 font-mono text-sm max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center gap-2 text-purple-300 mb-2">
                <BrainCircuit size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Agent Thought Process</span>
            </div>

            <AnimatePresence mode="popLayout">
                {displaySteps.map((step) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${step.status === 'completed'
                                ? 'bg-white/5 border-white/5 text-gray-400'
                                : 'bg-purple-500/10 border-purple-500/30 text-white'
                            }`}
                    >
                        <div className="mt-0.5">
                            {step.status === 'completed' ? (
                                <CheckCircle2 size={14} className="text-green-400" />
                            ) : (
                                <Loader2 size={14} className="animate-spin text-purple-400" />
                            )}
                        </div>
                        <span className="leading-snug">{step.text}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
