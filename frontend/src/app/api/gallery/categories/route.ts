import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    categories: [
      { id: 'all', name: 'All', count: 12 },
      { id: 'sales', name: 'Sales', count: 2 },
      { id: 'operations', name: 'Operations', count: 2 },
      { id: 'marketing', name: 'Marketing', count: 2 },
      { id: 'ai-tools', name: 'AI Tools', count: 2 },
      { id: 'support', name: 'Support', count: 2 },
      { id: 'research', name: 'Research', count: 2 },
    ],
  });
}
