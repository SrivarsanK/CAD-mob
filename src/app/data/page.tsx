import GlassCard from "@/components/ui/GlassCard";
import { Activity, Database, FileText, Server } from "lucide-react";

export default function DataPage() {
    return (
        <main className="pt-24 px-8 pb-12 w-full max-w-7xl mx-auto space-y-8">
            <header className="space-y-4">
                <h1 className="text-4xl font-light tracking-tight text-white">Data Pipelines</h1>
                <p className="text-white/60 max-w-2xl">
                    Monitor the ingestion and processing of urban mobility data streams.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Stats */}
                <GlassCard className="flex flex-col gap-2">
                    <span className="text-white/40 text-xs uppercase tracking-wider">Total Records</span>
                    <span className="text-3xl font-light text-white">8.4B</span>
                    <div className="flex items-center gap-2 text-green-400 text-xs mt-2">
                        <Activity size={12} />
                        <span>+1.2M last hour</span>
                    </div>
                </GlassCard>
                <GlassCard className="flex flex-col gap-2">
                    <span className="text-white/40 text-xs uppercase tracking-wider">Active Sources</span>
                    <span className="text-3xl font-light text-white">42</span>
                    <div className="flex items-center gap-2 text-white/40 text-xs mt-2">
                        <Server size={12} />
                        <span>All systems operational</span>
                    </div>
                </GlassCard>
                <GlassCard className="flex flex-col gap-2">
                    <span className="text-white/40 text-xs uppercase tracking-wider">Storage Usage</span>
                    <span className="text-3xl font-light text-white">12.8 TB</span>
                    <div className="flex items-center gap-2 text-yellow-400 text-xs mt-2">
                        <span>45% of capacity</span>
                    </div>
                </GlassCard>
            </div>

            {/* Pipelines List */}
            <GlassCard>
                <div className="flex items-center gap-3 text-white/80 mb-6">
                    <Database size={20} />
                    <h2 className="text-lg font-medium">Ingestion Streams</h2>
                </div>

                <div className="space-y-1">
                    <PipelineRow name="NYC Taxi Trip Data" type="Stream" status="Active" latency="45ms" />
                    <PipelineRow name="Subway Turnstile Counts" type="Batch" status="Processing" latency="12m" />
                    <PipelineRow name="CitiBike Real-time" type="Stream" status="Active" latency="120ms" />
                    <PipelineRow name="Weather API (NOAA)" type="API Polling" status="Active" latency="5m" />
                    <PipelineRow name="Bridge Traffic Sensors" type="IoT Stream" status="Maintenance" latency="-" />
                </div>
            </GlassCard>
        </main>
    );
}

function PipelineRow({ name, type, status, latency }: { name: string, type: string, status: string, latency: string }) {
    const isMaintenance = status === 'Maintenance';
    const isProcessing = status === 'Processing';

    return (
        <div className="grid grid-cols-12 gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg items-center">
            <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isMaintenance ? 'bg-red-500' : isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-sm font-medium text-white">{name}</span>
            </div>
            <div className="col-span-3 text-xs text-white/50">{type}</div>
            <div className="col-span-2">
                <span className={`text-xs px-2 py-1 rounded-full ${isMaintenance ? 'bg-red-500/10 text-red-400' :
                        isProcessing ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-green-500/10 text-green-400'
                    }`}>
                    {status}
                </span>
            </div>
            <div className="col-span-2 text-right text-xs text-white/40 font-mono">
                {latency}
            </div>
        </div>
    );
}
