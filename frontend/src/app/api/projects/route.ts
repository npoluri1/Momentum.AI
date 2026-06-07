import { NextResponse } from 'next/server';

const projects = [
  { id: 'proj-1', name: 'Website Redesign', description: 'Redesign company website with new brand', status: 'active', priority: 'high', progress: 65, dueDate: '2026-06-15', taskCount: 12, completedTasks: 8, members: [{ name: 'Alice' }, { name: 'Bob' }], color: '#ff2d60', view: 'board' },
  { id: 'proj-2', name: 'Mobile App v2', description: 'Mobile app redesign with new features', status: 'active', priority: 'urgent', progress: 30, dueDate: '2026-07-01', taskCount: 24, completedTasks: 7, members: [{ name: 'Carol' }, { name: 'Dave' }], color: '#a767e5', view: 'list' },
  { id: 'proj-3', name: 'Q4 Marketing Campaign', description: 'End of year marketing push', status: 'planning', priority: 'medium', progress: 10, dueDate: '2026-10-01', taskCount: 18, completedTasks: 2, members: [{ name: 'Eve' }], color: '#12bcfe', view: 'calendar' },
  { id: 'proj-4', name: 'CRM Integration', description: 'Connect CRM with sales platform', status: 'active', priority: 'high', progress: 80, dueDate: '2026-06-01', taskCount: 8, completedTasks: 6, members: [{ name: 'Frank' }, { name: 'Grace' }], color: '#4fcf70', view: 'board' },
  { id: 'proj-5', name: 'Internal Tools', description: 'Build internal tooling suite', status: 'on_hold', priority: 'low', progress: 45, dueDate: '2026-08-15', taskCount: 15, completedTasks: 7, members: [{ name: 'Hank' }], color: '#fad648', view: 'table' },
];

export async function GET() {
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const data = await req.json();
  const project = { id: 'proj-' + Date.now(), ...data, progress: 0, taskCount: 0, completedTasks: 0, members: [] };
  return NextResponse.json(project, { status: 201 });
}
