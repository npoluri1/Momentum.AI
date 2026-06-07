import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  return NextResponse.json({
    token: 'mock-jwt-token-momentum-2024',
    user: { id: 'user-' + Date.now(), name, email, avatar: '', role: 'owner', workspaceId: 'ws-1' },
  });
}
