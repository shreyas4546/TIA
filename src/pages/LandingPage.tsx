import { motion, Variants } from "motion/react";
import { Hero } from "../components/Hero";
import { AIInsightsPreview } from "../components/AIInsightsPreview";
import { Insights } from "../components/Insights";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

export function LandingPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <main>
        <Hero />
        <AIInsightsPreview />
        <Insights />
        <Features />
      </main>
      
      <Footer />
    </motion.div>
  );
}
