"use client";

import ClaudeCard from "@/components/ui/v2/ClaudeCard";
import ClaudeButton from "@/components/ui/v2/ClaudeButton";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import { Cpu, RotateCcw, Truck, User, Zap, Activity, Info, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AgentsPageV2() {
    return (
        <main className="v2-root min-h-screen pt-24 px-6 pb-12 flex flex-col gap-8 max-w-[1600px] mx-auto overflow-x-hidden">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight claude-gradient-text">Agent Intelligence Stream</h1>
                    <div className="flex items-center gap-4 text-claude-text-muted text-sm">
                        <span className="flex items-center gap-1.5"><Activity size={14} className="text-claude-accent" /> 102,400 active entities</span>
                        <span className="w-1 h-1 bg-claude-border rounded-full" />
                        <span className="flex items-center gap-1.5"><Zap size={14} className="text-yellow-500" /> 98.2% healthy</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-claude-text-muted" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Agents (ID, Type)..." 
                            className="bg-white/5 border border-claude-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-claude-accent transition-colors w-64"
                        />
                    </div>
                    <ClaudeButton variant="secondary" className="px-3 py-2">
                        <Filter size={16} />
                    </ClaudeButton>
                    <ClaudeButton variant="primary" className="px-4 py-2 text-sm">
                        Deploy New Swarm
                    </ClaudeButton>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
                {/* Side: Fleet Analytics */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
                    <div className="grid grid-cols-2 gap-4">
                        <StatusCard label="Active Units" value="84,210" trend="+2.4%" />
                        <StatusCard label="Mean Latency" value="12ms" trend="-0.5%" />
                    </div>

                    <ClaudeCard className="flex-1 overflow-hidden flex flex-col bg-claude-surface/40">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-claude-text-primary">Live Real-time stream</h3>
                            <button className="text-claude-accent hover:underline text-xs">Clear logs</button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {[...Array(20)].map((_, i) => (
                                <AgentRow key={i} index={i} />
                            ))}
                        </div>
                    </ClaudeCard>
                </div>

                {/* Main: Spatial Distribution */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full">
                    <ClaudeCard variant="glass" className="flex-1 p-0 relative overflow-hidden">
                        <MapPlaceholder />
                        {/* Overlay Controls */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <MapTool active icon={<Activity size={16} />} />
                           <MapTool icon={<User size={16} />} />
                           <MapTool icon={<Truck size={16} />} />
                        </div>
                    </ClaudeCard>
                    
                    <div className="grid grid-cols-3 gap-6">
                        <MetricBar label="Network Load" value={0.72} color="claude-accent" />
                        <MetricBar label="Thermal Index" value={0.45} color="blue-400" />
                        <MetricBar label="SCM Consistency" value={0.94} color="green-400" />
                    </div>
                </div>
            </div>
        </main>
    );
}

function StatusCard({ label, value, trend }: { label: string, value: string, trend: string }) {
    return (
        <ClaudeCard className="py-4 px-5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-claude-text-muted block mb-1">{label}</span>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">{value}</span>
                <span className={`text-[10px] font-mono ${trend.startsWith('+') ? 'text-green-400' : 'text-blue-400'}`}>{trend}</span>
            </div>
        </ClaudeCard>
    );
}

function AgentRow({ index }: { index: number }) {
    const types = [
        { icon: Truck, label: 'Logistics', color: 'text-blue-400' },
        { icon: User, label: 'Commuter', color: 'text-claude-accent' },
        { icon: Cpu, label: 'Service', color: 'text-slate-400' }
    ];
    const type = types[index % 3];
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-claude-border transition-all group">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-white/5 ${type.color}`}>
                    <type.icon size={16} />
                </div>
                <div>
                    <div className="text-sm font-bold text-white font-mono uppercase tracking-tighter">Unit-{(3412 + index).toString(16).toUpperCase()}</div>
                    <div className="text-[10px] text-claude-text-muted font-bold uppercase tracking-widest">{type.label}</div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                <div className="text-xs font-mono text-white/80">{(20 + Math.random() * 40).toFixed(1)} <span className="text-[10px] text-claude-text-muted">m/s</span></div>
                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-claude-accent" style={{ width: `${60 + Math.random() * 40}%` }} />
                </div>
            </div>
        </div>
    );
}

function MapTool({ active, icon }: { active?: boolean, icon: React.ReactNode }) {
    return (
        <button className={`p-3 rounded-xl border transition-all ${active ? 'bg-claude-accent border-claude-accent text-white shadow-xl shadow-claude-accent/20' : 'bg-claude-surface/80 backdrop-blur-md border-claude-border text-claude-text-muted hover:text-white hover:bg-claude-surface-light'}`}>
            {icon}
        </button>
    );
}

function MetricBar({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <ClaudeCard className="py-3 px-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-claude-text-muted">{label}</span>
                <span className="text-xs font-mono">{(value * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-${color}`} style={{ width: `${value * 100}%` }} />
            </div>
        </ClaudeCard>
    );
}
