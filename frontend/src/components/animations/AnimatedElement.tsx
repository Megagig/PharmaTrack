import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type AnimationType = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scale' | 'bounce';

interface AnimatedElementProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimatedElement({
  children,
  type = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className,
}: AnimatedElementProps) {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    fadeInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    bounce: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }
      },
    },
  };

  const selectedAnimation = animations[type];

  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      transition={{
        duration,
        delay,
        ...('transition' in selectedAnimation.animate ? {} : {}),
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
