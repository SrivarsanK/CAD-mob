import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import { Circle, Globe, LayoutGrid, Search } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 glass-panel rounded-full px-8 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse-glow" />
                <span className="text-lg font-semibold tracking-tight">CAD-Mob</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                <Link href="/forecast" className="hover:text-white transition-colors">Forecast</Link>
                <Link href="/agents" className="hover:text-white transition-colors">Agents</Link>
                <Link href="/city-map" className="hover:text-white transition-colors">City Map</Link>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Search size={20} className="stroke-[1.5]" />
                </button>
                <MagneticButton className="px-5 py-2 text-sm bg-white/10 border-none hover:bg-white/20">
                    Connect
                </MagneticButton>
            </div>
        </nav>
    );
}
