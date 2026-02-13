import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tinder Coin 🔥 | Find Your Moon Bag Match',
  description: 'Swipe right on your favorite meme coins. WAGMI together! 🚀',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
