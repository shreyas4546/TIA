import { Variants, useReducedMotion } from "motion/react";
import { useMemo } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const staggerList: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
};

export const pulseCTA: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const hoverLift: Variants = {
  initial: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
  hover: { 
    y: -5, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Helper to respect reduced motion
export const getVariants = (shouldReduceMotion: boolean, variants: Variants): Variants => {
  if (shouldReduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.1 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
      initial: { opacity: 1 },
      hover: { opacity: 1 },
      tap: { opacity: 1 },
      pulse: { opacity: 1 }
    };
  }
  return variants;
};

export function useMotionVariants() {
  const shouldReduceMotion = useReducedMotion();

  return useMemo(() => ({
    fadeUp: getVariants(!!shouldReduceMotion, fadeUp),
    staggerList: getVariants(!!shouldReduceMotion, staggerList),
    pulseCTA: getVariants(!!shouldReduceMotion, pulseCTA),
    hoverLift: getVariants(!!shouldReduceMotion, hoverLift),
  }), [shouldReduceMotion]);
}
