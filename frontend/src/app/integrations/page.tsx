'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  Puzzle, Slack, Github, Chrome as ChromeIcon, CreditCard, Users,
  MessageSquare, Music, Video, Cloud, Database, Globe,
  CheckCircle2, XCircle, Link2, Link2Off,
} from 'lucide-react';
import type { Integration } from '@/lib/types';
import toast from 'react-hot-toast';

const fallbackIcons: Record<string, typeof Puzzle> = {
  slack: Slack,
  discord: MessageSquare,
  github: Github,
  google: ChromeIcon,
  stripe: CreditCard,
  hubspot: Users,
  spotify: Music,
  youtube: Video,
  aws: Cloud,
  notion: Database,
  shopify: Globe,
};

const integrationMeta: Record<string, { name: string; description: string }> = {
  slack: { name: 'Slack', description: 'Send notifications and messages to Slack channels' },
  discord: { name: 'Discord', description: 'Post updates and alerts to Discord servers' },
  github: { name: 'GitHub', description: 'Sync issues, PRs, and commits with projects' },
  google: { name: 'Google', description: 'Connect Google Calendar, Drive, and more' },
  stripe: { name: 'Stripe', description: 'Track payments, subscriptions, and invoices' },
  hubspot: { name: 'HubSpot', description: 'Sync contacts, deals, and CRM data' },
  spotify: { name: 'Spotify', description: 'Manage playlists and music recommendations' },
  youtube: { name: 'YouTube', description: 'Track video analytics and comments' },
  aws: { name: 'AWS', description: 'Monitor cloud infrastructure and deployments' },
  notion: { name: 'Notion', description: 'Sync pages, databases, and documentation' },
  shopify: { name: 'Shopify', description: 'Manage products, orders, and customers' },
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    api.getIntegrations()
      .then(setIntegrations)
      .catch(() => setError('Failed to load integrations'))
      .finally(() => setLoading(false));
  }, []);

  async function handleConnect(id: string) {
    setConnecting(id);
    try {
      const updated = await api.connectIntegration(id);
      setIntegrations((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success('Integration connected');
    } catch {
      toast.error('Failed to connect integration');
    } finally {
      setConnecting(null);
    }
  }

  async function handleDisconnect(id: string) {
    if (!confirm('Disconnect this integration?')) return;
    try {
      await api.disconnectIntegration(id);
      setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: false, connectedAt: undefined } : i)));
      toast.success('Integration disconnected');
    } catch {
      toast.error('Failed to disconnect integration');
    }
  }

  const displayIntegrations = integrations.length > 0
    ? integrations
    : Object.entries(integrationMeta).map(([id, meta], index) => ({
        id,
        name: meta.name,
        description: meta.description,
        icon: id,
        category: 'default',
        connected: false,
      } as Integration));

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Puzzle className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-indigo-400 hover:text-indigo-300 text-sm">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Integrations</h1>
        <p className="text-sm text-gray-500 mt-1">Connect your favorite tools and services</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-36 bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayIntegrations.map((integration) => {
            const Icon = fallbackIcons[integration.icon] || Puzzle;
            const meta = integrationMeta[integration.id] || { name: integration.name, description: integration.description };

            return (
              <Card key={integration.id} className="hover:border-indigo-500/30 transition-colors">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'p-2.5 rounded-lg',
                      integration.connected ? 'bg-green-500/10' : 'bg-gray-700/50'
                    )}>
                      <Icon className={cn('h-6 w-6', integration.connected ? 'text-green-400' : 'text-gray-500')} />
                    </div>
                    <div className="flex items-center gap-1">
                      {integration.connected ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-200 mb-1">{meta.name}</h3>
                  <p className="text-sm text-gray-500 flex-1">{meta.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
                    {integration.connected ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Connected</Badge>
                        {integration.connectedAt && (
                          <span className="text-xs text-gray-600">{new Date(integration.connectedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    ) : (
                      <Badge variant="default">Not Connected</Badge>
                    )}
                    <Button
                      size="sm"
                      variant={integration.connected ? 'danger' : 'primary'}
                      isLoading={connecting === integration.id}
                      onClick={() => integration.connected ? handleDisconnect(integration.id) : handleConnect(integration.id)}
                    >
                      {integration.connected ? (
                        <><Link2Off className="h-3.5 w-3.5" />Disconnect</>
                      ) : (
                        <><Link2 className="h-3.5 w-3.5" />Connect</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
