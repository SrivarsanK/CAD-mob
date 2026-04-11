"use client";

import ClaudeHero from "@/components/content/v2/ClaudeHero";
import ClaudeCard from "@/components/ui/v2/ClaudeCard";
import ClaudeButton from "@/components/ui/v2/ClaudeButton";
import { Globe2, Layers, Cpu, Database, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeV2() {
    return (
        <main className="v2-root min-h-screen px-6 pb-24 selection:bg-claude-accent/30 selection:text-white overflow-x-hidden">

            {/* Mesh Gradient Background */}
            <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-claude-accent/10 blur-[150px] opacity-40 rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] opacity-40 rounded-full" />
            </div>

            <ClaudeHero />

            <section className="max-w-7xl mx-auto py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureItem 
                        icon={<Globe2 size={24} />} 
                        title="Urban Intelligence" 
                        description="Access real-time mobility telemetry from over 120 global metropolises with millisecond latency."
                    />
                    <FeatureItem 
                        icon={<Layers size={24} />} 
                        title="Multi-Modal Synthesis" 
                        description="Seamlessly blend pedestrian, vehicular, and mass transit vectors into a single unified latent space."
                    />
                    <FeatureItem 
                        icon={<Cpu size={24} />} 
                        title="Causal Reasoning" 
                        description="Beyond correlation. Our SCM engine explains 'why' patterns shift using Pearlian do-calculus."
                    />
                </div>
            </section>

            <section className="max-w-7xl mx-auto py-24 border-t border-claude-border">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight claude-gradient-text">
                            A Command Center for <br /> Future Cities
                        </h2>
                        <p className="text-lg text-claude-text-secondary leading-relaxed">
                            Intervene in simulation loops to test infrastructure changes. Visualize the ripple effects of bridge closures, utility maintenance, or zoning overrides before they happen.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <ClaudeButton variant="primary">Launch City Map</ClaudeButton>
                            <ClaudeButton variant="secondary">View API Docs</ClaudeButton>
                        </div>
                    </div>
                    <div className="flex-1 w-full grid grid-cols-2 gap-4">
                        <ClaudeCard className="space-y-4">
                            <Activity className="text-claude-accent" size={20} />
                            <div className="text-2xl font-bold text-white">99.9%</div>
                            <div className="text-sm text-claude-text-muted font-mono uppercase tracking-widest">Inference Accuracy</div>
                        </ClaudeCard>
                        <ClaudeCard className="space-y-4">
                            <Database className="text-blue-400" size={20} />
                            <div className="text-2xl font-bold text-white">1.2B</div>
                            <div className="text-sm text-claude-text-muted font-mono uppercase tracking-widest">Data Vectors/Day</div>
                        </ClaudeCard>
                    </div>
                </div>
            </section>
        </main>
    );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <ClaudeCard className="relative group overflow-hidden border-transparent hover:border-claude-border/50">
            <div className="p-3 rounded-xl bg-claude-accent/10 text-claude-accent w-fit group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mt-6">{title}</h3>
            <p className="mt-4 text-claude-text-secondary leading-relaxed">
                {description}
            </p>
            <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-claude-accent/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </ClaudeCard>
    );
}
