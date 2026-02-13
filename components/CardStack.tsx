'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SwipeCard, { Character } from './SwipeCard';
import ActionButtons from './ActionButtons';
import { clearSwipes } from '@/lib/swipesStore';
import styles from './CardStack.module.css';

interface CardStackProps {
    characters: Character[];
    onSwipe: (characterId: string, direction: 'left' | 'right' | 'up') => void;
    onMatch?: (character: Character) => void;
    contractAddress?: string;
}

export default function CardStack({ characters, onSwipe, onMatch, contractAddress = '0x1234...ABCD' }: CardStackProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipedCards, setSwipedCards] = useState<string[]>([]);
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);
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

    const currentCharacters = characters.filter(c => !swipedCards.includes(c.id));
    const visibleCards = currentCharacters.slice(0, 3);

    const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
        if (visibleCards.length === 0) return;

        const currentCard = visibleCards[0];
        setExitDirection(direction);

        // Small delay to ensure exit direction is set before card is removed
        setTimeout(() => {
            setSwipedCards(prev => [...prev, currentCard.id]);
            onSwipe(currentCard.id, direction);

            // Simulate match on right swipe (50% chance for demo)
            if ((direction === 'right' || direction === 'up') && Math.random() > 0.5) {
                onMatch?.(currentCard);
            }
        }, 10);
    }, [visibleCards, onSwipe, onMatch]);

    const handleUndo = useCallback(() => {
        if (swipedCards.length === 0) return;
        setSwipedCards(prev => prev.slice(0, -1));
    }, [swipedCards]);

    const handleButtonClick = (action: 'undo' | 'nope' | 'superlike' | 'like' | 'boost') => {
        switch (action) {
            case 'undo':
                handleUndo();
                break;
            case 'nope':
                handleSwipe('left');
                break;
            case 'like':
                handleSwipe('right');
                break;
            case 'superlike':
                handleSwipe('up');
                break;
            case 'boost':
                // Boost functionality - could show premium modal
                console.log('Boost clicked!');
                break;
        }
    };

    if (currentCharacters.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🚀</div>
                <h3 className={styles.emptyTitle}>You&apos;ve seen everyone!</h3>
                <p className={styles.emptyText}>
                    No more degens in your area. Touch grass and come back later, anon!
                </p>
                <button
                    className={styles.resetButton}
                    onClick={() => {
                        clearSwipes();
                        setSwipedCards([]);
                        window.location.reload();
                    }}
                >
                    Reset & Start Over
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Mobile CA Bar - Only visible on mobile */}
            <div className={styles.mobileCABar}>
                <button className={styles.caButton} onClick={copyCA}>
                    <span className={styles.caLabel}>CA:</span>
                    <span className={styles.caAddress}>{contractAddress}</span>
                    <span className={styles.copyIcon}>
                        {copied ? '✓' : (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                            </svg>
                        )}
                    </span>
                </button>
                <a
                    href="https://raydium.io/swap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.buyButton}
                >
                    Buy Now 🚀
                </a>
            </div>

            <div className={styles.cardAreaWrapper}>
                {/* Left Arrow - Nope */}
                <div className={styles.swipeHint}>
                    <button
                        className={`${styles.swipeArrow} ${styles.swipeArrowLeft}`}
                        onClick={() => handleSwipe('left')}
                        aria-label="Swipe left - Nope"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <span className={styles.swipeText}>swipe</span>
                </div>

                <div className={styles.cardArea}>
                    <AnimatePresence mode="popLayout">
                        {visibleCards.map((character, index) => (
                            <SwipeCard
                                key={character.id}
                                character={character}
                                onSwipe={handleSwipe}
                                isTop={index === 0}
                                index={index}
                                exitDirection={index === 0 ? exitDirection : null}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Right Arrow - Like */}
                <div className={styles.swipeHint}>
                    <button
                        className={`${styles.swipeArrow} ${styles.swipeArrowRight}`}
                        onClick={() => handleSwipe('right')}
                        aria-label="Swipe right - Like"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                    <span className={styles.swipeText}>swipe</span>
                </div>
            </div>

            <ActionButtons
                onAction={handleButtonClick}
                canUndo={swipedCards.length > 0}
            />

            <div className={styles.shortcuts}>
                <span><kbd>←</kbd> Nope</span>
                <span><kbd>↑</kbd> Open Profile</span>
                <span><kbd>→</kbd> Like</span>
                <span><kbd>↓</kbd> Close Profile</span>
                <span><kbd>Space</kbd> Super Like</span>
            </div>
        </div>
    );
}
