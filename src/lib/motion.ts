import type { Variants, Transition } from 'framer-motion';

// Easing curve: cubic-bezier(0.22, 1, 0.36, 1) - snappy yet graceful deceleration
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const transitionFast: Transition = {
  duration: 0.2,
  ease: EASE_OUT_EXPO,
};

export const transitionMedium: Transition = {
  duration: 0.45,
  ease: EASE_OUT_EXPO,
};

export const transitionSmooth: Transition = {
  duration: 0.65,
  ease: EASE_OUT_EXPO,
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSmooth,
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionMedium,
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionSmooth,
  },
};

export const defaultViewport = {
  once: true,
  margin: '-80px',
};
