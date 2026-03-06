import { motion, HTMLMotionProps } from "motion/react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className = "", hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative overflow-hidden
        bg-[#0B0F19]/60 backdrop-blur-xl
        border border-white/5
        rounded-2xl
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none
        after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-white/10 after:pointer-events-none
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
