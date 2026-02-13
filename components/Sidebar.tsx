'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Sidebar.module.css';

interface Match {
    id: string;
    name: string;
    image_url: string;
    lastMessage?: string;
    isNew?: boolean;
}

interface SidebarProps {
    userAvatar?: string;
    userName?: string;
    matches?: Match[];
    onProfileClick?: () => void;
    onSettingsClick?: () => void;
    onMatchClick?: (matchId: string) => void;
    activeTab?: 'matches' | 'messages';
}

// Default placeholder avatar SVG as data URL
const PLACEHOLDER_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E0E0E0'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23BDBDBD'/%3E%3Cellipse cx='50' cy='75' rx='28' ry='20' fill='%23BDBDBD'/%3E%3C/svg%3E";

export default function Sidebar({
    userAvatar,
    userName = 'Anon',
    matches = [],
    onProfileClick,
    onSettingsClick,
    onMatchClick,
    activeTab: initialTab = 'matches'
}: SidebarProps) {
    const avatarSrc = userAvatar || PLACEHOLDER_AVATAR;
    const [activeTab, setActiveTab] = useState(initialTab);

    const newMatches = matches.filter(m => m.isNew);
    const conversations = matches.filter(m => m.lastMessage);

    return (
        <aside className={styles.sidebar}>
            {/* Profile Section */}
            <div className={styles.profileSection}>
                <button className={styles.profileButton} onClick={onProfileClick}>
                    <div className={styles.avatarContainer}>
                        <Image
                            src={avatarSrc}
                            alt={userName}
                            width={48}
                            height={48}
                            className={styles.avatar}
                            unoptimized={avatarSrc === PLACEHOLDER_AVATAR}
                        />
                    </div>
                    <span className={styles.profileName}>My Profile</span>
                </button>
                <button className={styles.settingsButton} title="Settings" onClick={onSettingsClick}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'matches' ? styles.active : ''}`}
                    onClick={() => setActiveTab('matches')}
                >
                    Matches
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'messages' ? styles.active : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    Messages
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
                                        onClick={() => onMatchClick?.(match.id)}
                                    >
                                        <div className={styles.matchImageContainer}>
                                            <Image
                                                src={match.image_url}
                                                alt={match.name}
                                                fill
                                                className={styles.matchImage}
                                            />
                                        </div>
                                        {match.isNew && <span className={styles.newBadge}>NEW</span>}
                                        <span className={styles.matchName}>{match.name}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyGradient}>
                                    <span className={styles.emptyIcon}>💎</span>
                                </div>
                                <h4>Get Swiping</h4>
                                <p>You&apos;ll start seeing matches here once you get swiping. When you&apos;re ready to chat, you can message them directly from here. Swipe on!</p>
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
                                        onClick={() => onMatchClick?.(conv.id)}
                                    >
                                        <Image
                                            src={conv.image_url}
                                            alt={conv.name}
                                            width={56}
                                            height={56}
                                            className={styles.convAvatar}
                                        />
                                        <div className={styles.convInfo}>
                                            <span className={styles.convName}>{conv.name}</span>
                                            <span className={styles.convPreview}>{conv.lastMessage}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyGradient}>
                                    <span className={styles.emptyIcon}>💬</span>
                                </div>
                                <h4>No Messages Yet</h4>
                                <p>Match with someone and start a conversation. Pro tip: open with a crypto joke! 🚀</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
}
