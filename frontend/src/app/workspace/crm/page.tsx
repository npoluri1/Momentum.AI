'use client';

import React, { useState } from 'react';
import {
  Users, Plus, Search, MoreHorizontal, Phone, Mail,
  DollarSign, Calendar, User, Building, MessageSquare,
  ArrowRight, Circle, Sparkles, FileText, CheckCircle,
  TrendingUp, Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stages = [
  { id: 'new', label: 'New Leads', color: 'border-l-intelligence-500', icon: Circle },
  { id: 'contacted', label: 'Contacted', color: 'border-l-execution-500', icon: MessageSquare },
  { id: 'qualified', label: 'Qualified', color: 'border-l-brand-500', icon: User },
  { id: 'proposal', label: 'Proposal', color: 'border-l-warning-500', icon: FileText },
  { id: 'negotiation', label: 'Negotiation', color: 'border-l-brand-500', icon: DollarSign },
  { id: 'closed', label: 'Closed Won', color: 'border-l-memory-500', icon: CheckCircle },
];

const allLeads = [
  { id: 1, name: 'ACME Corp', contact: 'Sarah Chen', stage: 'new', value: '$50,000', lastContact: '2026-05-15', company: 'ACME Corporation', email: 'sarah@acme.com', phone: '+1 555-0123', probability: 20 },
  { id: 2, name: 'Global Tech', contact: 'Mike Ross', stage: 'negotiation', value: '$120,000', lastContact: '2026-05-16', company: 'Global Tech Inc', email: 'mike@globaltech.com', phone: '+1 555-0456', probability: 75 },
  { id: 3, name: 'Startup Inc', contact: 'Alice Wu', stage: 'new', value: '$15,000', lastContact: '2026-05-17', company: 'Startup Inc', email: 'alice@startup.io', phone: '+1 555-0789', probability: 15 },
  { id: 4, name: 'MegaCorp', contact: 'James Wilson', stage: 'qualified', value: '$250,000', lastContact: '2026-05-14', company: 'MegaCorp Ltd', email: 'james@megacorp.com', phone: '+1 555-0321', probability: 40 },
  { id: 5, name: 'TechVentures', contact: 'Emma Liu', stage: 'proposal', value: '$85,000', lastContact: '2026-05-13', company: 'TechVentures LLC', email: 'emma@techventures.com', phone: '+1 555-0654', probability: 55 },
  { id: 6, name: 'CloudBase', contact: 'David Park', stage: 'contacted', value: '$45,000', lastContact: '2026-05-12', company: 'CloudBase Systems', email: 'david@cloudbase.com', phone: '+1 555-0987', probability: 25 },
  { id: 7, name: 'DataFlow', contact: 'Lisa Brown', stage: 'closed', value: '$200,000', lastContact: '2026-05-10', company: 'DataFlow Inc', email: 'lisa@dataflow.com', phone: '+1 555-0111', probability: 100 },
  { id: 8, name: 'NexGen Solutions', contact: 'Tom Harris', stage: 'qualified', value: '$175,000', lastContact: '2026-05-11', company: 'NexGen Solutions', email: 'tom@nexgen.com', phone: '+1 555-0222', probability: 35 },
];

export default function CRMPage() {
  const [draggedLead, setDraggedLead] = useState<number | null>(null);
  const [leads, setLeads] = useState(allLeads);
  const [selectedLead, setSelectedLead] = useState(allLeads[1]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragStart = (leadId: number) => {
    setDraggedLead(leadId);
  };

  const handleDrop = (stageId: string) => {
    if (draggedLead === null) return;
    setLeads(prev => prev.map(l => l.id === draggedLead ? { ...l, stage: stageId } : l));
    setDraggedLead(null);
  };

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStageLeads = (stageId: string) => filteredLeads.filter(l => l.stage === stageId);

  const totalValue = leads.reduce((sum, l) => {
    const val = parseInt(l.value.replace(/[$,]/g, ''));
    return sum + Math.round(val * (l.probability / 100));
  }, 0);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Apple style */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-surface-200/50 dark:border-white/[0.06] bg-white/50 dark:bg-[#0a0a0f]/30 backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">CRM Pipeline</h1>
            <p className="text-sm text-surface-500 mt-1">{leads.length} deals · <span className="text-brand-500 font-medium">${totalValue.toLocaleString()}</span> weighted pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search leads..."
                className="apple-input w-56 pl-10 py-2"
              />
            </div>
            <button className="apple-button-primary">
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* Kanban board - Apple style */}
        <div className="flex-1 overflow-x-auto p-6 md:p-8">
          <div className="flex gap-5 h-full min-w-max">
            {stages.map(stage => {
              const stageLeads = getStageLeads(stage.id);
              const StageIcon = stage.icon;
              return (
                <div
                  key={stage.id}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(stage.id)}
                  className="flex flex-col w-72 shrink-0"
                >
                  {/* Stage header */}
                  <div className={cn(
                    'flex items-center justify-between mb-3 px-4 py-3 rounded-2xl border bg-white/60 dark:bg-[#0a0a0f]/60 backdrop-blur-xl border-l-2 shadow-sm',
                    stage.color,
                    'border-surface-200/40 dark:border-white/[0.06]'
                  )}>
                    <div className="flex items-center gap-2.5">
                      <StageIcon className="w-4 h-4 text-surface-500" />
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">{stage.label}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-100/80 dark:bg-white/[0.08] text-surface-500">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto min-h-[200px] pr-1">
                    {stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        onClick={() => setSelectedLead(lead)}
                        className={cn(
                          'apple-card p-4 cursor-grab active:cursor-grabbing',
                          selectedLead.id === lead.id ? 'ring-2 ring-brand-500/30' : ''
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-sm text-surface-900 dark:text-white">{lead.name}</h4>
                        </div>
                        <p className="text-xs text-surface-500 mb-3 flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-surface-400" /> {lead.contact}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-surface-100/50 dark:border-white/[0.06]">
                          <span className="text-sm font-bold text-surface-900 dark:text-white">{lead.value}</span>
                          <div className="flex items-center gap-1.5 text-xs">
                            <div className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              lead.probability >= 70 ? 'bg-memory-500' : lead.probability >= 40 ? 'bg-warning-500' : 'bg-surface-400'
                            )} />
                            <span className="font-medium text-surface-500">{lead.probability}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="flex items-center justify-center h-24 rounded-2xl border-2 border-dashed border-surface-200/50 dark:border-white/[0.06] text-xs text-surface-400 bg-surface-50/30 dark:bg-white/[0.02]">
                        Drop leads here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail panel - Apple style */}
      <aside className="hidden lg:block w-[400px] border-l border-surface-200/50 dark:border-white/[0.06] p-6 md:p-8 overflow-y-auto bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl">
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-warning-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Building className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">{selectedLead.name}</h2>
              <p className="text-sm text-surface-500 mt-0.5">{selectedLead.company}</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="apple-card divide-y divide-surface-100/50 dark:divide-white/[0.04]">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <User className="w-4 h-4" /> Contact
                </div>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{selectedLead.contact}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <Mail className="w-4 h-4" /> Email
                </div>
                <span className="text-sm text-surface-900 dark:text-white">{selectedLead.email}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <Phone className="w-4 h-4" /> Phone
                </div>
                <span className="text-sm text-surface-900 dark:text-white">{selectedLead.phone}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <DollarSign className="w-4 h-4 text-memory-500" /> Deal Value
                </div>
                <span className="text-lg font-bold text-surface-900 dark:text-white">{selectedLead.value}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <Calendar className="w-4 h-4" /> Last Contact
                </div>
                <span className="text-sm text-surface-900 dark:text-white">{selectedLead.lastContact}</span>
              </div>
            </div>

            {/* Win Probability */}
            <div className="apple-card p-4">
              <div className="flex items-center justify-between text-sm mb-2.5">
                <div className="flex items-center gap-2 text-surface-500">
                  <Target className="w-4 h-4 text-brand-500" /> Win Probability
                </div>
                <span className="font-bold text-surface-900 dark:text-white">{selectedLead.probability}%</span>
              </div>
              <div className="apple-progress h-2">
                <div
                  className={cn(
                    'apple-progress-bar',
                    selectedLead.probability >= 70 ? 'bg-memory-500' : selectedLead.probability >= 40 ? 'bg-warning-500' : 'bg-surface-400'
                  )}
                  style={{ width: `${selectedLead.probability}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="apple-button-primary w-full">
              <MessageSquare className="w-4 h-4" /> Send Message
            </button>
            <button className="apple-button-secondary w-full">
              <Phone className="w-4 h-4" /> Schedule Call
            </button>
            <button className="apple-button-secondary w-full">
              <Sparkles className="w-4 h-4" /> AI Insights
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-surface-400 hover:text-danger-500 hover:bg-danger-500/5 transition-all">
              <MoreHorizontal className="w-4 h-4" /> More Options
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
