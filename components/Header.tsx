'use client';

import { useState } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  tokenName?: string;
  contractAddress?: string;
}

export default function Header({ 
  tokenName = '$TINDERCOIN',
  contractAddress = '0x1234...ABCD'
}: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo & Token Name */}
        <div className={styles.logoSection}>
          <div className={styles.flameIcon}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="url(#flame-gradient)">
              <defs>
                <linearGradient id="flame-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FD297B" />
                  <stop offset="50%" stopColor="#FF5864" />
                  <stop offset="100%" stopColor="#FF655B" />
                </linearGradient>
              </defs>
              <path d="M12 23c-3.866 0-7-3.134-7-7 0-3.163 2.134-5.852 5.042-6.67.473-.133.958.196.958.689v1.478c0 .314.227.58.535.631.67.11 1.182.661 1.239 1.343.057.683-.338 1.316-.954 1.554a.647.647 0 0 0-.421.616c.005.29.102.572.282.805.63.82 1.649 1.054 2.514.577.865-.477 1.357-1.415 1.214-2.374-.143-.959-.901-1.737-1.861-1.913-.17-.031-.299-.175-.299-.348V9.84c0-.415.379-.73.782-.649C17.014 9.864 19 12.518 19 16c0 3.866-3.134 7-7 7z"/>
            </svg>
          </div>
          <h1 className={styles.tokenName}>
            <span className={styles.tinder}>tinder</span>
            <span className={styles.coin}>coin</span>
          </h1>
        </div>

        {/* Contract Address */}
        <button 
          className={styles.caButton}
          onClick={copyCA}
          title="Click to copy contract address"
        >
          <span className={styles.caLabel}>CA:</span>
          <span className={styles.caAddress}>{contractAddress}</span>
          <span className={styles.copyIcon}>
            {copied ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            )}
          </span>
        </button>

        {/* Social Links */}
        <div className={styles.socialLinks}>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
            title="Twitter/X"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://t.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
            title="Telegram"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </a>
          <a 
            href="https://discord.gg" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
            title="Discord"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a 
            href="https://dexscreener.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
            title="DEXScreener"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
