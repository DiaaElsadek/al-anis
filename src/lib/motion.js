/**
 * Shared motion variants and animation helpers for Framer Motion.
 * All animations respect `prefers-reduced-motion`.
 */

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || 0.45,
      delay: custom.delay || 0,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      duration: custom.duration || 0.4,
      delay: custom.delay || 0,
      ease: "easeOut",
    },
  }),
};

export const staggerContainer = (staggerDelay = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

export const cardHover = {
  rest: { y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  hover: { y: -3, transition: { duration: 0.2, ease: "easeOut" } },
};
