import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    zIndex?: number;
}

export default function GlassCard({ children, className = "", zIndex = 1 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`glass-panel rounded-2xl p-6 ${className}`}
            style={{ zIndex }}
        >
            {children}
        </motion.div>
    );
}
