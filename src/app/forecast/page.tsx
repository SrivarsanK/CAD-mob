import GlassCard from "@/components/ui/GlassCard";
import { ArrowUpRight, Calendar, TrendingUp } from "lucide-react";

export default function ForecastPage() {
    return (
        <main className="pt-24 px-8 pb-12 w-full max-w-7xl mx-auto space-y-8">
            <header className="space-y-4 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-white">Predictive Forecast</h1>
                    <p className="text-white/60 max-w-2xl">
                        AI-driven mobility predictions for the next 24 hours.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm">
                    <Calendar size={16} /> Select Date Range
                </button>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Predicted Congestion", value: "+12%", trend: "up", color: "text-red-400" },
                    { label: "Transit Efficiency", value: "94%", trend: "stable", color: "text-green-400" },
                    { label: "Avg Commute Time", value: "24m", trend: "down", color: "text-green-400" },
                    { label: "Carbon Output", value: "Low", trend: "stable", color: "text-blue-400" },
                ].map((stat, i) => (
                    <GlassCard key={i} className="flex flex-col gap-1">
                        <span className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-light text-white">{stat.value}</span>
                            <ArrowUpRight size={18} className={`${stat.color} mb-1`} />
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Main Chart Placeholder */}
            <GlassCard className="h-[400px] flex items-center justify-center relative group overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-between px-12 py-12 opacity-50 space-x-2">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="w-full bg-purple-500/20 rounded-t-sm transition-all duration-1000 group-hover:bg-purple-500/40"
                            style={{ height: `${20 + Math.random() * 60}%` }}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <TrendingUp size={48} className="text-white/20" />
                    <span className="text-white/40 font-mono text-sm">Forecast Visualization Loading...</span>
                </div>
            </GlassCard>
        </main>
    );
}
