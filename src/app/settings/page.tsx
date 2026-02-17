import GlassCard from "@/components/ui/GlassCard";
import { Bell, Eye, Lock, Shield, Sliders } from "lucide-react";

export default function SettingsPage() {
    return (
        <main className="pt-24 px-8 pb-12 w-full max-w-7xl mx-auto space-y-8">
            <header className="space-y-4">
                <h1 className="text-4xl font-light tracking-tight text-white">Settings</h1>
                <p className="text-white/60 max-w-2xl">
                    Configure your preferences for the CAD-Mob spatial intelligence platform.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="space-y-6">
                    <div className="flex items-center gap-3 text-white/80 mb-4">
                        <Sliders size={20} />
                        <h2 className="text-lg font-medium">General</h2>
                    </div>

                    <div className="space-y-4">
                        <SettingToggle label="Real-time Updates" description="Stream live telemetry from city sensors" active />
                        <SettingToggle label="High Contrast Mode" description="Increase visibility for accessibility" />
                        <SettingToggle label="Developer Mode" description="Show debug metrics and raw data streams" />
                    </div>
                </GlassCard>

                <GlassCard className="space-y-6">
                    <div className="flex items-center gap-3 text-white/80 mb-4">
                        <Bell size={20} />
                        <h2 className="text-lg font-medium">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <SettingToggle label="Traffic Alerts" description="Get notified about congestion anomalies" active />
                        <SettingToggle label="System Health" description="Alerts for sensor downtime or API errors" active />
                        <SettingToggle label="Prediction Reports" description="Daily summary of mobility forecasts" />
                    </div>
                </GlassCard>

                <GlassCard className="space-y-6">
                    <div className="flex items-center gap-3 text-white/80 mb-4">
                        <Shield size={20} />
                        <h2 className="text-lg font-medium">Privacy & Security</h2>
                    </div>

                    <div className="space-y-4">
                        <SettingToggle label="Anonymize Data" description="Remove PII from displayed datasets" active />
                        <SettingToggle label="Audit Logs" description="Record all actions for compliance" active />
                    </div>
                </GlassCard>
            </div>
        </main>
    );
}

function SettingToggle({ label, description, active = false }: { label: string, description: string, active?: boolean }) {
    return (
        <div className="flex items-start justify-between group">
            <div className="space-y-1">
                <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{label}</div>
                <div className="text-xs text-white/40">{description}</div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-purple-500/50' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
            </div>
        </div>
    );
}
