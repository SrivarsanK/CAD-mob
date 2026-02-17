"use client";

import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import { Circle, Globe, LayoutGrid, Search } from "lucide-react";
import { useState } from "react";
import AgentReasoning from "@/components/ui/AgentReasoning";
import { generateAgentReasoning } from "@/app/actions";

export default function Navbar() {
    const [showAgent, setShowAgent] = useState(false);
    const [steps, setSteps] = useState<string[]>([]);

    const handleAsk = async () => {
        setSteps([]);
        // Optimistic update or wait for stream
        const result = await generateAgentReasoning("Close Brooklyn Bridge");
        setSteps(result);
    };
    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 glass-panel rounded-full px-8 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse-glow" />
                <span className="text-lg font-semibold tracking-tight">CAD-Mob</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                <Link href="/forecast" className="hover:text-white transition-colors">Forecast</Link>
                <Link href="/agents" className="hover:text-white transition-colors">Agents</Link>
                <Link href="/city-map" className="hover:text-white transition-colors">City Map</Link>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Search size={20} className="stroke-[1.5]" />
                </button>
                <div className="relative">
                    <MagneticButton onClick={() => setShowAgent(true)} className="px-5 py-2 text-sm bg-white/10 border-none hover:bg-white/20">
                        Ask Agent
                    </MagneticButton>

                    {showAgent && (
                        <div className="absolute top-12 right-0 w-80 glass-panel rounded-xl p-4 z-50">
                            <AgentReasoning steps={steps} />
                            {steps.length === 0 && (
                                <button
                                    onClick={handleAsk}
                                    className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs rounded uppercase tracking-wider transition-colors"
                                >
                                    Run Simulation: Bridge Closure
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
