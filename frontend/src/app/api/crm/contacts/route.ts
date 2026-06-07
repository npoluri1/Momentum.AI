import { NextResponse } from 'next/server';

const contacts = [
  { id: 'contact-1', name: 'John Smith', email: 'john@acme.com', phone: '+1-555-0101', company: 'Acme Corp', role: 'CTO', status: 'active', lastContacted: '2026-05-30', deals: 2, value: 85000 },
  { id: 'contact-2', name: 'Jane Doe', email: 'jane@techstart.io', phone: '+1-555-0102', company: 'TechStart Inc', role: 'CEO', status: 'active', lastContacted: '2026-05-28', deals: 1, value: 75000 },
  { id: 'contact-3', name: 'Bob Wilson', email: 'bob@globalsys.com', phone: '+1-555-0103', company: 'GlobalSys', role: 'VP Engineering', status: 'active', lastContacted: '2026-05-25', deals: 3, value: 200000 },
];

export async function GET() {
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ id: 'contact-' + Date.now(), ...data, deals: 0, value: 0 }, { status: 201 });
}
