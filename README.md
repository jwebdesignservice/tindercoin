# 🔥 Tinder Coin - Meme Coin Dating App

Swipe right on your favorite meme coins! A full-stack Tinder clone built for the degen community.

## Features

- 🃏 **Swipeable Cards** - Drag cards left/right with physics animations
- 💕 **Match System** - "It's a Match!" celebration with confetti
- 💬 **Chat with AI** - Flirty degen chatbot responses (OpenAI powered)
- 👤 **Profile System** - Crypto-themed profile creation
- 📱 **Responsive Design** - Desktop split-view & mobile layouts
- 🎨 **Playful 3px Borders** - Meme-y aesthetic throughout

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, CSS Modules
- **Animations:** Framer Motion
- **Backend:** Next.js API Routes
- **AI Chat:** OpenAI GPT-3.5-turbo (with fallbacks)
- **Database:** SQLite (better-sqlite3) - for production use

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/tinder-coin.git
cd tinder-coin
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

4. (Optional) Add your OpenAI API key to `.env` for AI-powered chat responses

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
/app
  /page.tsx              # Main swipe view
  /profile/page.tsx      # User profile
  /matches/page.tsx      # Matches list
  /chat/[id]/page.tsx    # Chat interface
  /api
    /auth/route.ts       # User authentication
    /characters/route.ts # Character data
    /swipe/route.ts      # Swipe actions
    /matches/route.ts    # Match management
    /chat/route.ts       # AI chatbot

/components
  /Header.tsx            # Meme coin header with CA
  /SwipeCard.tsx         # Draggable profile card
  /CardStack.tsx         # Card stack manager
  /Sidebar.tsx           # Desktop sidebar
  /ActionButtons.tsx     # Like/Nope buttons
  /MatchModal.tsx        # Match celebration
  /ChatBubble.tsx        # Message bubbles
  /MobileNav.tsx         # Mobile navigation

/lib
  /db.ts                 # SQLite database
  /chatbot.ts            # OpenAI integration

/data
  /characters.json       # 18 meme characters
\`\`\`

## Meme Characters

The app includes 18 unique meme coin characters:

- 🐸 Pepe - OG meme lord
- 🐕 Doge - Much wow
- 🐶 Shiba - Doge killer
- 😢 Wojak - Emotional trader
- 💪 GigaChad - Mega alpha
- 🌙 Luna - Comeback queen
- 🦍 Bored Ape - NFT royalty
- 🐸 Dat Boi - Unicycle master
- 🎹 Keyboard Cat - Musical genius
- 🌈 Nyan Cat - Rainbow energy
- 📈 Stonks Guy - Eternal optimist
- 🦍 Harambe - Legend
- ⚔️ Floki - Viking warrior
- 🏏 Bonk - Bonk master
- 🍔 Cheems - Cheemsburger chef
- 😾 Grumpy Cat - Lovable grump
- ✊ Success Kid - Winning
- 😏 Trollface - Master troll

## Customization

### Adding Characters

Edit `/data/characters.json` to add new meme characters:

\`\`\`json
{
  "id": "unique-id",
  "name": "Character Name",
  "age": 25,
  "bio": "Crypto-themed bio with emojis 🚀",
  "image_url": "https://...",
  "trait": "TRAIT NAME",
  "distance_blocks": 420,
  "occupation": "Job Title"
}
\`\`\`

### Styling

- Colors: Edit CSS variables in `/app/globals.css`
- Borders: All elements use 3px playful borders
- Fonts: Poppins for body, Permanent Marker for titles

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Self-Hosted

\`\`\`bash
npm run build
npm start
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| OPENAI_API_KEY | OpenAI API key for chat | No (uses fallbacks) |

## Contributing

PRs welcome! Feel free to add more meme characters or features.

## License

MIT License - WAGMI 🚀

---

Built with 💎🙌 by degens, for degens.
