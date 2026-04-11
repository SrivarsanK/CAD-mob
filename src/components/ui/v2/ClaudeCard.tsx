"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ClaudeCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    variant?: "default" | "glass";
}

export default function ClaudeCard({ 
    children, 
    className = "", 
    variant = "default",
    ...props 
}: ClaudeCardProps) {
    const variantClass = variant === "glass" ? "claude-glass" : "claude-card";
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`${variantClass} rounded-xl p-6 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
