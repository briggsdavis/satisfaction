import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  nowrap?: boolean;
  stagger?: number;
}

export const TextReveal = ({
  text,
  className,
  as: Component = 'p',
  delay = 0,
  nowrap = false,
  stagger = 0.01,
}: TextRevealProps) => {
  const characters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: 0.02 * i + delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.div
      style={{ display: "flex", flexWrap: nowrap ? "nowrap" : "wrap" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 380, damping: 22 } }}
      className={cn(className)}
    >
      {characters.map((char, index) => (
        <motion.span
          variants={child}
          key={index}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};
