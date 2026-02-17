import GlassCard from "@/components/ui/GlassCard";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import { Cpu, RotateCcw, Truck, User, Zap } from "lucide-react";

export default function AgentsPage() {
    return (
        <main className="pt-24 px-8 pb-12 w-full max-w-7xl mx-auto space-y-8 h-screen flex flex-col">
            <header className="space-y-4 shrink-0">
                <h1 className="text-4xl font-light tracking-tight text-white">Active Agents</h1>
                <p className="text-white/60 max-w-2xl">
                    Real-time status of 102,400 simulated autonomous agents.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Agent Stats & List */}
                <div className="flex flex-col gap-6 lg:col-span-1 h-full overflow-hidden">
                    <GlassCard className="space-y-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-white/80">Fleet Health</h3>
                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                <Zap size={14} /> 98% Optimal
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-3">
                                <span className="block text-2xl font-light text-white">84k</span>
                                <span className="text-xs text-white/40">Active</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <span className="block text-2xl font-light text-white">18k</span>
                                <span className="text-xs text-white/40">Idling</span>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-sm font-medium text-white/80 mb-4 shrink-0">Agent Stream</h3>
                        <div className="overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-purple-500/20 text-purple-300">
                                            {i % 3 === 0 ? <Truck size={14} /> : i % 3 === 1 ? <User size={14} /> : <Cpu size={14} />}
                                        </div>
                                        <div>
                                            <div className="text-sm text-white font-mono">AGT-{1000 + i}</div>
                                            <div className="text-xs text-white/40">{i % 3 === 0 ? 'Delivery Drone' : i % 3 === 1 ? 'Pedestrian' : 'Traffic Node'}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-right">
                                        <div className="text-white/60">{(Math.random() * 10).toFixed(1)} km/h</div>
                                        <div className="text-green-400">{90 + Math.floor(Math.random() * 10)}% Bat</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Map View */}
                <div className="lg:col-span-2 h-full">
                    <MapPlaceholder />
                </div>
            </div>
        </main>
    );
}
