import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Activity, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { InfoTooltip } from "./ui/InfoTooltip";
import { fadeInScaleVariants, rotateAppearVariants, slideUpVariants } from "../utils/animations";
import { FinancialRiskMeter } from "./FinancialRiskMeter";

const predictionData = [
  { month: "Jan", actual: 4000, predicted: null },
  { month: "Feb", actual: 3000, predicted: null },
  { month: "Mar", actual: 2000, predicted: null },
  { month: "Apr", actual: 2780, predicted: null },
  { month: "May", actual: 1890, predicted: null },
  { month: "Jun", actual: 2390, predicted: 2390 }, // Connection point
  { month: "Jul", actual: null, predicted: 3490 },
  { month: "Aug", actual: null, predicted: 3200 },
  { month: "Sep", actual: null, predicted: 2800 },
];

const sparklineData = [
  { value: 40 },
  { value: 30 },
  { value: 45 },
  { value: 50 },
  { value: 65 },
  { value: 60 },
  { value: 80 },
  { value: 85 },
];

export function WowFeatures() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax effect for the background
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={ref} className="py-12 bg-brand-surface/30 relative z-10 overflow-hidden" id="wow-features">
      {/* Parallax Background Element */}
      <motion.div 
        style={{ y }}
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideUpVariants}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            AI <span className="text-gradient">Intelligence</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Advanced predictive models and real-time risk assessment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Animated AI Prediction Graph */}
          <motion.div
            variants={fadeInScaleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="glass-card p-6 lg:col-span-2 flex flex-col"
          >
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent-purple" />
                  AI Spending Forecast
                  <InfoTooltip content="Predicts your future spending based on historical data and current trends." position="right">
                    <Info className="w-4 h-4 text-gray-500 hover:text-white cursor-help transition-colors" />
                  </InfoTooltip>
                </h3>
                <p className="text-sm text-gray-400">Predictive modeling for the next 3 months</p>
              </div>
              <div className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-sm font-medium animate-pulse">
                Live Prediction
              </div>
            </div>
            <div className="h-[300px] w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="8" stroke="#8B5CF6" strokeWidth="2" strokeOpacity="0.2" />
                    </pattern>
                  </defs>
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0B0F19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                  <Area type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#diagonalHatch)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">

            {/* Live Financial Risk Meter */}
            <motion.div
              variants={rotateAppearVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-50" />
              <h3 className="text-xl font-semibold mb-1 flex items-center gap-2 w-full">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Risk Meter
                <InfoTooltip content="Evaluates your current financial exposure and market volatility." position="right">
                  <Info className="w-4 h-4 text-gray-500 hover:text-white cursor-help transition-colors ml-auto" />
                </InfoTooltip>
              </h3>
              <p className="text-sm text-gray-400 w-full mb-8">Real-time financial exposure</p>
              
              <FinancialRiskMeter score={45} />
            </motion.div>

            {/* AI Spending Score */}
            <motion.div
              variants={rotateAppearVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="glass-card p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-cyan" />
                AI Spending Score
                <InfoTooltip content="A composite score out of 100 indicating your overall financial health." position="right">
                  <Info className="w-4 h-4 text-gray-500 hover:text-white cursor-help transition-colors" />
                </InfoTooltip>
              </h3>
              <p className="text-sm text-gray-400 mb-6">Your financial health metric</p>
              
              <div className="flex items-center justify-between">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      whileInView={{ strokeDashoffset: 251.2 - (251.2 * 0.85) }} // 85% score
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">85</span>
                  </div>
                </div>
                
                <div className="flex-1 ml-6">
                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineData}>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0B0F19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "12px", padding: "4px 8px" }}
                          itemStyle={{ color: "#06B6D4" }}
                          cursor={false}
                          labelFormatter={() => ""}
                        />
                        <Line type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#06B6D4" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-accent-cyan font-medium mt-2 text-right flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" /> +12 pts this month
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
