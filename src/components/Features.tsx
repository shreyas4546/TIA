import { motion } from "motion/react";
import { PieChart, Shield, Target, LineChart } from "lucide-react";
import { features } from "../mock/data";

const iconMap = {
  "pie-chart": PieChart,
  "shield": Shield,
  "target": Target,
  "line-chart": LineChart,
};

export function Features() {
  return (
    <section className="py-24 relative z-10" id="features">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Smart <span className="text-gradient">Capabilities</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our platform leverages advanced AI to automate your financial life and protect your assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="glass-card p-8 flex flex-col items-center text-center group transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
