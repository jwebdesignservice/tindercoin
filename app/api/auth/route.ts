import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory user storage for demo
const users: Map<string, {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  walletAddress: string;
  createdAt: Date;
}> = new Map();

// Demo user
users.set('demo-user', {
  id: 'demo-user',
  username: 'anon_degen',
  displayName: 'Anon Degen',
  bio: 'Just a humble degen looking for my moon bag soulmate. Diamond hands only. WAGMI 🚀',
  avatarUrl: 'https://picsum.photos/seed/myprofile/400',
  walletAddress: '',
  createdAt: new Date(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    const user = users.get(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, displayName, bio, avatarUrl, walletAddress } = body;

    if (!username || !displayName) {
      return NextResponse.json(
        { success: false, error: 'Missing username or displayName' },
        { status: 400 }
      );
    }

    // Check if username exists
    const existingUser = Array.from(users.values()).find(u => u.username === username);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 400 }
      );
    }

    const newUser = {
      id: uuidv4(),
      username,
      displayName,
      bio: bio || '',
      avatarUrl: avatarUrl || `https://picsum.photos/seed/${username}/400`,
      walletAddress: walletAddress || '',
      createdAt: new Date(),
    };

    users.set(newUser.id, newUser);

    return NextResponse.json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', displayName, bio, avatarUrl, walletAddress } = body;

    const user = users.get(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user fields
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (walletAddress !== undefined) user.walletAddress = walletAddress;

    users.set(userId, user);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
