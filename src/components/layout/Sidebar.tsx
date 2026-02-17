import Link from "next/link";
import { BarChart3, Database, Home, Settings, Users } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6 glass-panel rounded-full py-6 px-3">
            <NavLink href="/" icon={<Home size={22} />} label="Home" />
            <div className="w-8 h-[1px] bg-white/10 mx-auto" />
            <NavLink href="/dashboard" icon={<BarChart3 size={22} />} label="Analytics" />
            <NavLink href="/agents" icon={<Users size={22} />} label="Agents" />
            <NavLink href="/data" icon={<Database size={22} />} label="Data" />
            <div className="w-8 h-[1px] bg-white/10 mx-auto" />
            <NavLink href="/settings" icon={<Settings size={22} />} label="Settings" />
        </aside>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 relative group"
            aria-label={label}
        >
            {icon}
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white text-xs py-1 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
            </span>
        </Link>
    );
}
