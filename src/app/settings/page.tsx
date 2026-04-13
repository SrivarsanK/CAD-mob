"use client";

import ClaudeCard from "@/components/ui/v2/ClaudeCard";
import { Bell, Eye, Lock, Shield, Sliders, Database, Globe } from "lucide-react";
import { useState } from "react";

export default function SettingsPageV2() {
    return (
        <main className="v2-root min-h-screen pt-24 px-8 pb-12 w-full max-w-7xl mx-auto space-y-12">
            <header className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-white claude-gradient-text">Configuration</h1>
                <p className="text-claude-text-secondary max-w-2xl leading-relaxed">
                    Orchestrate your TrajBench environment. Managed settings for UMR fusion, dataset indexing, and API connectivity.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ClaudeCard className="space-y-8">
                    <div className="flex items-center gap-3 text-white mb-4">
                        <Sliders size={20} className="text-claude-accent" />
                        <h2 className="text-lg font-bold">Inference Engine</h2>
                    </div>

                    <div className="space-y-6">
                        <V2SettingToggle label="Real-time Telemetry" description="Enable live GTFS-RT ingestion pipeline" active />
                        <V2SettingToggle label="Unified Latent Fusion" description="Apply joint training across reasoning heads" active />
                        <V2SettingToggle label="Diffusion Re-noising" description="Increase steps for higher trajectory fidelity" />
                    </div>
                </ClaudeCard>

                <ClaudeCard className="space-y-8">
                    <div className="flex items-center gap-3 text-white mb-4">
                        <Database size={20} className="text-blue-400" />
                        <h2 className="text-lg font-bold">Dataset Management</h2>
                    </div>

                    <div className="space-y-6">
                        <V2SettingToggle label="Index Porto Dataset" description="Pre-cache 1.7M taxi trajectories" />
                        <V2SettingToggle label="Persistent Memory" description="Save LLM reasoning kernels after sessions" active />
                        <V2SettingToggle label="Automatic Sampling" description="Downsample high-frequency GPS logs" active />
                    </div>
                </ClaudeCard>

                <ClaudeCard className="space-y-8">
                    <div className="flex items-center gap-3 text-white mb-4">
                        <Shield size={20} className="text-green-400" />
                        <h2 className="text-lg font-bold">Privacy Controls</h2>
                    </div>

                    <div className="space-y-6">
                        <V2SettingToggle label="Differential Privacy" description="Add noise to output trajectory latent vectors" active />
                        <V2SettingToggle label="Spatial Blinding" description="Mask residential coordinates by default" active />
                    </div>
                </ClaudeCard>

                <ClaudeCard className="space-y-8">
                    <div className="flex items-center gap-3 text-white mb-4">
                        <Globe size={20} className="text-purple-400" />
                        <h2 className="text-lg font-bold">Global Context</h2>
                    </div>

                    <div className="space-y-6">
                        <V2SettingToggle label="Urban Ontology" description="Use OpenStreetMap POI categorizations" active />
                        <V2SettingToggle label="Multimodal Sync" description="Correlate vehicle flow with transit schedules" active />
                    </div>
                </ClaudeCard>
            </div>
        </main>
    );
}

function V2SettingToggle({ label, description, active: initialActive = false }: { label: string, description: string, active?: boolean }) {
    const [active, setActive] = useState(initialActive);
    
    return (
        <div 
            className="flex items-start justify-between group cursor-pointer"
            onClick={() => setActive(!active)}
        >
            <div className="space-y-1">
                <div className="text-sm font-bold text-white group-hover:text-claude-accent transition-colors">{label}</div>
                <div className="text-[11px] text-claude-text-muted leading-tight">{description}</div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ease-in-out ${active ? 'bg-claude-accent' : 'bg-white/10 border border-white/5'}`}>
                <div 
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-500 ease-in-out ${active ? 'left-7' : 'left-1'}`} 
                />
            </div>
        </div>
    );
}
