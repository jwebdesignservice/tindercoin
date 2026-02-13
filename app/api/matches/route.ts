import { NextResponse } from 'next/server';
import charactersData from '@/data/characters.json';

// In-memory storage for demo
const matches: Map<string, { id: string; characterId: string; matchedAt: Date; location: string }[]> = new Map();

// Initialize with some demo matches
matches.set('demo-user', [
  {
    id: 'match-1',
    characterId: 'pepe-01',
    matchedAt: new Date(),
    location: 'The DEX',
  },
  {
    id: 'match-2',
    characterId: 'doge-02',
    matchedAt: new Date(Date.now() - 3600000),
    location: 'Uniswap Pool Party',
  },
]);

interface Character {
  id: string;
  name: string;
  age: number;
  bio: string;
  image_url: string;
  trait: string;
  distance_blocks: number;
  occupation: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    const userMatches = matches.get(userId) || [];
    
    // Enrich matches with character data
    const enrichedMatches = userMatches.map(match => {
      const character = (charactersData as Character[]).find(c => c.id === match.characterId);
      return {
        ...match,
        character,
      };
    });

    return NextResponse.json({
      success: true,
      matches: enrichedMatches,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', characterId, location } = body;

    if (!characterId) {
      return NextResponse.json(
        { success: false, error: 'Missing characterId' },
        { status: 400 }
      );
    }

    const userMatches = matches.get(userId) || [];
    const newMatch = {
      id: `match-${Date.now()}`,
      characterId,
      matchedAt: new Date(),
      location: location || 'The Blockchain',
    };
    
    userMatches.push(newMatch);
    matches.set(userId, userMatches);

    const character = (charactersData as Character[]).find(c => c.id === characterId);

    return NextResponse.json({
      success: true,
      match: {
        ...newMatch,
        character,
      },
    });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create match' },
      { status: 500 }
    );
  }
}
