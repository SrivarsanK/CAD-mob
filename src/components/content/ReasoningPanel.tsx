"use client";

import { useState } from "react";
import { generateAgentReasoning } from "@/app/actions";
import GlassCard from "../ui/GlassCard";
import MagneticButton from "../ui/MagneticButton";
import { Brain, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReasoningPanel() {
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleReasoning = async () => {
    setIsLoading(true);
    setSteps([]);
    try {
      // For demo, we use user_88 which we seeded
      const result = await generateAgentReasoning("user_88");
      setSteps(result);
    } catch (error) {
      console.error("Reasoning failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto !bg-black/40 backdrop-blur-2xl border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-purple-400">
          <Brain size={20} />
          <h4 className="font-semibold text-white">AgentMove Reasoning</h4>
        </div>
        <MagneticButton
          onClick={handleReasoning}
          className="bg-purple-600/20 text-purple-200 text-xs px-3 py-1 border-purple-500/30"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" size={14} /> : "Run Engine"}
        </MagneticButton>
      </div>

      <div className="space-y-3 min-h-[150px]">
        <AnimatePresence mode="popLayout">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm p-2 rounded bg-white/5 border border-white/5 text-gray-300"
            >
              <span className="text-purple-500 mr-2">›</span>
              {step}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!isLoading && steps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 text-sm italic">
            <p>Ready to simulate mobility reasoning.</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
