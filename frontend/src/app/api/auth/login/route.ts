import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (email === 'demo@momentum.ai' && password === 'demo123') {
    return NextResponse.json({
      token: 'mock-jwt-token-momentum-2024',
      user: {
        id: 'user-1',
        name: 'Demo User',
        email: 'demo@momentum.ai',
        avatar: '',
        role: 'owner',
        workspaceId: 'ws-1',
      },
    });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
