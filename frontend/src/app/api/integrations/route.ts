import { NextResponse } from 'next/server';

const integrations = [
  { id: 'int-1', name: 'Slack', description: 'Send notifications and messages to Slack channels', icon: 'slack', category: 'communication', isConnected: true, connectedAt: '2026-01-20T00:00:00Z' },
  { id: 'int-2', name: 'Gmail', description: 'Send and receive emails through Gmail', icon: 'gmail', category: 'communication', isConnected: true, connectedAt: '2026-01-20T00:00:00Z' },
  { id: 'int-3', name: 'GitHub', description: 'Sync issues, PRs, and commits with projects', icon: 'github', category: 'development', isConnected: true, connectedAt: '2026-02-15T00:00:00Z' },
  { id: 'int-4', name: 'Google Drive', description: 'Attach files from Google Drive', icon: 'drive', category: 'storage', isConnected: false },
  { id: 'int-5', name: 'HubSpot', description: 'Two-way CRM sync with HubSpot', icon: 'hubspot', category: 'crm', isConnected: false },
  { id: 'int-6', name: 'Stripe', description: 'Payment processing and subscription management', icon: 'stripe', category: 'payments', isConnected: false },
  { id: 'int-7', name: 'Discord', description: 'Post updates and notifications to Discord', icon: 'discord', category: 'communication', isConnected: false },
  { id: 'int-8', name: 'Notion', description: 'Sync pages and databases with Notion', icon: 'notion', category: 'productivity', isConnected: false },
];

export async function GET() {
  return NextResponse.json(integrations);
}

export async function POST(req: Request) {
  const { id } = await req.json();
  return NextResponse.json({ id, isConnected: true, connectedAt: new Date().toISOString() });
}
