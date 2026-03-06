import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { LiquidEffectAnimation } from "./ui/liquid-effect-animation";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  targetOpacity: number;
}

const COLORS = ["#8B5CF6", "#3B82F6", "#06B6D4"]; // Purple, Blue, Cyan

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const numParticles = 30;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.4 + 0.1,
        targetOpacity: 0,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around smoothly
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Mouse interaction
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          p.x -= dx * force * 0.003;
          p.y -= dy * force * 0.003;
          p.targetOpacity = 1.0;
        } else {
          p.targetOpacity = 0.4;
        }

        // Smooth opacity transition
        p.opacity += (p.targetOpacity - p.opacity) * 0.05;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 25;
        ctx.shadowColor = p.color;
        ctx.fill();
        
        // Reset global alpha and shadow for next drawing operations
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 50, damping: 15 }
    },
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#0B0F19]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <LiquidEffectAnimation />

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

      {/* Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none"
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
            <Link to="/dashboard#assistant" className="neon-button flex items-center gap-2 w-full sm:w-auto justify-center group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Start Analysis 
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </span>
            </Link>
            <Link to="/dashboard" className="px-6 py-3 rounded-xl bg-brand-surface/50 backdrop-blur-sm border border-brand-border text-white font-medium hover:bg-brand-surface-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-accent-blue/50 transition-all w-full sm:w-auto">
              View Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
