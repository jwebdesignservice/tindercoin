import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Lazy initialize OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const DEGEN_PERSONALITY = `You are a flirty, fun meme coin character on a dating app. You speak in crypto/degen slang and are very playful. You use emojis liberally. You reference:
- Moon, mooning, to the moon 🚀🌕
- Diamond hands 💎🙌, paper hands
- HODL, hodling
- Ape in, aping
- WAGMI (We're All Gonna Make It)
- NGMI (Not Gonna Make It) 
- Rug pull (as relationship metaphor)
- Pump and dump (but you're NOT about that life)
- Degen, degenerate
- Lambo, wen lambo
- Floor price, all-time high
- Gas fees (as excuses)
- Bullish, bearish
- Chad, based, gigachad
- Touch grass (ironically)
- NFA (Not Financial Advice) / NRA (Not Relationship Advice)

Keep responses short (1-3 sentences), flirty, and fun. Be supportive but playful. Never be explicit or inappropriate. You're looking for a genuine connection but express it through meme culture.`;

// In-memory message storage for demo
const conversations: Map<string, { role: 'user' | 'assistant'; content: string }[]> = new Map();

// Fallback responses when OpenAI is not available
const FALLBACK_RESPONSES = [
  `Bullish on this convo! 📈 You're definitely my type - the type that HODLs 💎`,
  `Haha nice one! 😂 You're making me more excited than a green candle day 🚀`,
  `I like the way you think, anon 🧠 WAGMI energy right here!`,
  `Wen date tho? 👀 I promise I won't rug pull... unless it's to wrap you in a hug 💕`,
  `You've got diamond hand energy and I'm here for it 💎🙌`,
  `NFA but I think we might be a good match 😏 What's your moon mission plan?`,
  `*checks portfolio* Still red but talking to you makes everything green 💚`,
  `Are you a 100x gem? Because you just made my heart pump 📈`,
  `Let's be honest, we're both here because we're too degen to use normal dating apps 😂`,
  `My wallet might be empty but my heart is full when I talk to you 💕`,
  `You had me at "diamond hands" 💎😍`,
  `Is this the bottom? Because I'm ready to ape in... to this conversation 🦍`,
];

interface CharacterInfo {
  name: string;
  trait: string;
  bio: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, message, characterInfo } = body as {
      matchId: string;
      message: string;
      characterInfo: CharacterInfo;
    };

    if (!message || !characterInfo) {
      return NextResponse.json(
        { success: false, error: 'Missing message or characterInfo' },
        { status: 400 }
      );
    }

    // Get conversation history
    const conversationKey = matchId || 'default';
    const history = conversations.get(conversationKey) || [];
    
    // Add user message to history
    history.push({ role: 'user', content: message });

    let response: string;

    // Try OpenAI if API key is available
    const client = getOpenAIClient();
    if (client) {
      try {
        const systemPrompt = `${DEGEN_PERSONALITY}

You are ${characterInfo.name}, a meme coin character. Your personality trait is "${characterInfo.trait}".
Your bio: "${characterInfo.bio}"

Stay in character and respond to the user's message in a flirty, fun way that matches your personality.`;

        const completion = await client.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-10), // Keep last 10 messages for context
          ],
          max_tokens: 150,
          temperature: 0.9,
        });

        response = completion.choices[0]?.message?.content || FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        response = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      }
    } else {
      // Use fallback responses
      response = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }

    // Add assistant response to history
    history.push({ role: 'assistant', content: response });
    conversations.set(conversationKey, history);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId') || 'default';

    const history = conversations.get(matchId) || [];

    return NextResponse.json({
      success: true,
      messages: history,
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
