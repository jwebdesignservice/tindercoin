// Simple localStorage-based store for chat messages
// This allows messages to persist across page navigations

export interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: string;
}

const MESSAGES_KEY = 'tinder-coin-messages';

interface MessagesStore {
    [matchId: string]: ChatMessage[];
}

function getStore(): MessagesStore {
    if (typeof window === 'undefined') return {};

    try {
        const stored = localStorage.getItem(MESSAGES_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

function saveStore(store: MessagesStore): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(store));
    } catch (error) {
        console.error('Failed to save messages:', error);
    }
}

export function getMessages(matchId: string): ChatMessage[] {
    const store = getStore();
    return store[matchId] || [];
}

export function saveMessages(matchId: string, messages: ChatMessage[]): void {
    const store = getStore();
    store[matchId] = messages;
    saveStore(store);
}

export function addMessage(matchId: string, message: ChatMessage): void {
    const store = getStore();
    if (!store[matchId]) {
        store[matchId] = [];
    }
    store[matchId].push(message);
    saveStore(store);
}

export function clearMessages(matchId: string): void {
    const store = getStore();
    delete store[matchId];
    saveStore(store);
}

export function clearAllMessages(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(MESSAGES_KEY);
    } catch (error) {
        console.error('Failed to clear all messages:', error);
    }
}
