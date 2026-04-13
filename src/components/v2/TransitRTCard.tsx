"use client";

import { useEffect, useState } from "react";
import ClaudeCard from "../ui/v2/ClaudeCard";
import { Train, Bus, Activity, MapPin } from "lucide-react";

export default function TransitRTCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransit() {
      try {
        const res = await fetch("/api/transit");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Failed to fetch transit data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransit();
    const interval = setInterval(fetchTransit, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <ClaudeCard className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Activity className="animate-spin text-claude-accent" size={24} />
          <span className="text-xs text-claude-text-muted font-mono uppercase tracking-widest">Hydrating RT-Feed...</span>
        </div>
      </ClaudeCard>
    );
  }

  const vehicles = data?.vehiclePositions || [];
  const updates = data?.tripUpdates || [];

  return (
    <ClaudeCard className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Train className="text-claude-accent" size={18} />
          <h3 className="font-bold text-white">Live Telemetry</h3>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-claude-accent/10 text-[10px] text-claude-accent font-mono border border-claude-accent/20">GTFS-RT</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        {updates.slice(0, 5).map((update: any, idx: number) => (
          <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-claude-accent/20 transition-all group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-claude-accent transition-colors">Line {update.trip?.routeId || '?' }</span>
              <span className="text-[10px] font-mono text-claude-text-muted italic">{update.trip?.tripId}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin size={10} className="text-claude-text-muted" />
                <span className="text-[10px] text-claude-text-secondary truncate">
                  Next: {update.stopTimeUpdate?.[0]?.stopId || 'Unknown'}
                </span>
                <span className={`ml-auto text-[10px] font-bold ${update.stopTimeUpdate?.[0]?.arrival?.delay > 60 ? 'text-red-400' : 'text-green-400'}`}>
                    {update.stopTimeUpdate?.[0]?.arrival?.delay > 60 ? `+${Math.round(update.stopTimeUpdate[0].arrival.delay/60)}m` : 'On Time'}
                </span>
            </div>
          </div>
        ))}

        {vehicles.length > 0 && (
            <div className="pt-2 border-t border-white/5">
                <div className="text-[10px] text-claude-text-muted uppercase tracking-widest mb-2 font-mono">Active Vehicles</div>
                <div className="flex flex-wrap gap-2">
                   {vehicles.slice(0, 8).map((v: any, i: number) => (
                       <div key={i} className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/70 border border-white/5">
                           ID:{v.vehicle?.id?.slice(-4)}
                       </div>
                   ))}
                </div>
            </div>
        )}
      </div>
    </ClaudeCard>
  );
}
