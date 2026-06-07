import { NextResponse } from 'next/server';

const workflows = [
  { id: 'wf-1', name: 'Lead Follow-up', description: 'Auto-assign and notify sales team on new leads', trigger: { type: 'event', event: 'lead.created' }, steps: [{ type: 'assign_user', config: { team: 'sales' } }, { type: 'send_notification', config: { channel: 'slack' } }, { type: 'create_task', config: { list: 'follow-ups' } }], status: 'active', runCount: 145, lastRun: '2026-06-01T10:30:00Z', category: 'sales' },
  { id: 'wf-2', name: 'Deal Stage Change', description: 'Update pipeline when deal stage changes', trigger: { type: 'event', event: 'deal.stage_changed' }, steps: [{ type: 'update_field', config: { field: 'probability' } }, { type: 'send_email', config: { template: 'stage_update' } }], status: 'active', runCount: 89, lastRun: '2026-06-01T09:15:00Z', category: 'crm' },
  { id: 'wf-3', name: 'Daily Report', description: 'Generate daily summary of all activity', trigger: { type: 'schedule', cron: '0 8 * * *' }, steps: [{ type: 'generate_report', config: { format: 'email' } }, { type: 'send_email', config: { to: 'team@company.com' } }], status: 'inactive', runCount: 230, lastRun: '2026-05-31T08:00:00Z', category: 'reports' },
  { id: 'wf-4', name: 'Task Escalation', description: 'Escalate overdue tasks to managers', trigger: { type: 'event', event: 'task.overdue' }, steps: [{ type: 'send_notification', config: { channel: 'email' } }, { type: 'assign_user', config: { team: 'managers' } }], status: 'active', runCount: 56, lastRun: '2026-06-01T11:00:00Z', category: 'tasks' },
];

export async function GET() {
  return NextResponse.json(workflows);
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ id: 'wf-' + Date.now(), ...data, status: 'inactive', runCount: 0 }, { status: 201 });
}
