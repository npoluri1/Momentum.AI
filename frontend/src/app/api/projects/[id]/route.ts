import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    id: params.id,
    name: 'Website Redesign',
    description: 'Redesign company website with new brand identity',
    status: 'active',
    priority: 'high',
    progress: 65,
    dueDate: '2026-06-15',
    taskCount: 12,
    completedTasks: 8,
    members: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }],
    color: '#ff2d60',
    view: 'board',
    createdAt: '2026-01-15T00:00:00Z',
  });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  return NextResponse.json({ id: params.id, ...data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true, id: params.id });
}
