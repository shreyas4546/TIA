import React, { Suspense, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
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
import { Info, TrendingUp, PieChart as PieChartIcon, BarChart3, X } from "lucide-react";
import { InfoTooltip } from "./ui/InfoTooltip";
import { spendingData, categoryData, weeklyData } from "../mock/data";
import { fadeInScaleVariants, slideUpVariants } from "../utils/animations";
import { AIAnalysisReveal } from "./AIAnalysisReveal";
import { FinancialGoals } from "./FinancialGoals";
import { ConnectedAccounts } from "./ConnectedAccounts";
import { GlassCard } from "./ui/GlassCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { useCurrency } from "../contexts/CurrencyContext";

const PredictionGraph = React.lazy(() => import("./PredictionGraph").then(module => ({ default: module.PredictionGraph })));
const FinancialHologramDashboard = React.lazy(() => import("./FinancialHologramDashboard").then(module => ({ default: module.FinancialHologramDashboard })));

const COLORS = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B"];

export function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [isHoloAnimated, setIsHoloAnimated] = useState(true);
  const { formatAmount } = useCurrency();

  return (
    <section className="py-24 relative z-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background transition-colors duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-purple/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 text-foreground">
              Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan">Overview</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Real-time insights and AI-powered predictions.
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
             <CurrencySwitcher />
             <div className="px-4 py-2 rounded-xl bg-card border border-border backdrop-blur-md text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                Live Data
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hologram Dashboard */}
          <motion.div
            variants={fadeInScaleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <GlassCard className="h-full flex flex-col p-6">
              <div className="w-full flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                    <span className={`w-2 h-2 rounded-full ${isHoloAnimated ? 'bg-accent-cyan animate-pulse' : 'bg-muted-foreground'}`} />
                    Core Matrix
                  </h3>
                  <p className="text-sm text-muted-foreground">Live financial state</p>
                </div>
                <button 
                  onClick={() => setIsHoloAnimated(!isHoloAnimated)}
                  className="text-xs px-2 py-1 rounded bg-surface-hover text-muted-foreground hover:text-foreground transition-colors border border-border"
                >
                  {isHoloAnimated ? "Pause" : "Play"}
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <ErrorBoundary>
                  <Suspense fallback={<div className="w-full aspect-square animate-pulse bg-surface-hover rounded-full" />}>
                    <FinancialHologramDashboard isAnimated={isHoloAnimated} />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </GlassCard>
          </motion.div>

          {/* Main Line Chart */}
          <motion.div
            variants={fadeInScaleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2"
          >
            <GlassCard className="h-full flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-foreground">
                    <TrendingUp className="w-5 h-5 text-accent-purple" aria-hidden="true" />
                    Monthly Spending Trend
                    <InfoTooltip content="A historical view of your spending over the last 7 months." position="right">
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" aria-hidden="true" />
                    </InfoTooltip>
                  </h3>
                  <p className="text-sm text-muted-foreground">Your expenses over the last 7 months</p>
                </div>
                <div className="px-3 py-1 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple rounded-full text-sm font-medium shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                  +12% vs last year
                </div>
              </div>
              <div className="h-[300px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={spendingData} 
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    onClick={(state: any) => {
                      if (state && state.activePayload && state.activePayload.length > 0) {
                        setSelectedMonth(state.activePayload[0].payload);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-muted-foreground)" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="var(--color-muted-foreground)" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "12px", color: "var(--color-foreground)", backdropFilter: "blur(10px)" }}
                      itemStyle={{ color: "#8B5CF6" }}
                      cursor={{ stroke: "var(--color-border)", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#8B5CF6" 
                      strokeWidth={3} 
                      dot={{ 
                        r: 4, 
                        fill: "var(--color-background)", 
                        stroke: "#8B5CF6", 
                        strokeWidth: 2,
                        cursor: "pointer",
                        onClick: (e: any, payload: any) => {
                          if (payload && payload.payload) {
                            setSelectedMonth(payload.payload);
                          }
                        }
                      }} 
                      activeDot={{ 
                        r: 8, 
                        fill: "#8B5CF6", 
                        stroke: "var(--color-background)", 
                        strokeWidth: 2,
                        cursor: "pointer",
                        onClick: (e: any, payload: any) => {
                          if (payload && payload.payload) {
                            setSelectedMonth(payload.payload);
                          }
                        }
                      }}
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
            <GlassCard className="h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-foreground">
                  <PieChartIcon className="w-5 h-5 text-accent-blue" aria-hidden="true" />
                  Category Distribution
                  <InfoTooltip content="Breakdown of your spending by category." position="right">
                    <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" aria-hidden="true" />
                  </InfoTooltip>
                </h3>
                <p className="text-sm text-muted-foreground">Where your money goes</p>
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
                      contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "12px", color: "var(--color-foreground)", backdropFilter: "blur(10px)" }}
                      itemStyle={{ color: "var(--color-foreground)" }}
                      formatter={(value) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-foreground block">Total</span>
                    <span className="text-xs text-muted-foreground">Expenses</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-3">
                {categoryData.slice(0, 4).map((category, index) => (
                  <div key={category.name} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}80` }} />
                    <span className="text-muted-foreground">{category.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Prediction Graph */}
          <div className="lg:col-span-2 h-full min-h-[400px]">
            <AIAnalysisReveal className="h-full">
              <ErrorBoundary>
                <Suspense fallback={
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-4 border-accent-cyan/30 border-t-accent-cyan animate-spin" />
                      <p className="text-muted-foreground text-sm">Loading AI Prediction...</p>
                    </div>
                  </div>
                }>
                  <PredictionGraph />
                </Suspense>
              </ErrorBoundary>
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
            <GlassCard className="h-full flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-foreground">
                    <BarChart3 className="w-5 h-5 text-accent-cyan" aria-hidden="true" />
                    Weekly Spending
                    <InfoTooltip content="Daily breakdown of your spending." position="right">
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" aria-hidden="true" />
                    </InfoTooltip>
                  </h3>
                  <p className="text-sm text-muted-foreground">Daily expenses</p>
                </div>
                <div className="text-xl font-bold text-foreground tracking-tight">{formatAmount(1475)}</div>
              </div>
              <div className="h-[200px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--color-muted-foreground)" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="var(--color-muted-foreground)" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                      cursor={{ fill: "var(--color-surface-hover)" }}
                      contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "12px", color: "var(--color-foreground)", backdropFilter: "blur(10px)" }}
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

          {/* Financial Goals */}
          <div className="flex flex-col">
            <FinancialGoals />
          </div>

          {/* Connected Accounts */}
          <div className="flex flex-col lg:col-span-3">
            <ConnectedAccounts />
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedMonth && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedMonth(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="transaction-modal-title"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 id="transaction-modal-title" className="text-xl font-semibold text-foreground">
                      {selectedMonth.name} Transactions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Total: {formatAmount(selectedMonth.amount)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="p-2 hover:bg-surface-hover rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedMonth.transactions?.map((t: any) => (
                    <div key={t.id} className="flex justify-between items-center p-4 rounded-xl bg-surface-hover/50 border border-border/50 hover:bg-surface-hover transition-colors">
                      <div>
                        <p className="font-medium text-foreground">{t.category}</p>
                        <p className="text-sm text-muted-foreground">{t.date}</p>
                      </div>
                      <p className="font-semibold text-foreground">{formatAmount(t.amount)}</p>
                    </div>
                  ))}
                  {(!selectedMonth.transactions || selectedMonth.transactions.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">No transactions found for this month.</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

