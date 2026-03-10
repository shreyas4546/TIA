import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = "", hoverEffect = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { 
          y: -4, 
          boxShadow: "0 20px 40px -10px rgba(139, 92, 246, 0.15), 0 0 15px rgba(6, 182, 212, 0.2)" 
        } : {}}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`
          relative overflow-hidden
          bg-card/40 backdrop-blur-xl
          border border-border/50
          rounded-2xl
          shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
          p-6
          before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none
          after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-white/10 after:pointer-events-none
          hover:border-accent-purple/30
          transition-colors duration-300
          ${className}
        `}
        {...props}
      >
        {/* Subtle top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
        
        {/* Content */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
