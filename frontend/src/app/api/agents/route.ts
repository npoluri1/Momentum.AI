import { NextResponse } from 'next/server';

const agents = [
  { id: 'agent-1', name: 'EVE', title: 'Meta Agent', description: 'Entity of Vision & Execution - your AI workspace conductor', provider: 'openai', model: 'gpt-4o', category: 'assistant', isActive: true, avatar: '', color: '#ff2d60', temperature: 0.7, maxTokens: 4096, tools: ['web_search', 'task_management', 'code_execution', 'data_analysis'], memory: true },
  { id: 'agent-2', name: 'Lead Enricher', title: 'SDR Agent', description: 'Enriches leads with company data, social profiles, and intent signals', provider: 'anthropic', model: 'claude-sonnet-4', category: 'sales', isActive: true, avatar: '', color: '#a767e5', temperature: 0.3, maxTokens: 2048, tools: ['web_search', 'crm_sync'], memory: true },
  { id: 'agent-3', name: 'Content Writer', title: 'Marketing Agent', description: 'Creates blog posts, social content, and marketing copy', provider: 'openai', model: 'gpt-4o', category: 'marketing', isActive: true, avatar: '', color: '#12bcfe', temperature: 0.8, maxTokens: 4096, tools: ['web_search', 'web_fetch'], memory: true },
  { id: 'agent-4', name: 'Code Reviewer', title: 'Developer Agent', description: 'Reviews pull requests, suggests improvements, catches bugs', provider: 'anthropic', model: 'claude-opus-4', category: 'engineering', isActive: true, avatar: '', color: '#4fcf70', temperature: 0.2, maxTokens: 8192, tools: ['code_execution', 'github_sync'], memory: true },
  { id: 'agent-5', name: 'Data Analyst', title: 'Analytics Agent', description: 'Analyzes data, creates reports, finds insights', provider: 'google', model: 'gemini-pro', category: 'analytics', isActive: false, avatar: '', color: '#fad648', temperature: 0.4, maxTokens: 4096, tools: ['data_analysis', 'web_search'], memory: true },
];

export async function GET() {
  return NextResponse.json(agents);
}

export async function POST(req: Request) {
  const data = await req.json();
  const agent = { id: 'agent-' + Date.now(), ...data, isActive: true, tools: [], memory: true };
  return NextResponse.json(agent, { status: 201 });
}
