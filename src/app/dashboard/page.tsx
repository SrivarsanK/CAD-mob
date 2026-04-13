"use client";

import ClaudeCard from "@/components/ui/v2/ClaudeCard";
import ClaudeButton from "@/components/ui/v2/ClaudeButton";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import AgentReasoning from "@/components/ui/AgentReasoning";
import { generateAgentReasoning } from "@/app/actions";
import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Shield, Zap, TrendingUp } from "lucide-react";
import TransitRTCard from "@/components/v2/TransitRTCard";
import ProfilingOverlay from "@/components/v2/ProfilingOverlay";

export default function DashboardPageV2() {
    const [agentSteps, setAgentSteps] = useState<string[]>([]);

    useEffect(() => {
        generateAgentReasoning("System Health Check").then(setAgentSteps);
    }, []);

    return (
        <main className="v2-root min-h-screen pt-24 px-8 pb-12 w-full max-w-[1800px] mx-auto flex flex-col gap-6">
            <header className="flex items-center justify-between shrink-0">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-white claude-gradient-text">City Intelligence Studio</h1>
                    <p className="text-sm text-claude-text-muted font-mono uppercase tracking-[0.2em]">Real-time Urban Operating System</p>
                </div>
                <div className="flex gap-3">
                    <ClaudeButton variant="secondary" className="!py-2 !px-4 text-xs">Export Report</ClaudeButton>
                    <ClaudeButton variant="primary" className="!py-2 !px-4 text-xs">Deploy Global Model</ClaudeButton>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-[600px]">
                {/* Left: Intelligence Hub */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                    <ClaudeCard className="flex-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="text-claude-accent" size={18} />
                            <h3 className="font-bold text-white">System Metrics</h3>
                        </div>
                        <div className="space-y-8">
                            <V2StatRow label="Network Load" value="72%" status="warning" trend="+4.2%" />
                            <V2StatRow label="Flow Consistency" value="0.94" status="good" trend="+0.1" />
                            <V2StatRow label="Anomalies" value="12" status="critical" trend="-2" />
                            <V2StatRow label="UMR Precision" value="99.4%" status="good" trend="Stable" />
                        </div>
                    </ClaudeCard>

                    <ClaudeCard className="shrink-0">
                         <div className="flex items-center gap-2 mb-4">
                            <Shield className="text-blue-400" size={18} />
                            <h3 className="font-bold text-white">Security & Policing</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-claude-accent/30 transition-all text-xs text-white text-left font-medium">
                                Redact Zones
                            </button>
                            <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all text-xs text-white text-left font-medium">
                                Emergency Stop
                            </button>
                        </div>
                    </ClaudeCard>
                </div>

                {/* Middle: Spatial Visualizer */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                    <div className="flex-1 relative group rounded-3xl overflow-hidden border border-white/5 bg-claude-bg-dark">
                        {/* HUD Overlays */}
                        <div className="absolute top-6 left-6 z-10 flex gap-3">
                            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-[10px] text-white/80 font-mono flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                LIVE SPATIAL STREAM
                            </div>
                            <div className="px-3 py-1.5 bg-red-500/10 backdrop-blur-xl rounded-full border border-red-500/20 text-[10px] text-red-400 font-mono">
                                HIGH CONGESTION: CORE B
                            </div>
                        </div>
                        
                        <div className="absolute bottom-6 left-6 z-10">
                            <div className="p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 space-y-3">
                                <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Active Simulation</div>
                                <div className="text-sm font-bold text-white">Metro Corridor Expansion V2.4</div>
                            </div>
                        </div>

                        <MapPlaceholder />
                    </div>
                </div>

                {/* Right: Reasoning & Transit */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
                    <ClaudeCard className="h-[45%] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="text-yellow-400" size={18} />
                            <h3 className="font-bold text-white">Agent Reasoner</h3>
                        </div>
                        <div className="flex-1 overflow-hidden relative custom-scrollbar">
                            <AgentReasoning steps={agentSteps} />
                        </div>
                    </ClaudeCard>

                    <TransitRTCard />
                </div>
            </div>
            
            <ProfilingOverlay />
        </main>
    );
}

function V2StatRow({ label, value, status, trend }: { label: string, value: string, status: 'good' | 'warning' | 'critical', trend: string }) {
    const statusColor = status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500';
    const textColor = status === 'good' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-400';
    
    return (
        <div className="group">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] text-claude-text-muted font-mono uppercase tracking-widest">{label}</span>
                <span className="text-[10px] text-white/40 font-mono">{trend}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold text-white group-hover:claude-gradient-text transition-all`}>{value}</span>
                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${statusColor} opacity-50`} 
                />
            </div>
        </div>
    );
}
