import { motion } from "motion/react";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Wallet } from "lucide-react";

import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-[120px]" />
      </div>

      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-1/4 text-accent-cyan/30"
      >
        <Activity size={48} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-1/4 text-accent-purple/30"
      >
        <ShieldCheck size={64} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-1/3 text-accent-blue/30"
      >
        <Wallet size={56} />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-surface border border-brand-border mb-8">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-gray-300">Introducing AI Financial Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
            Smarter Money Decisions with <span className="text-gradient">AI Intelligence</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track spending, analyze behavior, and receive predictive insights to optimize your financial future automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard#assistant" className="neon-button flex items-center gap-2 w-full sm:w-auto justify-center">
              Start Analysis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard" className="px-6 py-3 rounded-xl bg-brand-surface border border-brand-border text-white font-medium hover:bg-brand-surface-hover transition-colors w-full sm:w-auto">
              View Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
