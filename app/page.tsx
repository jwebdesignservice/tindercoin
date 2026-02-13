'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CardStack from '@/components/CardStack';
import MobileNav from '@/components/MobileNav';
import MatchModal from '@/components/MatchModal';
import Preloader from '@/components/Preloader';
import { Character } from '@/components/SwipeCard';
import { getMatches, addMatch, clearMatches, Match } from '@/lib/matchesStore';
import { getSwipedIds, addSwipedId, clearSwipes } from '@/lib/swipesStore';
import { clearAllMessages } from '@/lib/messagesStore';
import styles from './page.module.css';

// Session key to track if this is a fresh page load/refresh
const SESSION_KEY = 'tinder-coin-session';

// Check and clear data synchronously before component mounts
function getInitialMatches(): Match[] {
    if (typeof window === 'undefined') return [];

    const isNewSession = !sessionStorage.getItem(SESSION_KEY);

    if (isNewSession) {
        // Clear all stored data on refresh
        clearSwipes();
        clearMatches();
        clearAllMessages();
        // Mark this session as started
        sessionStorage.setItem(SESSION_KEY, 'true');
        return [];
    }

    return getMatches();
}

export default function Home() {
    const router = useRouter();
    const [allCharacters, setAllCharacters] = useState<Character[]>([]);
    const [availableCharacters, setAvailableCharacters] = useState<Character[]>([]);
    const [matches, setMatchesState] = useState<Match[]>(() => getInitialMatches());
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [currentMatch, setCurrentMatch] = useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPreloader, setShowPreloader] = useState(true);

    // Fetch characters on mount
    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch('/api/characters');
                const data = await response.json();
                if (data.success) {
                    setAllCharacters(data.characters);
                }
            } catch (error) {
                console.error('Error fetching characters:', error);
                // Fallback to import if API fails
                const charactersData = await import('@/data/characters.json');
                setAllCharacters(charactersData.default as Character[]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    const handlePreloaderComplete = useCallback(() => {
        setShowPreloader(false);
    }, []);

    // Filter out already swiped characters
    useEffect(() => {
        if (allCharacters.length > 0) {
            const swipedIds = getSwipedIds();
            const filtered = allCharacters.filter(char => !swipedIds.includes(char.id));
            setAvailableCharacters(filtered);
        }
    }, [allCharacters]);

    // Listen for matches updates from other pages (e.g., chat)
    useEffect(() => {
        const handleMatchesUpdate = (event: CustomEvent<Match[]>) => {
            setMatchesState(event.detail);
        };

        window.addEventListener('matches-updated', handleMatchesUpdate as EventListener);

        return () => {
            window.removeEventListener('matches-updated', handleMatchesUpdate as EventListener);
        };
    }, []);

    const handleSwipe = useCallback(async (characterId: string, direction: 'left' | 'right' | 'up') => {
        // Track this swipe locally so they don't appear again
        addSwipedId(characterId);

        // Remove from available characters
        setAvailableCharacters(prev => prev.filter(char => char.id !== characterId));

        try {
            await fetch('/api/swipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId,
                    direction,
                }),
            });
        } catch (error) {
            console.error('Error recording swipe:', error);
        }
    }, []);

    const handleMatch = useCallback((character: Character) => {
        setCurrentMatch(character);
        setShowMatchModal(true);

        // Add to matches list and persist to localStorage
        const newMatch: Match = {
            id: character.id,
            name: character.name,
            image_url: character.image_url,
            isNew: true,
        };
        addMatch(newMatch);
        setMatchesState(prev => {
            const exists = prev.some(m => m.id === character.id);
            if (exists) return prev;
            return [newMatch, ...prev];
        });
    }, []);

    const handleSendMessage = () => {
        setShowMatchModal(false);
        if (currentMatch) {
            router.push(`/chat/${currentMatch.id}`);
        }
    };

    const handleMatchClick = (matchId: string) => {
        router.push(`/chat/${matchId}`);
    };

    const handleProfileClick = () => {
        router.push('/profile');
    };

    const handleSettingsClick = () => {
        router.push('/profile');
    };

    const handleMobileNavigate = (item: 'discover' | 'search' | 'matches' | 'chat' | 'profile') => {
        switch (item) {
            case 'discover':
            case 'search':
                // Already on home / search goes to home
                break;
            case 'matches':
            case 'chat':
                router.push('/matches');
                break;
            case 'profile':
                router.push('/profile');
                break;
        }
    };

    // Show preloader on initial load
    if (showPreloader) {
        return <Preloader onComplete={handlePreloaderComplete} minDuration={2500} />;
    }

    if (isLoading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.loading}>
                        <div className={styles.loadingIcon}>
                            <svg viewBox="0 0 24 24" width="60" height="60">
                                <defs>
                                    <linearGradient id="loading-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#FD297B" />
                                        <stop offset="50%" stopColor="#FF5864" />
                                        <stop offset="100%" stopColor="#FF655B" />
                                    </linearGradient>
                                </defs>
                                <path fill="url(#loading-gradient)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                        <p>Finding your match...</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.layout}>
                    {/* Desktop Sidebar */}
                    <Sidebar
                        matches={matches}
                        onProfileClick={handleProfileClick}
                        onSettingsClick={handleSettingsClick}
                        onMatchClick={handleMatchClick}
                    />

                    {/* Main Card Area */}
                    <div className={styles.cardArea}>
                        <CardStack
                            characters={availableCharacters}
                            onSwipe={handleSwipe}
                            onMatch={handleMatch}
                        />
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <MobileNav
                activeItem="discover"
                onNavigate={handleMobileNavigate}
                matchCount={matches.filter(m => m.isNew).length}
            />

            {/* Match Modal */}
            <MatchModal
                isOpen={showMatchModal}
                onClose={() => setShowMatchModal(false)}
                onSendMessage={handleSendMessage}
                matchName={currentMatch?.name || ''}
                matchAvatar={currentMatch?.image_url || ''}
            />
        </>
    );
}
