import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { throttleOnAnimationFrame } from "../../utils/performance";

export function LiquidGlassBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const springConfig = { damping: 50, stiffness: 100, mass: 1 }; // Slower, heavier feel
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const x = useTransform(smoothX, [-1, 1], isMobile ? [-10, 10] : [-30, 30]);
  const y = useTransform(smoothY, [-1, 1], isMobile ? [-10, 10] : [-30, 30]);

  useEffect(() => {
    const handleMouseMove = throttleOnAnimationFrame((e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPct = (e.clientX / innerWidth) * 2 - 1;
      const yPct = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(xPct);
      mouseY.set(yPct);
    });

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Deep Background */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* Liquid Container */}
      <div className="absolute inset-0 opacity-60 filter blur-[80px]">
        {/* Purple Flow */}
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#7C3AED] mix-blend-screen opacity-40"
          style={{ x, y }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Cyan Flow */}
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#06B6D4] mix-blend-screen opacity-40"
          style={{ x: useTransform(x, v => -v), y: useTransform(y, v => -v) }}
          animate={{
            x: [0, -50, 0],
            y: [0, -40, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blue Accent */}
        <motion.div
          className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-[#3B82F6] mix-blend-screen opacity-30"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Glass Overlay / Noise */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80 transition-colors duration-500" />
    </div>
  );
}
