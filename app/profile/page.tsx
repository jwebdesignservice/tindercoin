'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import styles from './profile.module.css';

interface ProfileData {
    displayName: string;
    bio: string;
    avatarUrl: string;
    walletAddress: string;
    favoriteChain: string;
    tradingStyle: string;
    lookingFor: string;
}

const TRADING_STYLES = ['Diamond Hands 💎', 'Day Trader 📈', 'Swing Trader 🎢', 'DCA Enjoyer 📅', 'Degen Ape 🦍'];
const CHAINS = ['Ethereum', 'Solana', 'Base', 'Arbitrum', 'Polygon', 'All of them'];
const LOOKING_FOR = ['Moon Mission Partner 🚀', 'Diamond Hand Duo 💎', 'Casual Trading Buddy', 'Serious HODLer', 'Fellow Degen'];

// Default placeholder avatar SVG as data URL
const PLACEHOLDER_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E0E0E0'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23BDBDBD'/%3E%3Cellipse cx='50' cy='75' rx='28' ry='20' fill='%23BDBDBD'/%3E%3C/svg%3E";

export default function ProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        displayName: 'Anon Degen',
        bio: 'Just a humble degen looking for my moon bag soulmate. Diamond hands only. WAGMI 🚀',
        avatarUrl: '',
        walletAddress: '',
        favoriteChain: 'Ethereum',
        tradingStyle: 'Diamond Hands 💎',
        lookingFor: 'Moon Mission Partner 🚀',
    });

    const handleSave = () => {
        // In a real app, this would save to the database
        setIsEditing(false);
    };

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB');
                return;
            }

            // Convert to base64 data URL for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfile(prev => ({ ...prev, avatarUrl: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Back Button */}
                    <button className={styles.backButton} onClick={() => router.push('/')}>
                        ← Back to Swiping
                    </button>

                    <div className={styles.card}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>My Profile</h1>
                            <button
                                className={styles.editButton}
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            >
                                {isEditing ? 'Save' : 'Edit'}
                            </button>
                        </div>

                        {/* Avatar Section */}
                        <div className={styles.avatarSection}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className={styles.fileInput}
                            />
                            <div
                                className={`${styles.avatarContainer} ${isEditing ? styles.avatarClickable : ''}`}
                                onClick={isEditing ? triggerFileInput : undefined}
                            >
                                <Image
                                    src={profile.avatarUrl || PLACEHOLDER_AVATAR}
                                    alt={profile.displayName}
                                    width={150}
                                    height={150}
                                    className={styles.avatar}
                                    unoptimized
                                />
                                {isEditing && (
                                    <div className={styles.avatarOverlay}>
                                        <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                        <span>Upload Photo</span>
                                    </div>
                                )}
                            </div>
                            {!profile.avatarUrl && !isEditing && (
                                <p className={styles.uploadHint}>Click Edit to upload your profile photo</p>
                            )}
                            {isEditing && (
                                <p className={styles.uploadHint}>Click the image to upload a photo</p>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className={styles.fields}>
                            {/* Display Name */}
                            <div className={styles.field}>
                                <label className={styles.label}>Display Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={profile.displayName}
                                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                                        placeholder="Your degen alias"
                                    />
                                ) : (
                                    <p className={styles.value}>{profile.displayName}</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className={styles.field}>
                                <label className={styles.label}>Bio</label>
                                {isEditing ? (
                                    <textarea
                                        className={styles.textarea}
                                        value={profile.bio}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        placeholder="Tell us about yourself (include your best crypto pickup line)"
                                        rows={4}
                                    />
                                ) : (
                                    <p className={styles.value}>{profile.bio}</p>
                                )}
                            </div>

                            {/* Wallet Address */}
                            <div className={styles.field}>
                                <label className={styles.label}>Wallet Address (Optional)</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={profile.walletAddress}
                                        onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                                        placeholder="0x... or ENS name"
                                    />
                                ) : (
                                    <p className={styles.value}>{profile.walletAddress || 'Not connected'}</p>
                                )}
                            </div>

                            {/* Favorite Chain */}
                            <div className={styles.field}>
                                <label className={styles.label}>Favorite Chain</label>
                                {isEditing ? (
                                    <select
                                        className={styles.select}
                                        value={profile.favoriteChain}
                                        onChange={(e) => handleInputChange('favoriteChain', e.target.value)}
                                    >
                                        {CHAINS.map(chain => (
                                            <option key={chain} value={chain}>{chain}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className={styles.value}>{profile.favoriteChain}</p>
                                )}
                            </div>

                            {/* Trading Style */}
                            <div className={styles.field}>
                                <label className={styles.label}>Trading Style</label>
                                {isEditing ? (
                                    <div className={styles.chipGroup}>
                                        {TRADING_STYLES.map(style => (
                                            <button
                                                key={style}
                                                className={`${styles.chip} ${profile.tradingStyle === style ? styles.chipActive : ''}`}
                                                onClick={() => handleInputChange('tradingStyle', style)}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.value}>{profile.tradingStyle}</p>
                                )}
                            </div>

                            {/* Looking For */}
                            <div className={styles.field}>
                                <label className={styles.label}>Looking For</label>
                                {isEditing ? (
                                    <div className={styles.chipGroup}>
                                        {LOOKING_FOR.map(item => (
                                            <button
                                                key={item}
                                                className={`${styles.chip} ${profile.lookingFor === item ? styles.chipActive : ''}`}
                                                onClick={() => handleInputChange('lookingFor', item)}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.value}>{profile.lookingFor}</p>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>0</span>
                                <span className={styles.statLabel}>Matches</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>0</span>
                                <span className={styles.statLabel}>Super Likes</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>∞</span>
                                <span className={styles.statLabel}>Vibes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <MobileNav activeItem="profile" onNavigate={(item) => {
                if (item === 'discover') router.push('/');
                if (item === 'search') router.push('/');
                if (item === 'matches' || item === 'chat') router.push('/matches');
                if (item === 'profile') {
                    // Already on profile page
                }
            }} />
        </>
    );
}
