import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    id: 'exec-' + Date.now(),
    status: 'success',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    duration: '2s',
    steps: [{ name: 'Test Step', status: 'success' }],
  });
}
