import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalProjects: 12,
    activeTasks: 48,
    completedTasks: 156,
    totalAgents: 5,
    activeWorkflows: 8,
    totalDeals: 24,
    crmValue: 284500,
    teamMembers: 8,
    recentActivity: [
      { id: '1', type: 'task_completed', message: 'Completed "API Integration"', time: '2m ago', user: { name: 'Sarah', avatar: '' } },
      { id: '2', type: 'deal_won', message: 'Deal closed: Enterprise Plan', time: '15m ago', user: { name: 'Mike', avatar: '' } },
      { id: '3', type: 'agent_action', message: 'Agent drafted Q4 report', time: '1h ago', user: { name: 'EVE', avatar: '' } },
    ],
  });
}
