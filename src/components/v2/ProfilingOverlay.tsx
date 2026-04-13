"use client";

import { useEffect, useState } from "react";
import { Cpu, Zap, Activity } from "lucide-react";

export default function ProfilingOverlay() {
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const update = () => {
      frameCount++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
        setLatency(Math.floor(Math.random() * 5) + 10); // Simulated model latency
      }
      requestAnimationFrame(update);
    };

    const handle = requestAnimationFrame(update);
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex gap-3 pointer-events-none">
      <MetricBox icon={<Zap size={10} className="text-yellow-400" />} label="FPS" value={fps} />
      <MetricBox icon={<Cpu size={10} className="text-blue-400" />} label="LATENCY" value={`${latency}ms`} />
      <MetricBox icon={<Activity size={10} className="text-claude-accent" />} label="MEMORY" value="242MB" />
    </div>
  );
}

function MetricBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="px-2 py-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg flex items-center gap-2">
      {icon}
      <div className="flex flex-col">
        <span className="text-[8px] text-white/40 font-mono tracking-tighter leading-none">{label}</span>
        <span className="text-[10px] text-white font-mono font-bold leading-none">{value}</span>
      </div>
    </div>
  );
}
