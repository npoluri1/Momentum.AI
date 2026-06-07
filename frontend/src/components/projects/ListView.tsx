"use client";

import React from 'react';

export default function ListView({ tasks }: { tasks: { id: string; title: string; status?: string }[] }) {
  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <div key={t.id} className="rounded-lg p-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t.title}</div>
            <div className="text-xs text-surface-500">{t.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

