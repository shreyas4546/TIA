import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Info, TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { InfoTooltip } from "./ui/InfoTooltip";
import { spendingData, categoryData, weeklyData } from "../mock/data";
import { fadeInScaleVariants, slideUpVariants } from "../utils/animations";
import { PredictionGraph } from "./PredictionGraph";
import { AIAnalysisReveal } from "./AIAnalysisReveal";
import { GlassCard } from "./ui/GlassCard";

const COLORS = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B"];

export function Dashboard() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#0B0F19]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-purple/10 via-[#0B0F19] to-[#0B0F19]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 text-white">
              Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan">Overview</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Real-time insights and AI-powered predictions.
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-sm text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                Live Data
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Line Chart */}
          <motion.div
            variants={fadeInScaleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6 h-full flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-accent-purple" />
                    Monthly Spending Trend
                    <InfoTooltip content="A historical view of your spending over the last 7 months." position="right">
                      <Info className="w-4 h-4 text-gray-500 hover:text-white cursor-help transition-colors" />
                    </InfoTooltip>
                  </h3>
                  <p className="text-sm text-gray-400">Your expenses over the last 7 months</p>
                </div>
                <div className="px-3 py-1 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple rounded-full text-sm font-medium shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                  +12% vs last year
                </div>
              </div>
              <div className="h-[300px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendingData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "rgba(11, 15, 25, 0.9)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", backdropFilter: "blur(10px)" }}
                      itemStyle={{ color: "#8B5CF6" }}
                      cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#8B5CF6" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: "#0B0F19", stroke: "#8B5CF6", strokeWidth: 2 }} 
                      activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col"
          >
            <GlassCard className="p-6 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-white">
                  <PieChartIcon className="w-5 h-5 text-accent-blue" />
                  Category Distribution
                  <InfoTooltip content="Breakdown of your spending by category." position="right">
                    <Info className="w-4 h-4 text-gray-500 hover:text-white cursor-help transition-colors" />
                  </InfoTooltip>
                </h3>
                <p className="text-sm text-gray-400">Where your money goes</p>
              </div>
              <div className="h-[250px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      animationDuration={1500}
                      animationBegin={200}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "rgba(11, 15, 25, 0.9)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", backdropFilter: "blur(10px)" }}
                      itemStyle={{ color: "#fff" }}
                      formatter={(value) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white block">Total</span>
                    <span className="text-xs text-gray-400">Expenses</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-3">
                {categoryData.slice(0, 4).map((category, index) => (
                  <div key={category.name} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}80` }} />
                    <span className="text-gray-300">{category.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Prediction Graph */}
          <div className="lg:col-span-2 h-full min-h-[400px]">
            <AIAnalysisReveal className="h-full">
              <PredictionGraph />
            </AIAnalysisReveal>
          </div>

          {/* Bar Chart */}
          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col"
          >
            <GlassCard className="p-6 h-full flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-accent-cyan" />
                    Weekly Spending
                    <InfoTooltip content="Daily breakdown of your spending." position="right">
                      <Info className="w-4 h-4 text-gray-500 hover:text-white cursor-help transition-colors" />
                    </InfoTooltip>
                  </h3>
                  <p className="text-sm text-gray-400">Daily expenses</p>
                </div>
                <div className="text-xl font-bold text-white tracking-tight">$1,475</div>
              </div>
              <div className="h-[200px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{ backgroundColor: "rgba(11, 15, 25, 0.9)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", backdropFilter: "blur(10px)" }}
                      itemStyle={{ color: "#3B82F6" }}
                    />
                    <Bar 
                      dataKey="spent" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={1500}
                      animationBegin={400}
                    >
                      {weeklyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === weeklyData.length - 1 ? "#06B6D4" : "#3B82F6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

