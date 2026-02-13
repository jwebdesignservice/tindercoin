'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { getMatches, Match, clearMatches } from '@/lib/matchesStore';
import { clearSwipes } from '@/lib/swipesStore';
import { clearAllMessages } from '@/lib/messagesStore';
import styles from './matches.module.css';

// Session key to track if this is a fresh page load/refresh
const SESSION_KEY = 'tinder-coin-session';

interface MatchWithOnline extends Match {
    isOnline?: boolean;
}

// Check session and get initial matches
function getInitialMatches(): MatchWithOnline[] {
    if (typeof window === 'undefined') return [];

    const isNewSession = !sessionStorage.getItem(SESSION_KEY);

    if (isNewSession) {
        // Clear all stored data on refresh
        clearSwipes();
        clearMatches();
        clearAllMessages();
        sessionStorage.setItem(SESSION_KEY, 'true');
        return [];
    }

    return getMatches().map(m => ({
        ...m,
        isOnline: Math.random() > 0.5,
    }));
}

export default function MatchesPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');
    const [matches, setMatches] = useState<MatchWithOnline[]>(() => getInitialMatches());

    // Listen for matches updates
    useEffect(() => {
        const handleMatchesUpdate = () => {
            const storedMatches = getMatches();
            setMatches(storedMatches.map(m => ({
                ...m,
                isOnline: Math.random() > 0.5,
            })));
        };

        window.addEventListener('matches-updated', handleMatchesUpdate);
        return () => {
            window.removeEventListener('matches-updated', handleMatchesUpdate);
        };
    }, []);

    const newMatches = matches.filter(m => m.isNew && !m.lastMessage);
    const conversations = matches.filter(m => m.lastMessage);

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Back to Swiping Button - Desktop */}
                    <button
                        className={styles.backToSwipingButton}
                        onClick={() => router.push('/')}
                    >
                        🔥 Back to Swiping
                    </button>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'matches' ? styles.active : ''}`}
                            onClick={() => setActiveTab('matches')}
                        >
                            New Matches ({newMatches.length})
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'messages' ? styles.active : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            Messages ({conversations.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div className={styles.content}>
                        {activeTab === 'matches' ? (
                            <>
                                {newMatches.length > 0 ? (
                                    <div className={styles.matchesGrid}>
                                        {newMatches.map((match) => (
                                            <button
                                                key={match.id}
                                                className={styles.matchCard}
                                                onClick={() => router.push(`/chat/${match.id}`)}
                                            >
                                                <div className={styles.matchImageContainer}>
                                                    <Image
                                                        src={match.image_url}
                                                        alt={match.name}
                                                        fill
                                                        className={styles.matchImage}
                                                    />
                                                </div>
                                                {match.isOnline && <span className={styles.onlineDot} />}
                                                <span className={styles.newBadge}>NEW</span>
                                                <span className={styles.matchName}>{match.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>💎</div>
                                        <h3>No New Matches Yet</h3>
                                        <p>Keep swiping to find your moon bag soulmate! Diamond hands get matched eventually 🚀</p>
                                        <button
                                            className={styles.swipeButton}
                                            onClick={() => router.push('/')}
                                        >
                                            Start Swiping
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {conversations.length > 0 ? (
                                    <div className={styles.messagesList}>
                                        {conversations.map((conv) => (
                                            <button
                                                key={conv.id}
                                                className={styles.conversationItem}
                                                onClick={() => router.push(`/chat/${conv.id}`)}
                                            >
                                                <div className={styles.convAvatarContainer}>
                                                    <Image
                                                        src={conv.image_url}
                                                        alt={conv.name}
                                                        width={64}
                                                        height={64}
                                                        className={styles.convAvatar}
                                                    />
                                                    {conv.isOnline && <span className={styles.onlineDot} />}
                                                </div>
                                                <div className={styles.convInfo}>
                                                    <span className={styles.convName}>{conv.name}</span>
                                                    <span className={styles.convPreview}>{conv.lastMessage}</span>
                                                </div>
                                                <span className={styles.convTime}>2m</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>💬</div>
                                        <h3>No Conversations Yet</h3>
                                        <p>Match with someone and break the ice! Pro tip: start with a crypto pickup line 😏</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            <MobileNav activeItem="matches" onNavigate={(item) => {
                if (item === 'discover') router.push('/');
                if (item === 'search') router.push('/');
                if (item === 'profile') router.push('/profile');
                if (item === 'matches' || item === 'chat') {
                    // Already on matches page
                }
            }} />
        </>
    );
}
