'use client';

import styles from './MobileNav.module.css';

type NavItem = 'discover' | 'search' | 'matches' | 'chat' | 'profile';

interface MobileNavProps {
    activeItem?: NavItem;
    onNavigate?: (item: NavItem) => void;
    matchCount?: number;
    messageCount?: number;
}

// Outline-only SVG Icons with rounded, clean style
const FlameIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
            <linearGradient id="flame-grad-mobile" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FD297B" />
                <stop offset="100%" stopColor="#FF5864" />
            </linearGradient>
        </defs>
        <path
            d="M12 22c-4.97 0-9-4.03-9-9 0-4.632 2.903-8.16 6.985-9.574a.5.5 0 0 1 .64.458v2.033c0 .79.573 1.457 1.346 1.586 1.03.171 1.82 1.018 1.905 2.066.086 1.05-.52 2.024-1.468 2.39a1 1 0 0 0-.651.95c.008.448.157.883.435 1.243.97 1.264 2.54 1.624 3.873.89 1.332-.735 2.09-2.18 1.87-3.655-.22-1.476-1.387-2.676-2.867-2.948a.5.5 0 0 1-.418-.49V4.886a.5.5 0 0 1 .617-.488C19.066 5.603 21 9.16 21 13c0 4.97-4.03 9-9 9z"
            stroke={active ? 'url(#flame-grad-mobile)' : '#656E7B'}
            fill={active ? 'url(#flame-grad-mobile)' : 'none'}
        />
    </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <defs>
            <linearGradient id="search-grad-mobile" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FD297B" />
                <stop offset="100%" stopColor="#FF5864" />
            </linearGradient>
        </defs>
        <circle
            cx="11"
            cy="11"
            r="7"
            stroke={active ? 'url(#search-grad-mobile)' : '#656E7B'}
        />
        <line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
            stroke={active ? 'url(#search-grad-mobile)' : '#656E7B'}
        />
    </svg>
);

const StarIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
            <linearGradient id="star-grad-mobile" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#21D07C" />
                <stop offset="100%" stopColor="#3AB4CC" />
            </linearGradient>
        </defs>
        <path
            d="M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17l-5.8 3-1.1-6.5L.4 8.8l6.5-.9L12 2z"
            stroke={active ? 'url(#star-grad-mobile)' : '#656E7B'}
            fill={active ? 'url(#star-grad-mobile)' : 'none'}
        />
    </svg>
);

const ChatIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
            <linearGradient id="chat-grad-mobile" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FD297B" />
                <stop offset="100%" stopColor="#FF5864" />
            </linearGradient>
        </defs>
        <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            stroke={active ? 'url(#chat-grad-mobile)' : '#656E7B'}
            fill={active ? 'url(#chat-grad-mobile)' : 'none'}
        />
    </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
            <linearGradient id="profile-grad-mobile" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FD297B" />
                <stop offset="100%" stopColor="#FF5864" />
            </linearGradient>
        </defs>
        <circle
            cx="12"
            cy="8"
            r="4"
            stroke={active ? 'url(#profile-grad-mobile)' : '#656E7B'}
            fill={active ? 'url(#profile-grad-mobile)' : 'none'}
        />
        <path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            stroke={active ? 'url(#profile-grad-mobile)' : '#656E7B'}
            fill="none"
        />
    </svg>
);

const icons: Record<NavItem, (active: boolean) => JSX.Element> = {
    discover: (active) => <FlameIcon active={active} />,
    search: (active) => <SearchIcon active={active} />,
    matches: (active) => <StarIcon active={active} />,
    chat: (active) => <ChatIcon active={active} />,
    profile: (active) => <ProfileIcon active={active} />,
};

export default function MobileNav({
    activeItem = 'discover',
    onNavigate,
    matchCount = 0,
    messageCount = 0
}: MobileNavProps) {
    const navItems: { id: NavItem; badge?: number }[] = [
        { id: 'discover' },
        { id: 'search' },
        { id: 'matches', badge: matchCount },
        { id: 'chat', badge: messageCount },
        { id: 'profile' },
    ];

    return (
        <nav className={styles.nav}>
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
                    onClick={() => onNavigate?.(item.id)}
                    aria-label={item.id}
                >
                    <span className={styles.iconWrapper}>
                        {icons[item.id](activeItem === item.id)}
                        {item.badge && item.badge > 0 && (
                            <span className={styles.badge}>{item.badge > 9 ? '9+' : item.badge}</span>
                        )}
                    </span>
                </button>
            ))}
        </nav>
    );
}
