"use client";

import GlassCard from "@/components/ui/GlassCard";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import AgentReasoning from "@/components/ui/AgentReasoning";
import { generateAgentReasoning } from "@/app/actions";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function DashboardPage() {
    const [agentSteps, setAgentSteps] = useState<string[]>([]);

    useEffect(() => {
        // Auto-run a simulation on load
        generateAgentReasoning("System Health Check").then(setAgentSteps);
    }, []);

    return (
        <main className="pt-24 px-8 pb-12 w-full max-w-[1600px] mx-auto space-y-6 h-screen flex flex-col">
            <header className="space-y-2 shrink-0">
                <h1 className="text-3xl font-light tracking-tight text-white">City Control Center</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Left Column: Stats & Controls */}
                <div className="h-full flex flex-col gap-6">
                    <GlassCard className="flex-1">
                        <h3 className="text-sm font-medium text-white/80 mb-4">Live Metrics</h3>
                        <div className="space-y-6">
                            <StatRow label="Congestion" value="72%" status="warning" />
                            <StatRow label="Avg Speed" value="34 km/h" status="normal" />
                            <StatRow label="Accidents" value="2" status="critical" />
                            <StatRow label="Active Agents" value="102,400" status="good" />
                        </div>
                    </GlassCard>

                    <GlassCard className="shrink-0 space-y-4">
                        <h3 className="text-sm font-medium text-white/80">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <MagneticButton className="!px-3 !py-2 text-xs justify-center bg-white/5 hover:bg-white/10">Deploy Drones</MagneticButton>
                            <MagneticButton className="!px-3 !py-2 text-xs justify-center bg-white/5 hover:bg-white/10">Lockdown Sector</MagneticButton>
                        </div>
                    </GlassCard>
                </div>

                {/* Middle: Map (Wide) */}
                <div className="lg:col-span-2 h-full relative group">
                    {/* Overlay HUD elements */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <span className="px-2 py-1 bg-black/50 backdrop-blur rounded text-xs text-white/60 font-mono">LIVE FEED</span>
                        <span className="px-2 py-1 bg-red-500/20 backdrop-blur rounded text-xs text-red-300 font-mono animate-pulse">ALERT: SECTOR 7</span>
                    </div>
                    <MapPlaceholder />
                </div>

                {/* Right: AI & Alerts */}
                <div className="h-full flex flex-col gap-6">
                    <GlassCard className="h-1/2 flex flex-col">
                        <h3 className="text-sm font-medium text-white/80 mb-4">Command Agent</h3>
                        <div className="flex-1 overflow-hidden relative">
                            <AgentReasoning steps={agentSteps} />
                        </div>
                    </GlassCard>
                    <GlassCard className="h-1/2">
                        <h3 className="text-sm font-medium text-white/80 mb-4">Recent Alerts</h3>
                        <div className="space-y-3">
                            <AlertItem time="10:42" msg="Congestion spike in Downtown" type="warning" />
                            <AlertItem time="10:38" msg="Subway signal loss detected" type="critical" />
                            <AlertItem time="10:15" msg="Morning routine simulation verified" type="info" />
                        </div>
                    </GlassCard>
                </div>
            </div>
        </main>
    );
}

function StatRow({ label, value, status }: { label: string, value: string, status: 'good' | 'normal' | 'warning' | 'critical' }) {
    const color = status === 'good' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : status === 'critical' ? 'text-red-400' : 'text-white';
    return (
        <div>
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</div>
            <div className={`text-2xl font-light ${color}`}>{value}</div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className={`h-full rounded-full ${status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : status === 'critical' ? 'bg-red-500' : 'bg-white'}`} style={{ width: '70%' }} />
            </div>
        </div>
    );
}

function AlertItem({ time, msg, type }: { time: string, msg: string, type: 'info' | 'warning' | 'critical' }) {
    return (
        <div className="flex gap-3 items-start p-2 rounded hover:bg-white/5 transition-colors">
            <span className="text-xs text-white/40 font-mono mt-0.5">{time}</span>
            <span className={`text-xs ${type === 'critical' ? 'text-red-300' : type === 'warning' ? 'text-yellow-300' : 'text-white/80'}`}>{msg}</span>
        </div>
    );
}
