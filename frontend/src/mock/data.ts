export const spendingData = [
  { 
    name: "Jan", 
    amount: 2400,
    transactions: [
      { id: "t1", date: "2026-01-05", category: "Housing", amount: 1200 },
      { id: "t2", date: "2026-01-12", category: "Food", amount: 450 },
      { id: "t3", date: "2026-01-20", category: "Transport", amount: 150 },
      { id: "t4", date: "2026-01-28", category: "Entertainment", amount: 600 }
    ]
  },
  { 
    name: "Feb", 
    amount: 1398,
    transactions: [
      { id: "t5", date: "2026-02-05", category: "Housing", amount: 1200 },
      { id: "t6", date: "2026-02-14", category: "Food", amount: 198 }
    ]
  },
  { 
    name: "Mar", 
    amount: 9800,
    transactions: [
      { id: "t7", date: "2026-03-05", category: "Housing", amount: 1200 },
      { id: "t8", date: "2026-03-10", category: "Travel", amount: 7500 },
      { id: "t9", date: "2026-03-22", category: "Food", amount: 1100 }
    ]
  },
  { 
    name: "Apr", 
    amount: 3908,
    transactions: [
      { id: "t10", date: "2026-04-05", category: "Housing", amount: 1200 },
      { id: "t11", date: "2026-04-12", category: "Food", amount: 800 },
      { id: "t12", date: "2026-04-18", category: "Shopping", amount: 1908 }
    ]
  },
  { 
    name: "May", 
    amount: 4800,
    transactions: [
      { id: "t13", date: "2026-05-05", category: "Housing", amount: 1200 },
      { id: "t14", date: "2026-05-15", category: "Food", amount: 600 },
      { id: "t15", date: "2026-05-20", category: "Entertainment", amount: 3000 }
    ]
  },
  { 
    name: "Jun", 
    amount: 3800,
    transactions: [
      { id: "t16", date: "2026-06-05", category: "Housing", amount: 1200 },
      { id: "t17", date: "2026-06-10", category: "Transport", amount: 400 },
      { id: "t18", date: "2026-06-25", category: "Food", amount: 2200 }
    ]
  },
  { 
    name: "Jul", 
    amount: 4300,
    transactions: [
      { id: "t19", date: "2026-07-05", category: "Housing", amount: 1200 },
      { id: "t20", date: "2026-07-12", category: "Food", amount: 900 },
      { id: "t21", date: "2026-07-20", category: "Shopping", amount: 2200 }
    ]
  },
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

export const goalsData = [
  {
    id: 1,
    name: "New Car",
    target: 35000,
    current: 12500,
    deadline: "2026-12-31",
    color: "#8B5CF6", // Purple
  },
  {
    id: 2,
    name: "Emergency Fund",
    target: 10000,
    current: 8200,
    deadline: "2026-06-30",
    color: "#06B6D4", // Cyan
  },
  {
    id: 3,
    name: "Vacation",
    target: 5000,
    current: 1500,
    deadline: "2026-08-15",
    color: "#3B82F6", // Blue
  },
];

export const mockNotifications = [
  {
    id: "1",
    title: "Upcoming Bill",
    message: "Your credit card payment of $450 is due in 3 days.",
    type: "warning",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: "2",
    title: "Goal Milestone",
    message: "You've reached 80% of your Emergency Fund goal!",
    type: "success",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
  },
  {
    id: "3",
    title: "Unusual Spending",
    message: "We noticed a $120 charge at 'Coffee Shop'. Is this correct?",
    type: "info",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
  },
];
