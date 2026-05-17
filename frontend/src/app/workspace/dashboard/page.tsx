'use client';

import React, { useState, useEffect } from 'react';

export default function SystemicRiskDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('http://localhost:8000/api/gio/simulate');
      const json = await res.json();
      setData(json);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading Systemic Risk Engine...</div>;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Systemic Risk Dashboard</h1>
      
      {/* Metric Tiles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl bg-white dark:bg-gray-800">
          <div className="text-sm text-gray-500">Energy Grid Load</div>
          <div className="text-3xl font-bold">{data.data.energy_grid.load}%</div>
        </div>
        <div className="p-4 border rounded-xl bg-white dark:bg-gray-800">
          <div className="text-sm text-gray-500">Manufacturing Output</div>
          <div className="text-3xl font-bold">{data.data.manufacturing.output}%</div>
        </div>
      </div>

      {/* Risks */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Active Risks</h2>
        {data.risks.map((risk: any, i: number) => (
          <div key={i} className="p-3 mb-2 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
            {risk.message}
          </div>
        ))}
      </div>

      {/* Agent Tasks */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Agentic Responses</h2>
        {data.tasks.map((task: any) => (
          <div key={task.id} className="p-3 border-l-4 border-blue-500 bg-white dark:bg-gray-800 mb-2">
            <div className="font-semibold">{task.title}</div>
            <div className="text-sm text-gray-500">{task.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
