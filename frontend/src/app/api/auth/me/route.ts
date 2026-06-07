import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@momentum.ai',
    avatar: '',
    role: 'owner',
    workspaceId: 'ws-1',
  });
}
