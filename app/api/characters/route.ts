import { NextResponse } from 'next/server';
import charactersData from '@/data/characters.json';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      characters: charactersData,
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, age, bio, image_url, trait, distance_blocks, occupation } = body;

    // In a real app, this would save to the database
    // For now, we just validate and return success
    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      character: { id, name, age, bio, image_url, trait, distance_blocks, occupation },
    });
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create character' },
      { status: 500 }
    );
  }
}
