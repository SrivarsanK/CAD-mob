"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ClaudeButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
}

export default function ClaudeButton({ 
    children, 
    onClick, 
    className = "", 
    variant = "primary",
    disabled = false
}: ClaudeButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        const { clientX, clientY } = e;
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const xPos = (clientX - (rect.left + rect.width / 2)) * 0.35;
            const yPos = (clientY - (rect.top + rect.height / 2)) * 0.35;
            x.set(xPos);
            y.set(yPos);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const variants = {
        primary: "bg-claude-accent text-white shadow-lg shadow-claude-accent/20 hover:bg-claude-accent/90",
        secondary: "bg-white/5 border border-claude-border text-claude-text-primary hover:bg-white/10 hover:border-claude-border-hover",
        ghost: "bg-transparent text-claude-text-secondary hover:text-claude-text-primary hover:bg-white/5"
    };

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            style={{ x: mouseXSpring, y: mouseYSpring }}
            whileTap={!disabled ? { scale: 0.96 } : {}}
            className={`
                relative px-6 py-2.5 rounded-lg font-medium transition-all duration-300 
                flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]} ${className}
            `}
        >
            {children}
        </motion.button>
    );
}
