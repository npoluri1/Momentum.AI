'use client';

import React, { useState } from 'react';

const agents = [
  { id: 1, name: 'Sales Closer Agent', model: 'GPT-4o', status: 'Active', tasks: 124 },
  { id: 2, name: 'Support Bot', model: 'Claude 3.5', status: 'Training', tasks: 45 },
  { id: 3, name: 'Lead Qualifier', model: 'Gemini 1.5', status: 'Paused', tasks: 89 },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  return (
    <>
      {/* Left Pane */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">AI Agent Teams</h1>
        <div className="grid gap-2">
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              onClick={() => setSelectedAgent(agent)}
              className={`p-4 border rounded-lg shadow-sm cursor-pointer ${selectedAgent.id === agent.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800 hover:border-blue-500'}`}
            >
              <div className="font-semibold">{agent.name}</div>
              <div className="text-sm text-gray-500">{agent.model} · {agent.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane Injector */}
      <div className="hidden md:block fixed right-0 top-0 h-full w-[60%] border-l bg-gray-50 dark:bg-gray-900 p-8 overflow-y-auto translate-x-full md:translate-x-0">
        <h2 className="text-3xl font-bold mb-4">{selectedAgent.name}</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border space-y-4">
          <p><strong>Model:</strong> {selectedAgent.model}</p>
          <p><strong>Status:</strong> {selectedAgent.status}</p>
          <p><strong>Tasks Completed:</strong> {selectedAgent.tasks}</p>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Train Agent</button>
            <button className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">View Logs</button>
          </div>
        </div>
      </div>
    </>
  );
}
