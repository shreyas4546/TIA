import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Info, CheckCircle2 } from "lucide-react";
import { InfoTooltip } from "./ui/InfoTooltip";
import { fadeInScaleVariants } from "../utils/animations";
import { GlassCard } from "./ui/GlassCard";
import predictionsData from "../mock/predictions.json";
import { generateForecast } from "../utils/forecast";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Find if we are hovering over a predicted point
    const predictedPayload = payload.find((p: any) => p.dataKey === "predicted");
    const actualPayload = payload.find((p: any) => p.dataKey === "actual");
    
    const isPredicted = !!predictedPayload && predictedPayload.value != null;
    const value = isPredicted ? predictedPayload.value : actualPayload?.value;
    
    if (value == null) return null;

    return (
      <div className="p-4 border border-border rounded-xl shadow-xl bg-card/90 backdrop-blur-md">
        <p className="text-muted-foreground text-xs mb-1">{label}</p>
        <p className="text-lg font-bold text-foreground mb-2">
          ${value?.toLocaleString()}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <div 
            className={`w-2 h-2 rounded-full ${isPredicted ? "bg-accent-cyan animate-pulse" : "bg-accent-purple"}`} 
          />
          <span className={isPredicted ? "text-accent-cyan font-medium" : "text-accent-purple"}>
            {isPredicted ? "AI Forecast" : "Historical Data"}
          </span>
        </div>
        {isPredicted && (
          <p className="text-xs text-muted-foreground mt-2 max-w-[150px] leading-relaxed">
            Projected based on seasonal trends and recurring expenses.
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function PredictionGraph() {
  const shouldReduceMotion = useReducedMotion();
  const isAnimationActive = !shouldReduceMotion;

  const data = useMemo(() => {
    return generateForecast(predictionsData, ["Sep", "Oct", "Nov", "Dec"]);
  }, []);

  return (
    <motion.div
      variants={fadeInScaleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="h-full"
    >
      <GlassCard className="flex flex-col h-full relative overflow-hidden">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-foreground">
              AI Spending Prediction
              <InfoTooltip content="AI-powered forecast of your future spending based on historical patterns." position="right">
                <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
              </InfoTooltip>
            </h3>
            <p className="text-sm text-muted-foreground mb-2">Forecast for the next 4 months</p>
            
            {/* Confidence Micro-Animation */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isAnimationActive ? 2.5 : 0, duration: 0.5 }}
              className="flex items-center gap-3 bg-accent-cyan/5 border border-accent-cyan/20 rounded-lg px-3 py-1.5 w-fit"
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-accent-cyan">
                <CheckCircle2 className="w-3 h-3" />
                <span>Confidence: 87%</span>
              </div>
              <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0.87 }}
                  transition={{ delay: isAnimationActive ? 2.8 : 0, duration: 1, ease: "easeOut" }}
                  className="h-full w-full bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)] origin-left"
                />
              </div>
            </motion.div>
          </div>

          <div className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan rounded-full text-sm font-medium animate-pulse flex items-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
            </span>
            AI Active
          </div>
        </div>

        <div className="h-[300px] w-full mt-auto relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)" 
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)" 
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-border)", strokeWidth: 2 }} />
              
              {/* Forecast Band */}
              <Area 
                type="monotone" 
                dataKey={["forecastMin", "forecastMax"] as any} 
                stroke="none" 
                fill="url(#colorBand)" 
                isAnimationActive={isAnimationActive}
                animationBegin={1500}
                animationDuration={2000}
                animationEasing="ease-out"
              />

              {/* Historical Data Line */}
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorActual)" 
                isAnimationActive={isAnimationActive}
                animationDuration={1500}
                animationEasing="ease-in-out"
                activeDot={{ r: 6, fill: "var(--color-background)", stroke: "#8B5CF6", strokeWidth: 2 }}
              />
              
              {/* Predicted Data Line */}
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#06B6D4" 
                strokeWidth={3} 
                strokeDasharray="5 5" 
                fillOpacity={1} 
                fill="url(#colorPredicted)" 
                isAnimationActive={isAnimationActive}
                animationBegin={1500}
                animationDuration={2000}
                animationEasing="ease-out"
                style={{ filter: "url(#glow)" }}
                activeDot={{ r: 8, fill: "#06B6D4", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}
