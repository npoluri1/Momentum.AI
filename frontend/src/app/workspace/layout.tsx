import React from 'react';
import Link from 'next/link';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Sidebar - Workspace Navigation */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 font-bold text-lg">Momentum.AI</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900">Dashboard</Link>
          <Link href="/crm" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900">CRM</Link>
          <Link href="/agents" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900">AI Agents</Link>
          <Link href="/automations" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900">Automations</Link>
        </nav>
      </aside>

      {/* Main Content Area - Split View Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane - List/Data */}
        <section className="flex-[0.4] border-r border-gray-200 dark:border-gray-800 overflow-y-auto p-4">
            {children}
        </section>

        {/* Right Pane - Detail/Agent */}
        <section className="flex-[0.6] overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-gray-500 italic text-center mt-20">Select an item to view details...</div>
        </section>
      </main>
    </div>
  );
}
