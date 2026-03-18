import React from 'react';
import { motion } from 'framer-motion';

const Balloon = ({ delay, color, startX }) => {
  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        left: `${startX}%`,
        bottom: '-50px',
        fontSize: '40px',
      }}
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: window.innerHeight + 100,
        opacity: 0,
        x: Math.sin(delay) * 100,
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay,
        ease: 'easeInOut',
      }}
    >
      {color}
    </motion.div>
  );
};

export const FloatingBalloons = ({ active = true }) => {
  if (!active) return null;

  const balloons = ['🎈', '🎈', '🎈', '🎈', '🎈'];
  const colors = ['🔴', '🟡', '🟢', '🔵', '🟣'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Balloon
          key={idx}
          delay={idx * 0.3}
          color={colors[idx % colors.length]}
          startX={Math.random() * 100}
        />
      ))}
    </div>
  );
};

export default FloatingBalloons;
