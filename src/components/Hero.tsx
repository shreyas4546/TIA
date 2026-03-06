import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LiquidEffectAnimation } from "./ui/liquid-effect-animation";
import { GlowButton } from "./ui/GlowButton";

export function Hero() {
  const navigate = useNavigate();

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.5 }
    },
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-brand-bg"
    >
      <LiquidEffectAnimation />
      
      {/* Dark overlay to match website theme */}
      <div className="absolute inset-0 bg-brand-bg/80 z-0 pointer-events-none" />

      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)'
        }}
      />

      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-surface/50 backdrop-blur-sm border border-brand-border mb-8 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-gray-300">Introducing AI Financial Intelligence</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
            Smarter Money Decisions with <span className="text-gradient">AI Intelligence</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track spending, analyze behavior, and receive predictive insights to optimize your financial future automatically.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GlowButton 
              onClick={() => navigate("/dashboard#assistant")} 
              className="w-full sm:w-auto"
            >
              Start Analysis 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </GlowButton>
            
            <GlowButton 
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto"
            >
              View Dashboard
            </GlowButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

