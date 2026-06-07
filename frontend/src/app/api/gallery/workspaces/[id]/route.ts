import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    id: params.id,
    team: 'SALES',
    name: 'Pipeline that scores every lead',
    description: 'AI-powered lead scoring and pipeline management with automated follow-ups',
    screenshotUrl: '',
    projectCount: 4,
    agentCount: 2,
    flowCount: 3,
    category: 'Sales',
    cloneCount: 1234,
    isCloned: false,
    createdAt: '2026-01-15',
    projects: ['Lead Scoring Engine', 'Pipeline Dashboard', 'Follow-up Automator', 'Analytics Hub'],
    agents: ['Lead Enricher', 'SDR Assistant'],
    flows: ['New Lead Alert', 'Warm Lead Follow-up', 'Deal Stage Notification'],
  });
}
