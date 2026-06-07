import { NextResponse } from 'next/server';

const deals = [
  { id: 'deal-1', title: 'Enterprise Plan - Acme Corp', contact: { name: 'John Smith' }, company: 'Acme Corp', value: 50000, stage: 'proposal', probability: 60, expectedClose: '2026-07-15', notes: 'Interested in enterprise features', createdAt: '2026-05-20T00:00:00Z' },
  { id: 'deal-2', title: 'Startup Package - TechStart', contact: { name: 'Jane Doe' }, company: 'TechStart Inc', value: 75000, stage: 'negotiation', probability: 80, expectedClose: '2026-06-30', notes: 'Finalizing contract terms', createdAt: '2026-05-15T00:00:00Z' },
  { id: 'deal-3', title: 'Infrastructure - GlobalSys', contact: { name: 'Bob Wilson' }, company: 'GlobalSys', value: 120000, stage: 'qualification', probability: 30, expectedClose: '2026-08-01', notes: 'Need to schedule demo', createdAt: '2026-05-10T00:00:00Z' },
  { id: 'deal-4', title: 'Consulting - SmallBiz', contact: { name: 'Sarah Lee' }, company: 'SmallBiz Co', value: 15000, stage: 'lead', probability: 10, expectedClose: '2026-09-01', notes: 'Initial contact made', createdAt: '2026-06-01T00:00:00Z' },
];

export async function GET() {
  return NextResponse.json(deals);
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ id: 'deal-' + Date.now(), ...data, createdAt: new Date().toISOString() }, { status: 201 });
}
