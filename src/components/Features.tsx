import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PieChart, Shield, Target, LineChart, Info } from "lucide-react";
import { features } from "../mock/data";
import { InfoTooltip } from "./ui/InfoTooltip";
import { slideUpVariants, staggerContainerVariants } from "../utils/animations";

const iconMap = {
  "pie-chart": PieChart,
  "shield": Shield,
  "target": Target,
  "line-chart": LineChart,
};

export function Features() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax effect for the background
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="py-24 relative z-10 overflow-hidden" id="features">
      {/* Parallax Background Element */}
      <motion.div 
        style={{ y }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideUpVariants}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Smart <span className="text-gradient">Capabilities</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our platform leverages advanced AI to automate your financial life and protect your assets.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={feature.title}
                variants={slideUpVariants}
                whileHover={{ y: -10, scale: 1.03 }}
                className="glass-card p-8 flex flex-col items-center text-center group transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                  {feature.title}
                  <InfoTooltip content={`Learn more about ${feature.title} and how it can help you.`}>
                    <Info className="w-4 h-4 text-gray-500 hover:text-white cursor-help transition-colors" />
                  </InfoTooltip>
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
