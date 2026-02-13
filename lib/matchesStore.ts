// Simple localStorage-based store for matches
// This allows matches state to persist across page navigations

export interface Match {
    id: string;
    name: string;
    image_url: string;
    lastMessage?: string;
    isNew?: boolean;
}

const MATCHES_KEY = 'tinder-coin-matches';

export function getMatches(): Match[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(MATCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function setMatches(matches: Match[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
        // Dispatch a custom event so other components can react
        window.dispatchEvent(new CustomEvent('matches-updated', { detail: matches }));
    } catch (error) {
        console.error('Failed to save matches:', error);
    }
}

export function addMatch(match: Match): void {
    const matches = getMatches();
    // Check if match already exists
    const existingIndex = matches.findIndex(m => m.id === match.id);
    if (existingIndex >= 0) {
        matches[existingIndex] = { ...matches[existingIndex], ...match };
    } else {
        matches.unshift(match);
    }
    setMatches(matches);
}

export function updateMatchWithMessage(matchId: string, message: string): void {
    const matches = getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);

    if (matchIndex >= 0) {
        matches[matchIndex] = {
            ...matches[matchIndex],
            lastMessage: message,
            isNew: false, // No longer new once messaged
        };
        setMatches(matches);
    }
}

export function getMatch(matchId: string): Match | undefined {
    const matches = getMatches();
    return matches.find(m => m.id === matchId);
}

export function clearMatches(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(MATCHES_KEY);
        window.dispatchEvent(new CustomEvent('matches-updated', { detail: [] }));
    } catch (error) {
        console.error('Failed to clear matches:', error);
    }
}
