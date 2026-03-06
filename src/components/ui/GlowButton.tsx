import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "../../utils/cn";

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glowColor?: string;
  className?: string;
  children: React.ReactNode;
}

export function GlowButton({
  variant = "primary",
  size = "md",
  glowColor = "#8B5CF6", // Default purple
  className,
  children,
  ...props
}: GlowButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_0_rgba(139,92,246,0.6)] border border-white/10",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/5 backdrop-blur-md",
    outline: "bg-transparent border border-accent-purple/50 text-accent-purple hover:bg-accent-purple/10 hover:border-accent-purple",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {/* Glow effect for primary buttons */}
      {variant === "primary" && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
