import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    id: params.id,
    name: 'EVE',
    title: 'Meta Agent',
    description: 'Entity of Vision & Execution - your AI workspace conductor',
    provider: 'openai',
    model: 'gpt-4o',
    category: 'assistant',
    isActive: true,
    avatar: '',
    color: '#ff2d60',
    temperature: 0.7,
    maxTokens: 4096,
    tools: ['web_search', 'task_management', 'code_execution', 'data_analysis', 'web_fetch', 'crm_sync'],
    memory: true,
    systemPrompt: 'You are EVE, the Entity of Vision & Execution. Help users build apps, create agents, and automate workflows.',
    knowledgeSources: [{ name: 'Workspace Docs', type: 'project', id: 'proj-1' }],
  });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  return NextResponse.json({ id: params.id, ...data });
}

export async function DELETE(_req: Request) {
  return NextResponse.json({ success: true });
}
