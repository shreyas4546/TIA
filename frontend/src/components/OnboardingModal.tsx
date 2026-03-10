import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { GlowButton } from "./ui/GlowButton";
import { Target, TrendingUp, User as UserIcon, DollarSign, Briefcase, BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../contexts/CurrencyContext";

export function OnboardingModal() {
    const { userData, updateUserData } = useAuth();
    const { setCurrency } = useCurrency();
    const { t } = useTranslation();

    const [financialGoal, setFinancialGoal] = useState("Build wealth through asset accumulation");
    const [monthlySpending, setMonthlySpending] = useState("1500");
    const [monthlyIncome, setMonthlyIncome] = useState("5000");
    const [nickname, setNickname] = useState("");
    const [currencyPreference, setCurrencyPreference] = useState(userData?.preferences?.currency || "USD");
    const [professionalStatus, setProfessionalStatus] = useState("Professional");
    const [investmentExperience, setInvestmentExperience] = useState("Beginner");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!userData || userData.onboardingComplete) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateUserData({
                nickname,
                financialGoal,
                monthlySpending: Number(monthlySpending),
                monthlyIncome: Number(monthlyIncome),
                professionalStatus,
                investmentExperience,
                preferences: {
                    ...userData.preferences,
                    currency: currencyPreference
                },
                onboardingComplete: true
            });
            // Sync with global Currency Context state locally
            setCurrency(currencyPreference as any);
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-card border border-border rounded-3xl p-8 w-full max-w-lg shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden"
                >
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                            Welcome to Tia
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            To build your personalized financial intelligence dashboard, we need a few professional metrics.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[60vh] md:max-h-[70vh]">
                            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar pb-4">

                                {/* Nickname Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-accent-purple" />
                                        Nick Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="w-full bg-surface-hover/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all placeholder:text-muted-foreground/50"
                                        placeholder="What should we call you?"
                                    />
                                </div>

                                {/* Goal Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Target className="w-4 h-4 text-accent-cyan" />
                                        Primary Financial Goal
                                    </label>
                                    <select
                                        value={financialGoal}
                                        onChange={(e) => setFinancialGoal(e.target.value)}
                                        className="w-full bg-surface-hover/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="Build wealth through asset accumulation">Build wealth through asset accumulation</option>
                                        <option value="Optimize tax efficiency">Optimize tax efficiency</option>
                                        <option value="Achieve FIRE (Financial Independence, Retire Early)">Achieve FIRE</option>
                                        <option value="Capital preservation">Capital preservation</option>
                                        <option value="Venture / High-risk investing">Venture / High-risk investing</option>
                                    </select>
                                </div>

                                {/* Professional Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-accent-purple" />
                                        Professional Status
                                    </label>
                                    <select
                                        value={professionalStatus}
                                        onChange={(e) => setProfessionalStatus(e.target.value)}
                                        className="w-full bg-surface-hover/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Professional">Professional</option>
                                        <option value="Freelancer">Freelancer</option>
                                        <option value="Business Owner">Business Owner</option>
                                        <option value="Retired">Retired</option>
                                    </select>
                                </div>

                                {/* Investment Experience */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4 text-accent-cyan" />
                                        Investment Experience
                                    </label>
                                    <select
                                        value={investmentExperience}
                                        onChange={(e) => setInvestmentExperience(e.target.value)}
                                        className="w-full bg-surface-hover/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="Beginner">Beginner (Just starting out)</option>
                                        <option value="Intermediate">Intermediate (Have some investments)</option>
                                        <option value="Advanced">Advanced (Active trader/investor)</option>
                                    </select>
                                </div>

                                {/* Currency Preference */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-accent-purple" />
                                        Preferred Currency
                                    </label>
                                    <select
                                        value={currencyPreference}
                                        onChange={(e) => setCurrencyPreference(e.target.value)}
                                        className="w-full bg-surface-hover/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="USD">USD ($) - US Dollar</option>
                                        <option value="EUR">EUR (€) - Euro</option>
                                        <option value="GBP">GBP (£) - British Pound</option>
                                        <option value="INR">INR (₹) - Indian Rupee</option>
                                        <option value="JPY">JPY (¥) - Japanese Yen</option>
                                    </select>
                                </div>

                                {/* Monthly Income Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-accent-purple" />
                                        Estimated Monthly Income
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                            {currencyPreference === 'USD' ? '$' : currencyPreference === 'EUR' ? '€' : currencyPreference === 'GBP' ? '£' : currencyPreference === 'INR' ? '₹' : '¥'}
                                        </span>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={monthlyIncome}
                                            onChange={(e) => setMonthlyIncome(e.target.value)}
                                            className="w-full bg-surface-hover/50 border border-border rounded-xl pl-8 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="5000"
                                        />
                                    </div>
                                </div>

                                {/* Monthly Target Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-accent-cyan" />
                                        Estimated Monthly Spending
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                            {currencyPreference === 'USD' ? '$' : currencyPreference === 'EUR' ? '€' : currencyPreference === 'GBP' ? '£' : currencyPreference === 'INR' ? '₹' : '¥'}
                                        </span>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={monthlySpending}
                                            onChange={(e) => setMonthlySpending(e.target.value)}
                                            className="w-full bg-surface-hover/50 border border-border rounded-xl pl-8 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="1500"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">You can change this anytime later.</p>
                                </div>
                            </div>

                            <div className="pt-6 mt-4 border-t border-border">
                                <GlowButton
                                    type="submit"
                                    className="w-full justify-center py-4 text-base"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Generating Dashboard..." : "Complete Setup"}
                                </GlowButton>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
