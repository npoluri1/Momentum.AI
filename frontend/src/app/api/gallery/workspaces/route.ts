import { NextResponse } from 'next/server';

const workspaces = [
  { id: 'gal-1', team: 'SALES', name: 'Pipeline that scores every lead', description: 'AI-powered lead scoring and pipeline management', screenshotUrl: '', projects: 4, agents: 2, flows: 3, category: 'Sales', cloneCount: 1234, isCloned: false, createdAt: '2026-01-15' },
  { id: 'gal-2', team: 'SALES', name: 'Neon CRM with deal tracking', description: 'Modern CRM with automated deal tracking', screenshotUrl: '', projects: 2, agents: 1, flows: 2, category: 'Sales', cloneCount: 892, isCloned: false, createdAt: '2026-02-10' },
  { id: 'gal-3', team: 'RESEARCH', name: 'AI insight matrix, live drill-down', description: 'Research analysis with real-time drill-down', screenshotUrl: '', projects: 16, agents: 10, flows: 7, category: 'Research', cloneCount: 2456, isCloned: true, createdAt: '2026-01-20' },
  { id: 'gal-4', team: 'RESEARCH', name: 'Eligibility analytics dashboard', description: 'Eligibility verification and analytics', screenshotUrl: '', projects: 3, agents: 1, flows: 1, category: 'Research', cloneCount: 567, isCloned: false, createdAt: '2026-03-05' },
  { id: 'gal-5', team: 'OPS', name: 'Finance tracker, profit at a glance', description: 'Real-time finance tracking dashboard', screenshotUrl: '', projects: 3, agents: 1, flows: 2, category: 'Operations', cloneCount: 1876, isCloned: true, createdAt: '2026-02-28' },
  { id: 'gal-6', team: 'OPS', name: 'Invoice generator that auto-sends', description: 'Automated invoice generation and delivery', screenshotUrl: '', projects: 3, agents: 1, flows: 4, category: 'Operations', cloneCount: 1456, isCloned: false, createdAt: '2026-03-15' },
  { id: 'gal-7', team: 'SUPPORT', name: 'Customer health with churn risk', description: 'Customer health monitoring with churn prediction', screenshotUrl: '', projects: 4, agents: 1, flows: 2, category: 'Support', cloneCount: 2341, isCloned: false, createdAt: '2026-04-01' },
  { id: 'gal-8', team: 'SUPPORT', name: 'SLA workflow with escalations', description: 'SLA management with automatic escalations', screenshotUrl: '', projects: 3, agents: 1, flows: 1, category: 'Support', cloneCount: 789, isCloned: false, createdAt: '2026-04-15' },
  { id: 'gal-9', team: 'MARKETING', name: 'Content Calendar Pro', description: 'AI-powered content planning and scheduling', screenshotUrl: '', projects: 5, agents: 2, flows: 4, category: 'Marketing', cloneCount: 3456, isCloned: true, createdAt: '2026-02-01' },
  { id: 'gal-10', team: 'MARKETING', name: 'Campaign Analytics Hub', description: 'Multi-channel campaign performance tracking', screenshotUrl: '', projects: 3, agents: 1, flows: 2, category: 'Marketing', cloneCount: 1234, isCloned: false, createdAt: '2026-03-20' },
  { id: 'gal-11', team: 'AI TOOLS', name: 'Agent Team Generator', description: 'Generate complete multi-agent teams from a prompt', screenshotUrl: '', projects: 2, agents: 5, flows: 3, category: 'AI Tools', cloneCount: 5678, isCloned: true, createdAt: '2026-05-01' },
  { id: 'gal-12', team: 'AI TOOLS', name: 'Workflow Automation Studio', description: 'Visual workflow builder with AI assistance', screenshotUrl: '', projects: 4, agents: 3, flows: 8, category: 'AI Tools', cloneCount: 4321, isCloned: false, createdAt: '2026-05-15' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  let filtered = workspaces;
  if (category && category !== 'All') {
    filtered = filtered.filter(w => w.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(w => w.name.toLowerCase().includes(s) || w.team.toLowerCase().includes(s));
  }
  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  const { workspaceId } = await req.json();
  return NextResponse.json({ success: true, workspaceId, message: 'Workspace cloned successfully!' });
}
