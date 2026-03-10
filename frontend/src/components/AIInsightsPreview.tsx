import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, Zap, Sparkles } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";

const insights = [
  {
    title: "Spending Anomaly",
    description: "Unusual $450 transaction detected at Amazon yesterday.",
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  {
    title: "Budget Forecast",
    description: "You're on track to save $1,200 (+15%) next month.",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    title: "Subscription Waste",
    description: "Unused gym membership ($50/mo) identified.",
    icon: Zap,
    color: "text-accent-purple",
    bg: "bg-accent-purple/10",
    border: "border-accent-purple/20",
  },
];

export function AIInsightsPreview() {
  return (
    <section className="py-12 relative z-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-4">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-medium text-accent-cyan uppercase tracking-wider">Live Preview</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            AI Insights <span className="text-muted-foreground">at a Glance</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GlassCard className="h-full flex flex-col items-start gap-4 group hover:bg-card/80 transition-colors">
                  <div className="flex w-full justify-between items-start">
                    <div className={`p-3 rounded-xl ${insight.bg} ${insight.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-accent-cyan transition-colors">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                  
                  {/* Progress bar or metric visual */}
                  <div className="w-full mt-auto pt-4">
                    <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full origin-left ${insight.color.replace('text-', 'bg-')}`}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 0.7 }}
                        transition={{ delay: 0.5 + (index * 0.1), duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
