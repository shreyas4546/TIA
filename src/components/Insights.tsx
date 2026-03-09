import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { AlertTriangle, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { aiInsights } from "../mock/data";
import { slideUpVariants, staggerContainerVariants, lineDrawVariants } from "../utils/animations";
import { GlassCard } from "./ui/GlassCard";
import { useCurrency } from "../contexts/CurrencyContext";

const iconMap = {
  "alert-triangle": AlertTriangle,
  "zap": Zap,
  "trending-up": TrendingUp,
};

export function Insights() {
  const ref = useRef(null);
  const { formatAmount } = useCurrency();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax effect for the background
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="py-24 relative z-10 overflow-hidden" id="insights">
      {/* Parallax Background Element */}
      <motion.div 
        style={{ y }}
        className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideUpVariants}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-foreground">
            AI <span className="text-gradient">Insights</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our machine learning models analyze your spending patterns to provide actionable recommendations.
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated Connecting Line (Timeline effect) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 hidden md:block z-0">
            <motion.svg 
              className="w-full h-full" 
              preserveAspectRatio="none" 
              viewBox="0 0 100 2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.line 
                x1="0" y1="1" x2="100" y2="1" 
                stroke="url(#gradient-line)" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
                variants={lineDrawVariants}
              />
              <defs>
                <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
                  <stop offset="50%" stopColor="rgba(139, 92, 246, 0.5)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
          >
            {aiInsights.map((insight) => {
              const Icon = iconMap[insight.icon as keyof typeof iconMap];
              return (
                <GlassCard
                  key={insight.id}
                  variants={slideUpVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="flex flex-col h-full group cursor-pointer transition-all relative"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${insight.bg}`}>
                    <Icon className={`w-6 h-6 ${insight.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{insight.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                    {insight.description.replace(/\$(\d+)/g, (_, amount) => formatAmount(Number(amount)))}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-medium text-accent-cyan group-hover:text-accent-purple transition-colors mt-auto">
                    {insight.action} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
