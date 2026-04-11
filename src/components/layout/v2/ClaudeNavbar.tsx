"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Compass, Users, Settings, Search, Bell } from "lucide-react";
import ClaudeButton from "@/components/ui/v2/ClaudeButton";

export default function ClaudeNavbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: "/forecast", label: "Forecast", icon: Compass },
        { href: "/agents", label: "Agents", icon: Users },
        { href: "/city-map", label: "City Map", icon: LayoutDashboard },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between claude-glass rounded-2xl px-6 py-3 border border-white/5">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl claude-accent-gradient flex items-center justify-center shadow-lg shadow-claude-accent/20 transition-transform group-hover:scale-110 duration-500">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-claude-text-primary">CAD-Mob</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                className={`
                                    relative px-4 py-2 text-sm font-medium transition-colors rounded-lg
                                    ${isActive ? 'text-white' : 'text-claude-text-secondary hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon size={16} strokeWidth={ isActive ? 2.5 : 2 } />
                                    {link.label}
                                </span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="nav-active"
                                        className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-claude-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <Search size={20} />
                    </button>
                    <button className="p-2 text-claude-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <Bell size={20} />
                    </button>
                    <div className="w-px h-6 bg-claude-border mx-1" />
                    <ClaudeButton variant="primary" className="px-4 py-2 text-sm">
                        Contact Sales
                    </ClaudeButton>
                </div>
            </div>
        </nav>
    );
}
