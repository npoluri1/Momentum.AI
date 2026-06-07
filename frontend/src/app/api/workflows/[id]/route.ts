import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    id: params.id,
    name: 'Lead Follow-up',
    description: 'Auto-assign and notify sales team on new leads',
    trigger: { type: 'event', event: 'lead.created' },
    steps: [
      { id: 'step-1', type: 'assign_user', config: { team: 'sales' }, order: 0 },
      { id: 'step-2', type: 'send_notification', config: { channel: 'slack' }, order: 1 },
      { id: 'step-3', type: 'create_task', config: { list: 'follow-ups', priority: 'high' }, order: 2 },
    ],
    status: 'active',
    runCount: 145,
    lastRun: '2026-06-01T10:30:00Z',
    category: 'sales',
    createdAt: '2026-01-15T00:00:00Z',
  });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  return NextResponse.json({ id: params.id, ...data });
}

export async function DELETE() {
  return NextResponse.json({ success: true });
}
