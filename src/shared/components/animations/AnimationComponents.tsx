import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
}

interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}

// Container animations with stagger effect
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Item animations for staggered containers
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// Fade in animation variants
const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Scale in animation variants
const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

// Slide in from different directions
const slideInVariants = {
  left: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      }
    },
  },
  right: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      }
    },
  },
  up: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      }
    },
  },
  down: {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      }
    },
  },
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  delay = 0,
  staggerChildren = 0.1,
}) => {
  const customVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  className = '',
  delay = 0,
  index = 0,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
      custom={index}
      transition={{ delay: delay + index * 0.1 }}
    >
      {children}
    </motion.div>
  );
};

export const FadeIn: React.FC<AnimatedItemProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn: React.FC<AnimatedItemProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleInVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps extends AnimatedItemProps {
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideInVariants[direction]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Hover animations
export const HoverLift: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const HoverScale: React.FC<{ children: ReactNode; className?: string; scale?: number }> = ({
  children,
  className = '',
  scale = 1.05,
}) => {
  return (
    <motion.div
      whileHover={{
        scale,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Loading animations
export const PulseLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`w-4 h-4 bg-primary-500 rounded-full ${className}`}
    />
  );
};

export const SpinLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full ${className}`}
    />
  );
};