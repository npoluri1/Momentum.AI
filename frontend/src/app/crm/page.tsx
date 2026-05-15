'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Users, TrendingUp, DollarSign, Target, Plus } from 'lucide-react';
import type { CRMDeal } from '@/lib/types';

const pipelineStages = [
  { id: 'lead', label: 'Lead', color: 'border-t-gray-500' },
  { id: 'qualified', label: 'Qualified', color: 'border-t-blue-500' },
  { id: 'proposal', label: 'Proposal', color: 'border-t-amber-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'border-t-orange-500' },
  { id: 'closed_won', label: 'Closed Won', color: 'border-t-green-500' },
  { id: 'closed_lost', label: 'Closed Lost', color: 'border-t-red-500' },
];

export default function CRMPage() {
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [leads, setLeads] = useState<{ id: string; name: string; email: string; status: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getDeals(),
      api.getLeads(),
    ])
      .then(([d, l]) => { setDeals(d); setLeads(l); })
      .catch(() => setError('Failed to load CRM data'))
      .finally(() => setLoading(false));
  }, []);

  const totalValue = deals.reduce((sum, d) => sum + (d.stage !== 'closed_lost' ? d.value : 0), 0);
  const wonValue = deals.filter((d) => d.stage === 'closed_won').reduce((sum, d) => sum + d.value, 0);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-indigo-400 hover:text-indigo-300 text-sm">Try again</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse" />)}</div>
      <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />
    </div>;
  }

  const dealsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((d) => d.stage === stage.id);
    return acc;
  }, {} as Record<string, CRMDeal[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <Link href="/crm/leads"><Button variant="outline"><Target className="h-4 w-4" />Leads</Button></Link>
          <Link href="/crm/contacts"><Button variant="outline"><Users className="h-4 w-4" />Contacts</Button></Link>
          <Link href="/crm/deals"><Button><DollarSign className="h-4 w-4" />Deals</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10"><DollarSign className="h-5 w-5 text-blue-400" /></div>
            </div>
            <p className="text-2xl font-bold text-white">${(totalValue / 1000).toFixed(1)}k</p>
            <p className="text-sm text-gray-500">Pipeline Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="p-2 rounded-lg bg-green-500/10"><TrendingUp className="h-5 w-5 text-green-400" /></div>
            <p className="text-2xl font-bold text-white">${(wonValue / 1000).toFixed(1)}k</p>
            <p className="text-sm text-gray-500">Closed Won</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="p-2 rounded-lg bg-amber-500/10"><Target className="h-5 w-5 text-amber-400" /></div>
            <p className="text-2xl font-bold text-white">{deals.length}</p>
            <p className="text-sm text-gray-500">Active Deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="p-2 rounded-lg bg-purple-500/10"><Users className="h-5 w-5 text-purple-400" /></div>
            <p className="text-2xl font-bold text-white">{leads.length}</p>
            <p className="text-sm text-gray-500">Total Leads</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-medium text-gray-300">Pipeline</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {pipelineStages.map((stage) => (
              <div key={stage.id} className={cn('rounded-xl bg-gray-900/50 border border-gray-800 border-t-2', stage.color)}>
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                  <span className="text-xs font-medium text-gray-300">{stage.label}</span>
                  <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">{dealsByStage[stage.id]?.length || 0}</span>
                </div>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {dealsByStage[stage.id]?.map((deal) => (
                    <div key={deal.id} className="bg-gray-800 rounded-lg p-2.5 border border-gray-700/50">
                      <p className="text-xs font-medium text-gray-200 truncate">{deal.title}</p>
                      <p className="text-xs text-gray-500 mt-1">${deal.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-300">Recent Leads</h3>
          </CardHeader>
          <CardContent className="p-0">
            {leads.length > 0 ? (
              <div className="divide-y divide-gray-700/50">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm text-gray-200">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={lead.status === 'converted' ? 'success' : lead.status === 'lost' ? 'danger' : 'info'}>{lead.status}</Badge>
                      <span className="text-xs text-gray-600">{lead.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-gray-600">No leads yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-300">Activity Timeline</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                    {i < 4 && <div className="w-0.5 flex-1 bg-gray-700 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-gray-300">Deal stage updated</p>
                    <p className="text-xs text-gray-600">{i}h ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
