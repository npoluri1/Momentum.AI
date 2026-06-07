import { NextResponse } from 'next/server';

const responses: Record<string, string> = {
  'agent-1': 'I am EVE, your workspace meta-agent. How can I help you build something amazing today? I can help you create apps, manage projects, deploy AI agents, or set up automations.',
  'agent-2': 'I can help enrich your leads with company data, social profiles, and buying intent. Drop me a list of companies or contacts and I will research them.',
  'agent-3': 'Ready to create some compelling content! Tell me the topic, tone, and format you need and I will draft it for you.',
  'agent-4': 'I review code for bugs, security issues, and best practices. Share your code snippet or PR and I will analyze it.',
  'agent-5': 'Point me to your data and I will analyze it for trends, anomalies, and actionable insights.',
};

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { content } = await req.json();
  const agentResponse = responses[params.id] || 'Hello! How can I assist you today?';
  const response = {
    id: 'msg-' + Date.now(),
    role: 'assistant',
    content: agentResponse,
    agentId: params.id,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
