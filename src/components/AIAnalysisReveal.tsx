import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, ScanLine, Sparkles } from "lucide-react";

interface AIAnalysisRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function AIAnalysisReveal({ children, className = "" }: AIAnalysisRevealProps) {
  const [step, setStep] = useState<"analyzing" | "processing" | "complete">("analyzing");
  const [currentKeyword, setCurrentKeyword] = useState(0);

  const keywords = [
    "Spending Patterns",
    "Subscription Analysis",
    "Risk Detection",
    "Budget Forecast"
  ];

  useEffect(() => {
    // Step 1: Analyzing (2 seconds)
    const analyzeTimer = setTimeout(() => {
      setStep("processing");
    }, 2000);

    return () => clearTimeout(analyzeTimer);
  }, []);

  useEffect(() => {
    if (step === "processing") {
      // Step 2: Processing Keywords (rapid cycling)
      const interval = setInterval(() => {
        setCurrentKeyword(prev => {
          if (prev >= keywords.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setStep("complete");
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 500); // Switch every 500ms

      return () => clearInterval(interval);
    }
  }, [step, keywords.length]);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <AnimatePresence mode="wait">
        {step !== "complete" ? (
          <motion.div
            key="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 glass-card flex flex-col items-center justify-center z-20 overflow-hidden bg-[#0B0F19]/95 backdrop-blur-xl border border-white/10"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-purple/10 via-transparent to-transparent opacity-50" />
            
            {/* Scanning Line */}
            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-accent-cyan/10 to-transparent w-full pointer-events-none"
            >
              <div className="absolute bottom-0 left-0 right-0 h-px bg-accent-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            </motion.div>

            {/* Central Animation */}
            <div className="relative mb-12">
              {/* Rotating Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border border-accent-purple/30 border-t-accent-purple border-l-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 rounded-full border border-accent-blue/20 border-b-accent-blue border-r-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />

              {/* Pulsing Core */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 w-20 h-20 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>

              {/* Orbiting Particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent-cyan rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  animate={{
                    x: [Math.cos(i * 2) * 60, Math.cos(i * 2 + Math.PI) * 60],
                    y: [Math.sin(i * 2) * 60, Math.sin(i * 2 + Math.PI) * 60],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Text Content */}
            <div className="h-16 flex flex-col items-center justify-center relative z-10">
              <AnimatePresence mode="wait">
                {step === "analyzing" ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="text-accent-cyan font-mono text-sm tracking-widest uppercase flex items-center gap-2">
                      <ScanLine className="w-4 h-4 animate-pulse" />
                      Analyzing Data
                    </p>
                    <div className="flex gap-1 mt-2">
                      <motion.div animate={{ height: [4, 12, 4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1 bg-accent-purple rounded-full" />
                      <motion.div animate={{ height: [4, 16, 4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.1 }} className="w-1 bg-accent-purple rounded-full" />
                      <motion.div animate={{ height: [4, 10, 4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1 bg-accent-purple rounded-full" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={keywords[currentKeyword]}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Processing</p>
                    <h3 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-cyan to-white">
                      {keywords[currentKeyword]}
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
