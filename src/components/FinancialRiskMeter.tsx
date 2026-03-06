import { motion } from "motion/react";

interface FinancialRiskMeterProps {
  score: number; // 0 to 100
  className?: string;
}

export function FinancialRiskMeter({ score, className = "" }: FinancialRiskMeterProps) {
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
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Pulsing Glow Background */}
      <motion.div
        className="absolute w-48 h-48 rounded-full blur-3xl -z-10"
        animate={{
          backgroundColor: glowColor,
          opacity: [0.1, 0.3, 0.1],
          scale: [0.8, 1.2, 0.8],
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
          {/* Low Risk Segment (Green) */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 30.72"
            fill="none"
            stroke="#10B981"
            strokeWidth="16"
            strokeLinecap="butt"
            className={`transition-opacity duration-500 ${riskLevel === "Low" ? "opacity-100" : "opacity-20"}`}
          />
          
          {/* Moderate Risk Segment (Yellow) */}
          <path
            d="M 62 29 A 80 80 0 0 1 138 29"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="16"
            strokeLinecap="butt"
            className={`transition-opacity duration-500 ${riskLevel === "Moderate" ? "opacity-100" : "opacity-20"}`}
          />

          {/* High Risk Segment (Red) */}
          <path
            d="M 140 30.72 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#EF4444"
            strokeWidth="16"
            strokeLinecap="butt"
            className={`transition-opacity duration-500 ${riskLevel === "High" ? "opacity-100" : "opacity-20"}`}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-[85%] bg-white origin-bottom z-10 rounded-full"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          style={{ x: "-50%" }}
        >
          {/* Needle Head */}
          <div className="w-3 h-3 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </motion.div>

        {/* Pivot */}
        <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-[#1F2937] border-4 border-white rounded-full -translate-x-1/2 translate-y-1/2 z-20 shadow-lg" />
      </div>

      {/* Score Text */}
      <div className="text-center mt-6 z-10">
        <motion.div
          key={clampedScore}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold font-display tracking-tight drop-shadow-lg"
          style={{ color }}
        >
          {clampedScore}
        </motion.div>
        <div className="text-sm font-medium uppercase tracking-widest text-gray-400 mt-1">
          {riskLevel} Risk
        </div>
      </div>
    </div>
  );
}
