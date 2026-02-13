'use client';

import { useState, useEffect } from 'react';
import styles from './Preloader.module.css';

interface PreloaderProps {
    onComplete?: () => void;
    minDuration?: number;
}

export default function Preloader({ onComplete, minDuration = 2000 }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        const startTime = Date.now();
        const duration = minDuration;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            
            // Add some easing for smoother feel
            const easedProgress = easeOutQuart(newProgress / 100) * 100;
            setProgress(easedProgress);
            
            if (newProgress < 100) {
                requestAnimationFrame(animate);
            } else {
                setIsComplete(true);
                setTimeout(() => {
                    setIsHiding(true);
                    setTimeout(() => {
                        onComplete?.();
                    }, 500);
                }, 300);
            }
        };
        
        requestAnimationFrame(animate);
    }, [minDuration, onComplete]);

    // Easing function for smooth progress
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const loadingTexts = [
        "Finding degens nearby...",
        "Checking diamond hands...",
        "Loading moon bags...",
        "Verifying HODLers...",
        "Scanning for rugs...",
    ];

    const currentText = loadingTexts[Math.floor((progress / 100) * (loadingTexts.length - 1))];

    return (
        <div className={`${styles.preloader} ${isHiding ? styles.hiding : ''}`}>
            <div className={styles.content}>
                {/* Logo/Icon */}
                <div className={styles.logoContainer}>
                    <svg 
                        className={styles.logo} 
                        viewBox="0 0 24 24" 
                        width="80" 
                        height="80"
                    >
                        <defs>
                            <linearGradient id="preloader-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FD297B" />
                                <stop offset="50%" stopColor="#FF5864" />
                                <stop offset="100%" stopColor="#FF655B" />
                            </linearGradient>
                        </defs>
                        <path 
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill="url(#preloader-gradient)"
                        />
                    </svg>
                    <div className={styles.pulseRing}></div>
                    <div className={styles.pulseRing} style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Title */}
                <h1 className={styles.title}>
                    <span className={styles.titleText}>tinder</span>
                    <span className={styles.titleCoin}>coin</span>
                </h1>

                {/* Loading Bar */}
                <div className={styles.loadingBarContainer}>
                    <div className={styles.loadingBarTrack}>
                        <div 
                            className={styles.loadingBarFill}
                            style={{ width: `${progress}%` }}
                        >
                            <div className={styles.loadingBarShine}></div>
                        </div>
                    </div>
                    <div className={styles.progressText}>
                        {Math.round(progress)}%
                    </div>
                </div>

                {/* Loading Text */}
                <p className={styles.loadingText}>
                    {isComplete ? "Let's go! 🚀" : currentText}
                </p>
            </div>
        </div>
    );
}
