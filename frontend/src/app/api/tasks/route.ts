import { NextResponse } from 'next/server';

const tasks = [
  { id: 'task-1', projectId: 'proj-1', title: 'Design new homepage', description: 'Create wireframes and high-fidelity mockups', status: 'in_progress', priority: 'high', assignee: { name: 'Alice' }, dueDate: '2026-06-10', labels: ['design', 'frontend'], comments: 3, subtasks: [{ title: 'Wireframes', done: true }, { title: 'High-fidelity mockups', done: false }] },
  { id: 'task-2', projectId: 'proj-1', title: 'Implement dark mode', description: 'Add dark mode support across all pages', status: 'todo', priority: 'medium', assignee: { name: 'Bob' }, dueDate: '2026-06-20', labels: ['frontend', 'ux'], comments: 1, subtasks: [] },
  { id: 'task-3', projectId: 'proj-1', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated deployment', status: 'done', priority: 'high', assignee: { name: 'Carol' }, dueDate: '2026-06-05', labels: ['devops'], comments: 0, subtasks: [{ title: 'Setup tests', done: true }, { title: 'Configure deployment', done: true }] },
  { id: 'task-4', projectId: 'proj-2', title: 'User authentication', description: 'Implement OAuth login flow', status: 'in_progress', priority: 'urgent', assignee: { name: 'Dave' }, dueDate: '2026-06-12', labels: ['backend', 'security'], comments: 5, subtasks: [] },
  { id: 'task-5', projectId: 'proj-2', title: 'Push notifications', description: 'Implement push notification system', status: 'todo', priority: 'low', assignee: { name: 'Eve' }, dueDate: '2026-07-01', labels: ['mobile'], comments: 0, subtasks: [] },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const filtered = projectId ? tasks.filter(t => t.projectId === projectId) : tasks;
  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  const data = await req.json();
  const task = { id: 'task-' + Date.now(), ...data, comments: 0, subtasks: [] };
  return NextResponse.json(task, { status: 201 });
}
