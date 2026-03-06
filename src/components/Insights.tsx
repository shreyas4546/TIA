import { motion } from "motion/react";
import { AlertTriangle, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { aiInsights } from "../mock/data";

const iconMap = {
  "alert-triangle": AlertTriangle,
  "zap": Zap,
  "trending-up": TrendingUp,
};

export function Insights() {
  return (
    <section className="py-24 relative z-10" id="insights">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            AI <span className="text-gradient">Insights</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our machine learning models analyze your spending patterns to provide actionable recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiInsights.map((insight, index) => {
            const Icon = iconMap[insight.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-6 flex flex-col h-full group cursor-pointer transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${insight.bg}`}>
                  <Icon className={`w-6 h-6 ${insight.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{insight.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                  {insight.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-medium text-accent-cyan group-hover:text-accent-purple transition-colors mt-auto">
                  {insight.action} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
