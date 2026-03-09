import { Variants } from "motion/react";

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    willChange: "transform, opacity",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const fadeInScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    willChange: "transform, opacity",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      mass: 0.5,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const rotateAppearVariants: Variants = {
  hidden: { opacity: 0, rotate: -2, scale: 0.95 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    willChange: "transform, opacity",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      mass: 0.5,
    },
  },
  exit: {
    opacity: 0,
    rotate: 2,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const lineDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smooth ease-out
    },
  },
  exit: {
    pathLength: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    willChange: "transform, opacity",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.5,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    willChange: "transform, opacity",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.5,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};
