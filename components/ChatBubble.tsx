'use client';

import styles from './ChatBubble.module.css';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  senderName?: string;
  senderAvatar?: string;
}

export default function ChatBubble({ 
  message, 
  isUser, 
  timestamp 
}: ChatBubbleProps) {
  return (
    <div className={`${styles.bubbleContainer} ${isUser ? styles.user : styles.match}`}>
      <div className={styles.bubble}>
        <p className={styles.message}>{message}</p>
      </div>
      {timestamp && (
        <span className={styles.timestamp}>{timestamp}</span>
      )}
    </div>
  );
}
