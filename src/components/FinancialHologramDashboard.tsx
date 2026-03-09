import React from "react";
import { motion } from "motion/react";
import { hologramData } from "../mock/hologram";

export interface FinancialHologramDashboardProps {
  isAnimated?: boolean;
  className?: string;
}

export function FinancialHologramDashboard({ 
  isAnimated = true,
  className = ""
}: FinancialHologramDashboardProps) {
  const shouldAnimate = isAnimated;

  return (
    <div className={`relative w-full max-w-md mx-auto aspect-square flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        <defs>
          <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Ring - Slow rotation */}
        <motion.circle
          cx="200" cy="200" r="180"
          fill="none" stroke="url(#holoGradient)" strokeWidth="2"
          strokeDasharray="10 20"
          animate={shouldAnimate ? { rotate: 360 } : {}}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px", willChange: "transform" }}
        />

        {/* Middle Ring - Counter rotation and pulse */}
        <motion.circle
          cx="200" cy="200" r="140"
          fill="none" stroke="#8B5CF6" strokeWidth="4"
          strokeDasharray="100 40"
          animate={shouldAnimate ? { rotate: -360, scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] } : {}}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ transformOrigin: "200px 200px", willChange: "transform, opacity" }}
          filter="url(#glow)"
        />

        {/* Inner Ring - Fast rotation */}
        <motion.circle
          cx="200" cy="200" r="100"
          fill="none" stroke="#06B6D4" strokeWidth="1"
          strokeDasharray="4 4"
          animate={shouldAnimate ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px", willChange: "transform" }}
        />

        {/* Center Content */}
        <g textAnchor="middle" dominantBaseline="middle">
          <text x="200" y="165" fill="#94A3B8" fontSize="14" letterSpacing="2" className="font-sans uppercase">
            Total Balance
          </text>
          <text x="200" y="205" fill="#FFFFFF" fontSize="38" fontWeight="bold" className="font-display" filter="url(#glow)">
            ${hologramData.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </text>
          <text x="200" y="245" fill="#10B981" fontSize="14" className="font-sans font-medium tracking-wide">
            +{hologramData.monthlySpending.toLocaleString()} / mo
          </text>
        </g>
      </svg>
    </div>
  );
}
