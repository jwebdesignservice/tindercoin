'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './SwipeCard.module.css';

export interface Character {
    id: string;
    name: string;
    age: number;
    bio: string;
    image_url: string;
    trait: string;
    distance_blocks: number;
    occupation: string;
    peak_mcap?: string;
    ath_date?: string;
    volume_24h?: string;
    holders?: string;
    chain?: string;
    vibe?: string;
    looking_for?: string;
    green_flags?: string[];
    red_flags?: string[];
    fun_facts?: string[];
}

interface SwipeCardProps {
    character: Character;
    onSwipe: (direction: 'left' | 'right' | 'up') => void;
    isTop: boolean;
    index: number;
    exitDirection?: 'left' | 'right' | 'up' | null;
}

export default function SwipeCard({ character, onSwipe, isTop, index, exitDirection }: SwipeCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Rotation based on drag
    const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);

    // Opacity for like/nope indicators
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
    const superlikeOpacity = useTransform(y, [-100, 0], [1, 0]);

    // Scale for stacked cards
    const scale = isTop ? 1 : 1 - (index * 0.05);
    const yOffset = isTop ? 0 : index * -10;

    const handleDragEnd = (_: any, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
        if (isExpanded) return; // Don't swipe when expanded

        const threshold = 100;
        const velocityThreshold = 500;

        if (info.offset.y < -threshold || info.velocity.y < -velocityThreshold) {
            onSwipe('up'); // Super like
        } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
            onSwipe('right'); // Like
        } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
            onSwipe('left'); // Nope
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent expanding when dragging
        if (Math.abs(x.get()) > 10 || Math.abs(y.get()) > 10) return;
        if (!isTop) return;
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.div
            className={styles.card}
            style={{
                x: isExpanded ? 0 : x,
                y: isExpanded ? 0 : y,
                rotate: isExpanded ? 0 : rotate,
                scale,
                zIndex: isExpanded ? 200 : 100 - index,
            }}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{
                scale,
                y: yOffset,
                opacity: 1,
            }}
            exit={() => {
                // Determine exit direction - use exitDirection prop if provided (button click)
                // Otherwise use the drag position
                let exitX = 0;
                let exitY = 0;
                let exitRotate = 0;

                if (exitDirection === 'left') {
                    exitX = -600;
                    exitRotate = -20;
                } else if (exitDirection === 'right') {
                    exitX = 600;
                    exitRotate = 20;
                } else if (exitDirection === 'up') {
                    exitY = -600;
                } else {
                    // Fallback to drag-based exit
                    exitX = x.get() > 0 ? 600 : x.get() < 0 ? -600 : 0;
                    exitY = y.get() < -50 ? -600 : 0;
                    exitRotate = x.get() > 0 ? 20 : x.get() < 0 ? -20 : 0;
                }

                return {
                    x: exitX,
                    y: exitY,
                    rotate: exitRotate,
                    opacity: 0,
                    transition: {
                        duration: 0.8,
                        ease: [0.25, 0.1, 0.25, 1],
                        opacity: { duration: 0.6, delay: 0.2 }
                    }
                };
            }}
            drag={isTop && !isExpanded}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.9}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: isExpanded ? 'default' : 'grabbing' }}
            onClick={handleCardClick}
        >
            {/* Image Section - slides up when expanded */}
            <motion.div
                className={styles.imageContainer}
                animate={{
                    y: isExpanded ? '-100%' : 0,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
                <Image
                    src={character.image_url}
                    alt={character.name}
                    fill
                    className={styles.image}
                    priority={isTop}
                />

                {/* Like/Nope/Superlike Overlays - only show on top card when not expanded */}
                {isTop && !isExpanded && (
                    <>
                        <motion.div
                            className={`${styles.indicator} ${styles.like}`}
                            style={{ opacity: likeOpacity }}
                        >
                            LIKE 💚
                        </motion.div>
                        <motion.div
                            className={`${styles.indicator} ${styles.nope}`}
                            style={{ opacity: nopeOpacity }}
                        >
                            NOPE ❌
                        </motion.div>
                        <motion.div
                            className={`${styles.indicator} ${styles.superlike}`}
                            style={{ opacity: superlikeOpacity }}
                        >
                            SUPER LIKE ⭐
                        </motion.div>
                    </>
                )}


                {/* Trait Badge */}
                <div className={styles.traitBadge}>
                    {character.trait}
                </div>

                {/* Card Info Gradient - Desktop only */}
                <div className={styles.infoGradient}>
                    <div className={styles.mainInfo}>
                        <h2 className={styles.name}>
                            {character.name}
                            <span className={styles.age}>{character.age}</span>
                        </h2>
                        <p className={styles.occupation}>{character.occupation}</p>
                        <p className={styles.distance}>
                            <span className={styles.locationIcon}>📍</span>
                            {character.distance_blocks.toLocaleString()} blocks away
                        </p>
                    </div>
                    <p className={styles.bio}>{character.bio}</p>

                    {/* Tap indicator - Desktop only */}
                    {isTop && (
                        <div className={styles.tapHint}>
                            <span>Tap to see more</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                            </svg>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Expanded Content - revealed when image slides up */}
            <div className={styles.expandedContent}>
                {/* Close button */}
                <button
                    className={styles.closeButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                    }}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
                    </svg>
                    <span>Back to Photo</span>
                </button>

                {/* Header with small avatar */}
                <div className={styles.expandedHeader}>
                    <div className={styles.smallAvatar}>
                        <Image
                            src={character.image_url}
                            alt={character.name}
                            width={60}
                            height={60}
                            className={styles.smallAvatarImg}
                        />
                    </div>
                    <div className={styles.expandedHeaderInfo}>
                        <h2 className={styles.expandedName}>
                            {character.name} <span>{character.age}</span>
                        </h2>
                        <p className={styles.expandedOccupation}>{character.occupation}</p>
                    </div>
                </div>

                {/* Bio Section */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>About Me</h3>
                    <p className={styles.fullBio}>{character.bio}</p>
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Peak MC</span>
                        <span className={styles.statValue}>{character.peak_mcap || 'N/A'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>ATH Date</span>
                        <span className={styles.statValue}>{character.ath_date || 'N/A'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>24h Vol</span>
                        <span className={styles.statValue}>{character.volume_24h || 'N/A'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Holders</span>
                        <span className={styles.statValue}>{character.holders || 'N/A'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Chain</span>
                        <span className={styles.statValue}>{character.chain || 'N/A'}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Vibe</span>
                        <span className={styles.statValue}>{character.vibe || 'N/A'}</span>
                    </div>
                </div>

                {/* Looking For */}
                {character.looking_for && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>🔍 Looking For</h3>
                        <p className={styles.lookingFor}>{character.looking_for}</p>
                    </div>
                )}

                {/* Green Flags */}
                {character.green_flags && character.green_flags.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>🟢 Green Flags</h3>
                        <div className={styles.flagsContainer}>
                            {character.green_flags.map((flag, i) => (
                                <span key={i} className={styles.greenFlag}>{flag}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Red Flags */}
                {character.red_flags && character.red_flags.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>🚩 Red Flags</h3>
                        <div className={styles.flagsContainer}>
                            {character.red_flags.map((flag, i) => (
                                <span key={i} className={styles.redFlag}>{flag}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Fun Facts */}
                {character.fun_facts && character.fun_facts.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>✨ Degen Facts</h3>
                        <ul className={styles.factsList}>
                            {character.fun_facts.map((fact, i) => (
                                <li key={i}>{fact}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
