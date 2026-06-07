'use client';

import { useState } from 'react';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  Mail,
  ChevronDown,
  Activity,
  Server,
  Bot,
  Workflow,
  Users,
  Database,
  FolderOpen,
  Lock,
  Globe,
  ArrowUp,
  Bell,
} from 'lucide-react';

type ServiceStatus = 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage';

interface Service {
  id: string;
  name: string;
  icon: typeof Shield;
  status: ServiceStatus;
  uptime: string;
  responseTime: string;
  description: string;
}

interface Incident {
  date: string;
  title: string;
  status: 'resolved' | 'monitoring' | 'identified' | 'investigating';
  duration: string;
  description: string;
}

const statusConfig: Record<ServiceStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  operational: { label: 'Operational', color: 'bg-memory-500', icon: CheckCircle2 },
  degraded_performance: { label: 'Degraded Performance', color: 'bg-warning-500', icon: AlertTriangle },
  partial_outage: { label: 'Partial Outage', color: 'bg-danger-500', icon: AlertTriangle },
  major_outage: { label: 'Major Outage', color: 'bg-brand-500', icon: XCircle },
};

const services: Service[] = [
  { id: 'api-gateway', name: 'API Gateway', icon: Server, status: 'operational', uptime: '99.99%', responseTime: '45ms', description: 'Handles all API requests and routing' },
  { id: 'ai-agents', name: 'AI Agents', icon: Bot, status: 'operational', uptime: '99.95%', responseTime: '120ms', description: 'AI agent execution and inference' },
  { id: 'workflow-engine', name: 'Workflow Engine', icon: Workflow, status: 'operational', uptime: '99.97%', responseTime: '85ms', description: 'Automation and workflow execution' },
  { id: 'crm-service', name: 'CRM Service', icon: Users, status: 'operational', uptime: '99.93%', responseTime: '60ms', description: 'Contact and deal management' },
  { id: 'realtime-collab', name: 'Real-time Collaboration', icon: Activity, status: 'operational', uptime: '99.99%', responseTime: '30ms', description: 'Live sync and collaborative editing' },
  { id: 'file-storage', name: 'File Storage', icon: Database, status: 'operational', uptime: '99.98%', responseTime: '110ms', description: 'File upload, storage, and delivery' },
  { id: 'authentication', name: 'Authentication', icon: Lock, status: 'operational', uptime: '99.99%', responseTime: '25ms', description: 'Auth, SSO, and session management' },
  { id: 'web-app', name: 'Web App', icon: Globe, status: 'operational', uptime: '99.96%', responseTime: '55ms', description: 'Frontend application delivery' },
];

const incidents: Incident[] = [
  { date: 'May 20, 2026', title: 'Database latency issue', status: 'resolved', duration: '23min', description: 'Increased query latency on primary database cluster due to an unoptimized indexing migration. Performance returned to baseline after rolling back the migration.' },
  { date: 'May 15, 2026', title: 'Scheduled maintenance', status: 'resolved', duration: '2h', description: 'Planned maintenance to upgrade our database infrastructure. No downtime expected during the maintenance window.' },
  { date: 'May 8, 2026', title: 'Agent streaming timeout', status: 'resolved', duration: '45min', description: 'AI agent responses were timing out due to increased inference load. Added additional GPU nodes to handle demand.' },
  { date: 'Apr 28, 2026', title: 'CMS API degradation', status: 'resolved', duration: '1h 12min', description: 'CMS API endpoints returned elevated error rates due to a misconfigured load balancer. Configuration was rolled back.' },
  { date: 'Apr 10, 2026', title: 'Workflow execution backlog', status: 'resolved', duration: '3h', description: 'Workflow execution queue backed up after a downstream webhook provider outage. Queue was drained after provider recovery.' },
];

const incidentBadge: Record<Incident['status'], { label: string; classes: string }> = {
  resolved: { label: 'Resolved', classes: 'bg-memory-500/15 text-memory-500 border-memory-500/25' },
  monitoring: { label: 'Monitoring', classes: 'bg-execution-500/15 text-execution-500 border-execution-500/25' },
  identified: { label: 'Identified', classes: 'bg-warning-500/15 text-warning-500 border-warning-500/25' },
  investigating: { label: 'Investigating', classes: 'bg-brand-500/15 text-brand-500 border-brand-500/25' },
};

export default function StatusPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [expandedIncident, setExpandedIncident] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <div className="absolute inset-0 bg-gradient-to-b from-memory-50/60 to-white dark:from-memory-950/10 dark:to-[#0a0a0f] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-memory-500/10 to-execution-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative">
        <section className="pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-memory-50 dark:bg-memory-500/10 border border-memory-200/50 dark:border-memory-500/20 text-sm font-medium text-memory-600 dark:text-memory-400 mb-6">
                <Activity className="w-4 h-4" />
                System Status
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-surface-900 dark:text-white">System Status</span>
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-memory-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-memory-500" />
                </span>
                <span className="text-lg font-semibold text-memory-600 dark:text-memory-400">
                  All Systems Operational
                </span>
              </div>
              <p className="text-surface-500 dark:text-surface-400">
                Current status of all Momentum AI services
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
              {[
                { label: 'Uptime', value: '99.9%', icon: ArrowUp },
                { label: 'Incidents Today', value: '0', icon: CheckCircle2 },
                { label: 'Last Incident', value: '12 days ago', icon: Clock },
              ].map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-4 text-center">
                    <StatIcon className="w-5 h-5 text-surface-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-surface-900 dark:text-white mb-0.5">{stat.value}</div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {services.map((service) => {
                const cfg = statusConfig[service.status];
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-5 transition-all hover:shadow-lg hover:shadow-memory-500/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-surface-100 dark:bg-white/[0.06]">
                          <Icon className="w-5 h-5 text-surface-500 dark:text-surface-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-surface-900 dark:text-white">{service.name}</h3>
                          <p className="text-xs text-surface-500 dark:text-surface-400">{service.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2 h-2 rounded-full', cfg.color)} />
                        <span className="text-xs font-medium text-surface-600 dark:text-surface-400">{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-surface-400">
                        <span>{service.uptime}</span>
                        <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
                        <span>{service.responseTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">Incident History</h2>
              <div className="space-y-3">
                {incidents.map((incident, i) => {
                  const badge = incidentBadge[incident.status];
                  const isOpen = expandedIncident === i;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedIncident(isOpen ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <div className="text-sm font-semibold text-surface-900 dark:text-white mb-0.5">{incident.title}</div>
                            <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                              <span>{incident.date}</span>
                              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
                              <span>{incident.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn('px-2.5 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider', badge.classes)}>
                            {badge.label}
                          </span>
                          <ChevronDown className={cn('w-4 h-4 text-surface-400 transition-transform duration-300', isOpen && 'rotate-180')} />
                        </div>
                      </button>
                      <div className={cn('overflow-hidden transition-all duration-300', isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{incident.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="max-w-md mx-auto mb-12">
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6 text-center">
                <Bell className="w-8 h-8 text-brand-500 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Subscribe to Updates</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Get notified when there&apos;s an incident</p>
                {subscribed ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-memory-500">
                    <CheckCircle2 className="w-4 h-4" />
                    Subscribed successfully
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.04] text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                    <button
                      onClick={() => { setSubscribed(true); }}
                      disabled={!email}
                      className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Subscribe
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-surface-400">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Last checked: just now</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
              <span>Auto-refreshes every 60s</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
