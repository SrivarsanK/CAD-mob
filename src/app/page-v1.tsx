"use client";

import HeroSection from "@/components/content/HeroSection";
import ReasoningPanel from "@/components/content/ReasoningPanel";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight, Globe2, Layers } from "lucide-react";
import { useTransition } from "react";
import { triggerDiffusionModel } from "./actions";

export default function Home() {
  const [isPending, startTransition] = useTransition();

  const handleLaunch = () => {
    startTransition(async () => {
      // Demo coordinates
      await triggerDiffusionModel([40.7128, -74.0060], [40.7588, -73.9851]);
    });
  };

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-24 pb-32">
      {/* Background stays handling by the mesh-gradient-bg in layout.tsx */}
      
      <div className="flex-1 flex items-center justify-center">
        <HeroSection />
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <ReasoningPanel />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-20">
        <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl bg-white/5 border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
              <Globe2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Global Mobility Index</h3>
              <p className="text-sm text-gray-400">Live data from 120+ cities</p>
            </div>
          </div>

          <div className="h-12 w-[1px] bg-white/10 hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Agent Simulations</h3>
              <p className="text-sm text-gray-400">Running 1.2M active agents</p>
            </div>
          </div>

          <div className="hidden md:block">
            <MagneticButton onClick={handleLaunch} className="bg-white text-black hover:shadow-white/20">
              {isPending ? "Processing..." : "Launch Dashboard"} <ArrowRight size={16} />
            </MagneticButton>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
