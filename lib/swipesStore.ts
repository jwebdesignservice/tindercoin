// Simple localStorage-based store for tracking swiped characters
// This prevents characters from appearing in the rotation again

const SWIPES_KEY = 'tinder-coin-swipes-v2';

export function getSwipedIds(): string[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(SWIPES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function addSwipedId(characterId: string): void {
    if (typeof window === 'undefined') return;

    try {
        const swipedIds = getSwipedIds();
        if (!swipedIds.includes(characterId)) {
            swipedIds.push(characterId);
            localStorage.setItem(SWIPES_KEY, JSON.stringify(swipedIds));
        }
    } catch (error) {
        console.error('Failed to save swipe:', error);
    }
}

export function clearSwipes(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SWIPES_KEY);
}
