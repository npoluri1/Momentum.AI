'use client';

import React, { useState } from 'react';

const leads = [
  { id: 1, name: 'ACME Corp', status: 'In Progress', value: '$50,000', lastContact: '2026-05-15' },
  { id: 2, name: 'Global Tech', status: 'Negotiation', value: '$120,000', lastContact: '2026-05-16' },
  { id: 3, name: 'Startup Inc', status: 'New', value: '$15,000', lastContact: '2026-05-17' },
];

export default function CRMPage() {
  const [selectedLead, setSelectedLead] = useState(leads[0]);

  return (
    <>
      {/* Left Pane (Integrated into layout) */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">CRM Pipeline</h1>
        <div className="grid gap-2">
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              onClick={() => setSelectedLead(lead)}
              className={`p-4 border rounded-lg shadow-sm cursor-pointer ${selectedLead.id === lead.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800 hover:border-blue-500'}`}
            >
              <div className="font-semibold">{lead.name}</div>
              <div className="text-sm text-gray-500">{lead.status} · {lead.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane Injector (Manual override for demo) */}
      {/* Note: In a production app, use useLayoutContext or global state */}
      <div className="hidden md:block fixed right-0 top-0 h-full w-[60%] border-l bg-gray-50 dark:bg-gray-900 p-8 overflow-y-auto translate-x-full md:translate-x-0">
        <h2 className="text-3xl font-bold mb-4">{selectedLead.name}</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border space-y-4">
          <p><strong>Status:</strong> {selectedLead.status}</p>
          <p><strong>Deal Value:</strong> {selectedLead.value}</p>
          <p><strong>Last Contact:</strong> {selectedLead.lastContact}</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Update Status</button>
        </div>
      </div>
    </>
  );
}
