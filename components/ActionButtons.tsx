'use client';

import { motion } from 'framer-motion';
import styles from './ActionButtons.module.css';

interface ActionButtonsProps {
  onAction: (action: 'undo' | 'nope' | 'superlike' | 'like' | 'boost') => void;
  canUndo?: boolean;
}

// SVG Icons
const UndoIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
  </svg>
);

const NopeIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const BoostIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
  </svg>
);

export default function ActionButtons({ onAction, canUndo = false }: ActionButtonsProps) {
  const buttons = [
    { 
      action: 'undo' as const, 
      icon: <UndoIcon />, 
      label: 'Undo', 
      className: styles.undo,
      disabled: !canUndo,
      size: 'small'
    },
    { 
      action: 'nope' as const, 
      icon: <NopeIcon />, 
      label: 'Nope', 
      className: styles.nope,
      size: 'large'
    },
    { 
      action: 'superlike' as const, 
      icon: <StarIcon />, 
      label: 'Super Like', 
      className: styles.superlike,
      size: 'medium'
    },
    { 
      action: 'like' as const, 
      icon: <HeartIcon />, 
      label: 'Like', 
      className: styles.like,
      size: 'large'
    },
    { 
      action: 'boost' as const, 
      icon: <BoostIcon />, 
      label: 'Boost', 
      className: styles.boost,
      size: 'small'
    },
  ];

  return (
    <div className={styles.container}>
      {buttons.map((btn) => (
        <motion.button
          key={btn.action}
          className={`${styles.button} ${btn.className} ${styles[btn.size || 'medium']}`}
          onClick={() => onAction(btn.action)}
          disabled={btn.disabled}
          whileHover={{ scale: btn.disabled ? 1 : 1.1 }}
          whileTap={{ scale: btn.disabled ? 1 : 0.9 }}
          title={btn.label}
        >
          <span className={styles.icon}>{btn.icon}</span>
        </motion.button>
      ))}
    </div>
  );
}
