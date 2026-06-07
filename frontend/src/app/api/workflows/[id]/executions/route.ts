import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 'exec-1', workflowId: 'wf-1', status: 'success', startedAt: '2026-06-01T10:30:00Z', completedAt: '2026-06-01T10:30:05Z', duration: '5s', trigger: 'event', steps: [{ name: 'Assign User', status: 'success' }, { name: 'Send Notification', status: 'success' }] },
    { id: 'exec-2', workflowId: 'wf-1', status: 'success', startedAt: '2026-06-01T09:15:00Z', completedAt: '2026-06-01T09:15:03Z', duration: '3s', trigger: 'event', steps: [{ name: 'Assign User', status: 'success' }, { name: 'Send Notification', status: 'success' }] },
    { id: 'exec-3', workflowId: 'wf-1', status: 'failed', startedAt: '2026-06-01T08:00:00Z', completedAt: '2026-06-01T08:00:02Z', duration: '2s', trigger: 'event', error: 'Slack API rate limit exceeded', steps: [{ name: 'Assign User', status: 'success' }, { name: 'Send Notification', status: 'failed' }] },
  ]);
}
