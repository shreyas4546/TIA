import { useState, useEffect, useRef } from "react";
import { motion, Variants } from "motion/react";
import { ArrowRight, Sparkles, ChevronDown, Activity, CreditCard, DollarSign, TrendingUp, PieChart, Shield, Zap, Target, BarChart2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlowButton } from "./ui/GlowButton";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

const floatingIcons = [
  { Icon: DollarSign, size: 24, x: 15, y: 20, delay: 0 },
  { Icon: CreditCard, size: 32, x: 80, y: 15, delay: 1 },
  { Icon: TrendingUp, size: 28, x: 10, y: 60, delay: 2 },
  { Icon: PieChart, size: 20, x: 85, y: 70, delay: 0.5 },
  { Icon: Shield, size: 36, x: 25, y: 80, delay: 1.5 },
  { Icon: Zap, size: 24, x: 75, y: 40, delay: 2.5 },
  { Icon: Target, size: 28, x: 90, y: 85, delay: 0.8 },
  { Icon: BarChart2, size: 32, x: 5, y: 35, delay: 1.2 },
  { Icon: Briefcase, size: 24, x: 65, y: 85, delay: 2.2 },
  { Icon: Activity, size: 28, x: 35, y: 10, delay: 0.3 },
];

export function Hero() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20; // max 20px offset
      const y = (clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Staggered animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20, mass: 0.5 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent-purple/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent-blue/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-accent-cyan/10 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
          color: 'var(--color-foreground)'
        }}
      />

      {/* Floating Icons (Parallax) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Fallback for no-js */}
        <noscript>
          {floatingIcons.map((item, i) => (
            <div
              key={`fallback-${i}`}
              className="absolute text-muted-foreground/20"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <item.Icon size={item.size} />
            </div>
          ))}
        </noscript>

        {floatingIcons.map((item, i) => {
          const parallaxX = mousePosition.x * (i % 2 === 0 ? 1 : -1) * (item.size / 20);
          const parallaxY = mousePosition.y * (i % 2 === 0 ? 1 : -1) * (item.size / 20);

          return (
            <motion.div
              key={i}
              className="absolute text-muted-foreground/20"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
              animate={{
                x: parallaxX,
                y: parallaxY,
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                x: { type: "spring", stiffness: 50, damping: 20 },
                y: { type: "spring", stiffness: 50, damping: 20 },
                rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <item.Icon size={item.size} />
            </motion.div>
          );
        })}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border mb-8 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-muted-foreground">Introducing AI Financial Intelligence</span>
          </motion.div>

          <div className="relative inline-block mb-6">
            {/* Premium Gradient Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] -z-20 opacity-60 pointer-events-none blur-[60px] mix-blend-screen"
              style={{
                background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, transparent 70%)",
                transform: "translate(-50%, -50%) translateZ(0)",
              }}
            />

            {/* Semi-opaque glass backdrop for text contrast */}
            <div className="absolute -inset-4 bg-background/30 backdrop-blur-md rounded-3xl -z-10 blur-xl" />

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight relative z-10 text-foreground">
              {t("hero.title")}
            </motion.h1>
          </div>

          <motion.div variants={itemVariants} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed relative z-10 space-y-2">
            <p className="bg-background/30 backdrop-blur-[2px] rounded-lg px-2 py-1 inline-block">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 mb-16">
            {user ? (
              <GlowButton
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto"
              >
                Launch Dashboard
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </GlowButton>
            ) : (
              <GlowButton
                onClick={() => openAuthModal()}
                className="w-full sm:w-auto"
              >
                Sign In to Launch
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </GlowButton>
            )}

            <GlowButton
              variant="secondary"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto"
            >
              {t("hero.learnMore")}
            </GlowButton>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
            onClick={() => {
              document.getElementById('hologram-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-sm font-medium">See your AI financial hologram below</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

