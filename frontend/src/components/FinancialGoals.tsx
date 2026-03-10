import { motion } from "motion/react";
import { Target, Plus, Calendar, ChevronRight } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { GlowButton } from "./ui/GlowButton";
import { goalsData as initialGoalsData } from "../mock/data";
import { fadeInScaleVariants } from "../utils/animations";
import { useCurrency } from "../contexts/CurrencyContext";
import { useAuth } from "../contexts/AuthContext";

export function FinancialGoals() {
  const { formatAmount } = useCurrency();
  const { userData } = useAuth();

  // Inject the user's explicit onboarding goal at the top
  const goalsData = userData && userData.onboardingComplete
    ? [
      {
        id: "user-goal",
        name: userData.financialGoal,
        target: userData.monthlySavingsTarget,
        current: 0, // In a real app we'd calculate this from transactions
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        color: "#8B5CF6"
      },
      ...initialGoalsData.slice(1) // Replace the first mock goal with user goal
    ]
    : initialGoalsData;

  return (
    <motion.div
      variants={fadeInScaleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-col h-full"
    >
      <GlassCard className="h-full flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-foreground">
              <Target className="w-5 h-5 text-accent-purple" />
              Financial Goals
            </h3>
            <p className="text-sm text-muted-foreground">Track your progress towards targets</p>
          </div>
          <GlowButton variant="ghost" size="sm" className="!p-2 !rounded-full">
            <Plus className="w-4 h-4" />
          </GlowButton>
        </div>

        <div className="space-y-6 flex-1">
          {goalsData.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="group cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-accent-purple transition-colors">
                      {goal.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      {formatAmount(goal.current)} <span className="text-muted-foreground font-normal">/ {formatAmount(goal.target)}</span>
                    </div>
                    <div className="text-[10px] font-medium text-accent-purple uppercase tracking-wider">
                      {progress.toFixed(0)}% Complete
                    </div>
                  </div>
                </div>

                <div className="relative h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: progress / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 right-0 rounded-full origin-left"
                    style={{
                      backgroundColor: goal.color,
                      boxShadow: `0 0 10px ${goal.color}40`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <button className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            <span>View all goals</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
