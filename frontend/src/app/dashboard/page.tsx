'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const sectors = [
  { id: 'energy', name: 'Energy & Electrical', status: 'Optimal', risk: 'Low' },
  { id: 'defense', name: 'Defense & Military', status: 'Alert', risk: 'Medium' },
  { id: 'infra', name: 'Infrastructure', status: 'Optimal', risk: 'Low' },
  { id: 'finance', name: 'Financial Resilience', status: 'Stable', risk: 'Low' },
  { id: 'space', name: 'Space Operations', status: 'Optimal', risk: 'Low' },
  { id: 'gov', name: 'Governance & Policy', status: 'Optimal', risk: 'Low' },
];

export default function CommandCenter() {
  const [selectedSector, setSelectedSector] = useState(sectors[0]);

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar - Global Nav */}
      <aside className="w-72 border-r border-gray-800 p-6">
        <h1 className="text-2xl font-bold mb-8 text-blue-400">GIO COMMAND</h1>
        <div className="space-y-4">
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSector(s)}
              className={`w-full text-left p-4 rounded-lg transition ${selectedSector.id === s.id ? 'bg-blue-600' : 'bg-gray-900 hover:bg-gray-800'}`}
            >
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-400">Status: {s.status} | Risk: {s.risk}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* Dashboard View */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{selectedSector.name} Overview</h2>
          <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-full border border-green-800">
            Systemic Integrity: 99.8%
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Real-Time Telemetry</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg text-gray-500">
              [Live GIO Data Visualization]
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Active Agent Tasks</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800 rounded border-l-4 border-yellow-500">
                <p className="font-medium">Optimize grid distribution</p>
                <p className="text-xs text-gray-400">Agent: Energy-Alpha</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
