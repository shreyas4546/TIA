import { motion, Variants } from "motion/react";
import { Dashboard } from "../components/Dashboard";
import { WowFeatures } from "../components/WowFeatures";
import { ChatPanel } from "../components/ChatPanel";
import { Footer } from "../components/Footer";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

export function DashboardPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <main className="pt-20 min-h-screen flex flex-col">
        <div className="flex-1">
          <Dashboard />
          <WowFeatures />
          <ChatPanel />
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
