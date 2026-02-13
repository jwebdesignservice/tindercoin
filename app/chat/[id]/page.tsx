'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import ChatBubble from '@/components/ChatBubble';
import MobileNav from '@/components/MobileNav';
import { getMatch, updateMatchWithMessage, clearMatches } from '@/lib/matchesStore';
import { getMessages, saveMessages, ChatMessage, clearAllMessages } from '@/lib/messagesStore';
import { clearSwipes } from '@/lib/swipesStore';
import styles from './chat.module.css';

// Character data for bio/trait info
import charactersData from '@/data/characters.json';

// Session key to track if this is a fresh page load/refresh
const SESSION_KEY = 'tinder-coin-session';

interface CharacterData {
    id: string;
    name: string;
    bio: string;
    trait: string;
    image_url: string;
}

// Check and clear session if needed, then get match data
const getMatchData = (id: string) => {
    if (typeof window !== 'undefined') {
        const isNewSession = !sessionStorage.getItem(SESSION_KEY);
        if (isNewSession) {
            clearSwipes();
            clearMatches();
            clearAllMessages();
            sessionStorage.setItem(SESSION_KEY, 'true');
        }
    }

    // First try to get from localStorage (for name/image)
    const storedMatch = getMatch(id);

    // Get character details for bio/trait
    const character = (charactersData as CharacterData[]).find(c => c.id === id);

    return {
        id,
        name: storedMatch?.name || character?.name || 'Mystery Degen',
        image_url: storedMatch?.image_url || character?.image_url || `https://picsum.photos/seed/${id}/400/600`,
        trait: character?.trait || 'DIAMOND HANDS',
        bio: character?.bio || 'Just a humble degen looking for connection 🚀',
        isOnline: true,
    };
};

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const matchId = params.id as string;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [match, setMatch] = useState(() => getMatchData(matchId));
    const [hasMessaged, setHasMessaged] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load match data and messages when component mounts
    useEffect(() => {
        const matchData = getMatchData(matchId);
        setMatch(matchData);

        // Load existing messages from localStorage
        const storedMessages = getMessages(matchId);

        if (storedMessages.length > 0) {
            setMessages(storedMessages);
            setHasMessaged(true);
        } else {
            // First time chatting - add greeting message
            const greetingMessage: ChatMessage = {
                id: '1',
                content: `Hey there! 👋 I'm ${matchData.name}. Saw you swiped right - bullish signal! What's your investment thesis on us? 😏🚀`,
                isUser: false,
                timestamp: 'Just now',
            };
            setMessages([greetingMessage]);
            saveMessages(matchId, [greetingMessage]);
        }
        setIsLoaded(true);
    }, [matchId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isLoaded) {
            scrollToBottom();
        }
    }, [messages, isLoaded]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: newMessage,
            isUser: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        saveMessages(matchId, updatedMessages);
        setNewMessage('');
        setIsTyping(true);

        // Update match in localStorage to move from "Matches" to "Messages" tab
        updateMatchWithMessage(matchId, newMessage);
        if (!hasMessaged) {
            setHasMessaged(true);
        }

        // Simulate bot response
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId,
                    message: newMessage,
                    characterInfo: {
                        name: match.name,
                        trait: match.trait,
                        bio: match.bio,
                    },
                }),
            });

            const data = await response.json();

            setTimeout(() => {
                setIsTyping(false);
                const botMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    content: data.response || getRandomResponse(),
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages(prev => {
                    const newMessages = [...prev, botMessage];
                    saveMessages(matchId, newMessages);
                    // Update match with bot's response as the latest message
                    updateMatchWithMessage(matchId, botMessage.content);
                    return newMessages;
                });
            }, 1000 + Math.random() * 1500);
        } catch {
            setTimeout(() => {
                setIsTyping(false);
                const botMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    content: getRandomResponse(),
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages(prev => {
                    const newMessages = [...prev, botMessage];
                    saveMessages(matchId, newMessages);
                    updateMatchWithMessage(matchId, botMessage.content);
                    return newMessages;
                });
            }, 1000);
        }
    };

    const getRandomResponse = () => {
        const responses = [
            `Bullish on this convo! 📈 You're definitely my type - the type that HODLs 💎`,
            `Haha nice one! 😂 You're making me more excited than a green candle day 🚀`,
            `I like the way you think, anon 🧠 WAGMI energy right here!`,
            `Wen date tho? 👀 I promise I won't rug pull... unless it's to wrap you in a hug 💕`,
            `You've got diamond hand energy and I'm here for it 💎🙌`,
            `NFA but I think we might be a good match 😏 What's your moon mission plan?`,
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                    <button className={styles.backButton} onClick={() => router.push('/')}>
                        ←
                    </button>
                    <button className={styles.backToSwipingButton} onClick={() => router.push('/')}>
                        🔥 Back to Swiping
                    </button>
                    <div className={styles.matchInfo}>
                        <div className={styles.avatarContainer}>
                            <Image
                                src={match.image_url}
                                alt={match.name}
                                width={44}
                                height={44}
                                className={styles.avatar}
                            />
                            {match.isOnline && <span className={styles.onlineDot} />}
                        </div>
                        <div className={styles.matchDetails}>
                            <span className={styles.matchName}>{match.name}</span>
                            <span className={styles.matchStatus}>
                                {match.isOnline ? 'Online now' : 'Offline'}
                            </span>
                        </div>
                    </div>
                    <button className={styles.menuButton}>⋮</button>
                </div>

                {/* Messages Area */}
                <div className={styles.messagesArea}>
                    <div className={styles.messagesContainer}>
                        {/* Match Card */}
                        <div className={styles.matchCard}>
                            <Image
                                src={match.image_url}
                                alt={match.name}
                                width={80}
                                height={80}
                                className={styles.matchCardAvatar}
                            />
                            <p className={styles.matchCardText}>
                                You matched with <strong>{match.name}</strong>!<br />
                                <span className={styles.matchCardSub}>Start the conversation 🚀</span>
                            </p>
                        </div>

                        {/* Messages */}
                        {messages.map((msg) => (
                            <ChatBubble
                                key={msg.id}
                                message={msg.content}
                                isUser={msg.isUser}
                                timestamp={msg.timestamp}
                            />
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className={styles.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                    <div className={styles.inputContainer}>
                        <button className={styles.gifButton} title="Send GIF">
                            GIF
                        </button>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Say something degen..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className={styles.sendButton}
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            🚀
                        </button>
                    </div>
                </div>
            </main>
            <MobileNav activeItem="chat" onNavigate={(item) => {
                if (item === 'discover') router.push('/');
                if (item === 'profile') router.push('/profile');
                if (item === 'matches') router.push('/matches');
            }} />
        </>
    );
}
