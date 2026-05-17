import React from 'react';

const automations = [
  { id: 1, name: 'Lead Email Outreach', trigger: 'New CRM Lead', status: 'Running' },
  { id: 2, name: 'Support Ticket Escalation', trigger: 'Low Satisfaction', status: 'Stopped' },
];

export default function AutomationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Automation Flows</h1>
      <div className="grid gap-2">
        {automations.map((automation) => (
          <div key={automation.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:border-blue-500 cursor-pointer">
            <div className="font-semibold">{automation.name}</div>
            <div className="text-sm text-gray-500">Trigger: {automation.trigger} · {automation.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
