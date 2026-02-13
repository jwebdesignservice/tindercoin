'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './MatchModal.module.css';

interface MatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendMessage: () => void;
    userAvatar?: string;
    matchName: string;
    matchAvatar: string;
    matchLocation?: string;
}

const CRYPTO_LOCATIONS = [
    'The DEX',
    'Uniswap Pool Party',
    'ETH Denver',
    'The Blockchain',
    'Crypto Twitter',
    'The Moon Base 🌙',
    'Diamond Hand Island',
    'WAGMI Valley',
    'Pump Station',
    'The Liquidity Pool',
];

// Placeholder avatar SVG as data URL
const PLACEHOLDER_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E8E8E8'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23BDBDBD'/%3E%3Cellipse cx='50' cy='75' rx='28' ry='20' fill='%23BDBDBD'/%3E%3C/svg%3E";

export default function MatchModal({
    isOpen,
    onClose,
    onSendMessage,
    userAvatar = PLACEHOLDER_AVATAR,
    matchName,
    matchAvatar,
    matchLocation
}: MatchModalProps) {
    const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; delay: number }[]>([]);

    const location = matchLocation || CRYPTO_LOCATIONS[Math.floor(Math.random() * CRYPTO_LOCATIONS.length)];

    useEffect(() => {
        if (isOpen) {
            // Generate confetti
            const colors = ['#FD297B', '#FF5864', '#FFD700', '#46D89A', '#3AB4CC', '#A855F7'];
            const newConfetti = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
            }));
            setConfetti(newConfetti);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Confetti */}
                    <div className={styles.confettiContainer}>
                        {confetti.map((piece) => (
                            <motion.div
                                key={piece.id}
                                className={styles.confetti}
                                style={{
                                    left: `${piece.left}%`,
                                    backgroundColor: piece.color,
                                }}
                                initial={{ y: -20, opacity: 1, rotate: 0 }}
                                animate={{
                                    y: '100vh',
                                    opacity: 0,
                                    rotate: 720,
                                }}
                                transition={{
                                    duration: 3,
                                    delay: piece.delay,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}
                    </div>

                    <motion.div
                        className={styles.modal}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Title */}
                        <motion.h1
                            className={styles.title}
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            It&apos;s a Match!
                        </motion.h1>

                        <motion.p
                            className={styles.subtitle}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            You matched at<br />
                            <span className={styles.location}>{location}</span>
                        </motion.p>

                        {/* Profile Pictures */}
                        <motion.div
                            className={styles.profiles}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                        >
                            <div className={styles.profilePic}>
                                <Image
                                    src={userAvatar}
                                    alt="You"
                                    width={120}
                                    height={120}
                                    className={styles.avatar}
                                    unoptimized
                                />
                            </div>
                            <div className={styles.heartBadge}>
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.6, type: 'spring' }}
                                >
                                    💕
                                </motion.span>
                            </div>
                            <div className={styles.profilePic}>
                                <Image
                                    src={matchAvatar}
                                    alt={matchName}
                                    width={120}
                                    height={120}
                                    className={styles.avatar}
                                />
                            </div>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div
                            className={styles.buttons}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button className={styles.sendButton} onClick={onSendMessage}>
                                Send a Message
                            </button>
                            <button className={styles.keepButton} onClick={onClose}>
                                Keep Swiping
                            </button>
                        </motion.div>

                        {/* Fun text */}
                        <motion.p
                            className={styles.funText}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            WAGMI 🚀
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
