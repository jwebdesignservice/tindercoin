import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demo (would use database in production)
const swipes: Map<string, { characterId: string; direction: string; timestamp: Date }[]> = new Map();
const matches: Map<string, { id: string; characterId: string; matchedAt: Date; location: string }[]> = new Map();

const CRYPTO_LOCATIONS = [
  'The DEX',
  'Uniswap Pool Party',
  'ETH Denver',
  'The Blockchain',
  'Crypto Twitter',
  'The Moon Base 🌙',
  'Diamond Hand Island',
  'WAGMI Valley',
  'Pump Station',
  'The Liquidity Pool',
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', characterId, direction } = body;

    if (!characterId || !direction) {
      return NextResponse.json(
        { success: false, error: 'Missing characterId or direction' },
        { status: 400 }
      );
    }

    // Record the swipe
    const userSwipes = swipes.get(userId) || [];
    userSwipes.push({
      characterId,
      direction,
      timestamp: new Date(),
    });
    swipes.set(userId, userSwipes);

    // Check for match (simulate 50% match rate on right swipes)
    let isMatch = false;
    let matchData = null;

    if ((direction === 'right' || direction === 'up') && Math.random() > 0.5) {
      isMatch = true;
      const location = CRYPTO_LOCATIONS[Math.floor(Math.random() * CRYPTO_LOCATIONS.length)];
      
      matchData = {
        id: uuidv4(),
        characterId,
        matchedAt: new Date(),
        location,
      };

      const userMatches = matches.get(userId) || [];
      userMatches.push(matchData);
      matches.set(userId, userMatches);
    }

    return NextResponse.json({
      success: true,
      swipe: {
        characterId,
        direction,
      },
      isMatch,
      match: matchData,
    });
  } catch (error) {
    console.error('Error processing swipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process swipe' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    const userSwipes = swipes.get(userId) || [];
    
    return NextResponse.json({
      success: true,
      swipes: userSwipes,
    });
  } catch (error) {
    console.error('Error fetching swipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch swipes' },
      { status: 500 }
    );
  }
}
