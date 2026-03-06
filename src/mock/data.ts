export const spendingData = [
  { name: "Jan", amount: 2400 },
  { name: "Feb", amount: 1398 },
  { name: "Mar", amount: 9800 },
  { name: "Apr", amount: 3908 },
  { name: "May", amount: 4800 },
  { name: "Jun", amount: 3800 },
  { name: "Jul", amount: 4300 },
];

export const categoryData = [
  { name: "Housing", value: 35 },
  { name: "Food", value: 20 },
  { name: "Transport", value: 15 },
  { name: "Subscriptions", value: 10 },
  { name: "Entertainment", value: 20 },
];

export const weeklyData = [
  { day: "Mon", spent: 120 },
  { day: "Tue", spent: 85 },
  { day: "Wed", spent: 210 },
  { day: "Thu", spent: 90 },
  { day: "Fri", spent: 340 },
  { day: "Sat", spent: 450 },
  { day: "Sun", spent: 180 },
];

export const aiInsights = [
  {
    id: 1,
    type: "anomaly",
    title: "Spending Anomaly Detected",
    description: "Your weekend spending was 45% higher than your average. Most of it went to 'Entertainment'.",
    action: "Review Transactions",
    icon: "alert-triangle",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: 2,
    type: "optimization",
    title: "Subscription Optimization",
    description: "You have 3 inactive subscriptions costing $45/month. Canceling them could save you $540/year.",
    action: "Manage Subscriptions",
    icon: "zap",
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
  },
  {
    id: 3,
    type: "forecast",
    title: "Budget Forecast Alert",
    description: "At your current run rate, you will exceed your 'Food' budget by $120 in 5 days.",
    action: "Adjust Budget",
    icon: "trending-up",
    color: "text-accent-purple",
    bg: "bg-accent-purple/10",
  },
];

export const features = [
  {
    title: "AI Expense Analysis",
    description: "Automatically categorize and analyze your spending patterns with machine learning.",
    icon: "pie-chart",
  },
  {
    title: "Fraud Detection",
    description: "Real-time anomaly detection flags suspicious transactions before they clear.",
    icon: "shield",
  },
  {
    title: "Smart Budgeting",
    description: "Dynamic budgets that adjust to your lifestyle and financial goals automatically.",
    icon: "target",
  },
  {
    title: "Predictive Cashflow",
    description: "Forecast your future balance based on recurring bills and income patterns.",
    icon: "line-chart",
  },
];
