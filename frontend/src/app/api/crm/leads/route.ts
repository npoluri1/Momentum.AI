import { NextResponse } from 'next/server';

const leads = [
  { id: 'lead-1', name: 'Acme Corp', contactName: 'John Smith', email: 'john@acme.com', phone: '+1-555-0101', source: 'website', status: 'new', value: 50000, probability: 20, assignedTo: { name: 'Alice' }, createdAt: '2026-05-28T00:00:00Z' },
  { id: 'lead-2', name: 'TechStart Inc', contactName: 'Jane Doe', email: 'jane@techstart.io', phone: '+1-555-0102', source: 'referral', status: 'contacted', value: 75000, probability: 35, assignedTo: { name: 'Bob' }, createdAt: '2026-05-25T00:00:00Z' },
  { id: 'lead-3', name: 'GlobalSys', contactName: 'Bob Wilson', email: 'bob@globalsys.com', phone: '+1-555-0103', source: 'linkedin', status: 'qualified', value: 120000, probability: 60, assignedTo: { name: 'Alice' }, createdAt: '2026-05-20T00:00:00Z' },
];

export async function GET() {
  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ id: 'lead-' + Date.now(), ...data, createdAt: new Date().toISOString() }, { status: 201 });
}
