import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    id: params.id,
    projectId: 'proj-1',
    title: 'Design new homepage',
    description: 'Create wireframes and high-fidelity mockups for the new homepage design system.',
    status: 'in_progress',
    priority: 'high',
    assignee: { name: 'Alice', avatar: '' },
    creator: { name: 'Demo User' },
    dueDate: '2026-06-10',
    createdAt: '2026-05-20T00:00:00Z',
    labels: ['design', 'frontend'],
    comments: [],
    subtasks: [{ id: 'st-1', title: 'Wireframes', done: true }, { id: 'st-2', title: 'High-fidelity mockups', done: false }],
    attachments: [],
  });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  return NextResponse.json({ id: params.id, ...data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true });
}
