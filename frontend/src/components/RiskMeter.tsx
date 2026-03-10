import { motion, useReducedMotion } from "motion/react";

interface RiskMeterProps {
  score: number; // 0 to 100
  className?: string;
}

export function RiskMeter({ score, className = "" }: RiskMeterProps) {
  const shouldReduceMotion = useReducedMotion();
  const isAnimationActive = !shouldReduceMotion;

  // Clamp score between 0 and 100
  const clampedScore = Math.min(Math.max(score, 0), 100);

  // Determine risk level and color properties
  let riskLevel = "Low";
  let color = "#10B981"; // Green
  let glowColor = "rgba(16, 185, 129, 0.4)";

  if (clampedScore > 33 && clampedScore <= 66) {
    riskLevel = "Moderate";
    color = "#F59E0B"; // Yellow
    glowColor = "rgba(245, 158, 11, 0.4)";
  } else if (clampedScore > 66) {
    riskLevel = "High";
    color = "#EF4444"; // Red
    glowColor = "rgba(239, 68, 68, 0.4)";
  }

  // Calculate rotation: 0 -> -90deg, 100 -> 90deg
  const rotation = (clampedScore / 100) * 180 - 90;

  return (
    <div 
      className={`relative flex flex-col items-center justify-center ${className}`}
      role="meter"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${riskLevel} Risk`}
      aria-label="Financial Risk Meter"
    >
      {/* Pulsing Glow Background */}
      <motion.div
        className="absolute w-48 h-48 rounded-full blur-3xl -z-10"
        animate={isAnimationActive ? {
          backgroundColor: glowColor,
          opacity: [0.1, 0.3, 0.1],
          scale: [0.8, 1.2, 0.8],
        } : {
          backgroundColor: glowColor,
          opacity: 0.2,
          scale: 1,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative w-64 h-32 overflow-hidden">
        {/* Gauge Segments */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <defs>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          
          {/* Background Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="16"
            strokeLinecap="round"
            className="opacity-20"
          />

          {/* Colored Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#meterGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={isAnimationActive ? 251.2 - (251.2 * clampedScore) / 100 : 0}
            className="transition-all duration-1000 ease-out"
            style={!isAnimationActive ? { strokeDashoffset: 251.2 - (251.2 * clampedScore) / 100 } : undefined}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-[85%] bg-foreground origin-bottom z-10 rounded-full"
          initial={isAnimationActive ? { rotate: -90, x: "-50%" } : { rotate: rotation, x: "-50%" }}
          animate={{ rotate: rotation, x: "-50%" }}
          transition={isAnimationActive ? { type: "spring", stiffness: 60, damping: 15 } : { duration: 0 }}
        >
          {/* Needle Head */}
          <div className="w-3 h-3 bg-foreground rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </motion.div>

        {/* Pivot */}
        <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-card border-4 border-foreground rounded-full -translate-x-1/2 translate-y-1/2 z-20 shadow-lg" />
      </div>

      {/* Score Text */}
      <div className="text-center mt-6 z-10">
        <motion.div
          key={clampedScore}
          initial={isAnimationActive ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold font-display tracking-tight drop-shadow-lg"
          style={{ color }}
        >
          {clampedScore}
        </motion.div>
        <div className="text-sm font-medium uppercase tracking-widest text-muted-foreground mt-1">
          {riskLevel} Risk
        </div>
      </div>
    </div>
  );
}
