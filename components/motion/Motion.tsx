'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

interface MotionDivProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionDiv({ children, className = '', delay = 0 }: MotionDivProps) {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
