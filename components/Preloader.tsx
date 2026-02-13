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

                {/* Decorative Floating Icons */}
                <div className={styles.floatingIcons}>
                    {/* Diamond */}
                    <span className={styles.floatingIcon} style={{ left: '10%', animationDelay: '0s' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="url(#diamond-grad)">
                            <defs>
                                <linearGradient id="diamond-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3AB4CC" />
                                    <stop offset="100%" stopColor="#21D07C" />
                                </linearGradient>
                            </defs>
                            <path d="M12 2L2 9l10 13 10-13-10-7zm0 3.5L6.5 9 12 17.5 17.5 9 12 5.5z"/>
                        </svg>
                    </span>
                    {/* Rocket */}
                    <span className={styles.floatingIcon} style={{ left: '25%', animationDelay: '0.5s' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="url(#rocket-grad)">
                            <defs>
                                <linearGradient id="rocket-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FD297B" />
                                    <stop offset="100%" stopColor="#FF5864" />
                                </linearGradient>
                            </defs>
                            <path d="M12 2c-4 4-4 9-4 9s1 4 4 6c3-2 4-6 4-6s0-5-4-9zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5 16c-1.5 2-2 4-2 4s2-.5 4-2c-.5-.5-1.5-1.5-2-2zm14 0c-.5.5-1.5 1.5-2 2 2 1.5 4 2 4 2s-.5-2-2-4z"/>
                        </svg>
                    </span>
                    {/* Fire/Flame */}
                    <span className={styles.floatingIcon} style={{ left: '40%', animationDelay: '1s' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="url(#fire-grad)">
                            <defs>
                                <linearGradient id="fire-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FF655B" />
                                    <stop offset="100%" stopColor="#FD297B" />
                                </linearGradient>
                            </defs>
                            <path d="M12 23c-3.866 0-7-3.134-7-7 0-3.163 2.134-5.852 5.042-6.67.473-.133.958.196.958.689v1.478c0 .314.227.58.535.631.67.11 1.182.661 1.239 1.343.057.683-.338 1.316-.954 1.554a.647.647 0 0 0-.421.616c.005.29.102.572.282.805.63.82 1.649 1.054 2.514.577.865-.477 1.357-1.415 1.214-2.374-.143-.959-.901-1.737-1.861-1.913-.17-.031-.299-.175-.299-.348V9.84c0-.415.379-.73.782-.649C17.014 9.864 19 12.518 19 16c0 3.866-3.134 7-7 7z"/>
                        </svg>
                    </span>
                    {/* Coin/Money */}
                    <span className={styles.floatingIcon} style={{ left: '55%', animationDelay: '1.5s' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="url(#coin-grad)">
                            <defs>
                                <linearGradient id="coin-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FFB800" />
                                    <stop offset="100%" stopColor="#FF8C00" />
                                </linearGradient>
                            </defs>
                            <circle cx="12" cy="12" r="10" fill="url(#coin-grad)"/>
                            <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#21262E">$</text>
                        </svg>
                    </span>
                    {/* Moon */}
                    <span className={styles.floatingIcon} style={{ left: '70%', animationDelay: '2s' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="url(#moon-grad)">
                            <defs>
                                <linearGradient id="moon-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#9B59B6" />
                                    <stop offset="100%" stopColor="#3498DB" />
                                </linearGradient>
                            </defs>
                            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8z"/>
                        </svg>
                    </span>
                    {/* Star */}
                    <span className={styles.floatingIcon} style={{ left: '85%', animationDelay: '0.3s' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="url(#star-grad)">
                            <defs>
                                <linearGradient id="star-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#21D07C" />
                                    <stop offset="100%" stopColor="#3AB4CC" />
                                </linearGradient>
                            </defs>
                            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.2L12 17l-6.3 4.2 2.3-7.2-6-4.6h7.6L12 2z"/>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
}
