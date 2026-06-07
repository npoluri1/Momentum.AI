'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  Search, Sparkles, ArrowRight, CheckCircle, ChevronDown, Menu, X,
  Moon, Sun, Zap, Bot, Workflow, Globe, Database, MessageSquare,
  Mail, Github, Chrome, CreditCard, Users, Cloud, Slack, Link2,
  FileText, Calendar, Shield, Smartphone, Layers, ExternalLink,
  Puzzle, Code, BookOpen, HelpCircle, PieChart, BarChart3,
  Box, Activity, Terminal, Download, Clock, Star,
} from 'lucide-react';

const categories = [
  {
    id: 'ai-agents',
    name: 'AI Agents',
    icon: Bot,
    count: 8,
    gradient: 'from-intelligence-500 to-intelligence-600',
    description: 'Deploy AI agents that search the web, scrape pages, transcribe videos, and collaborate as multi-agent teams.',
    apps: ['Ask Agent Team', 'Ask Agent with Structured Output', 'Add Knowledge to Agent', 'Search Web Action', 'YouTube Transcriber', 'Website Scraper', 'Multi-Agent Workflow', 'Agent Memory Tool'],
  },
  {
    id: 'connectors',
    name: 'Connectors',
    icon: Link2,
    count: 37,
    gradient: 'from-brand-500 to-brand-600',
    description: 'Connect Slack, GitHub, Stripe, Shopify, HubSpot, Gmail, and 30+ apps with triggers and actions.',
    apps: ['Slack', 'Discord', 'Microsoft Teams', 'WhatsApp Business', 'Gmail', 'Google Drive', 'GitHub', 'GitLab', 'Stripe', 'Shopify', 'HubSpot', 'Salesforce', 'Pipedrive', 'Notion', 'Linear', 'Jira', 'Google Calendar', 'Outlook', 'Apple Calendar', 'Calendly', 'Mailchimp', 'Twitter/X', 'LinkedIn', 'Dropbox', 'OneDrive', 'Box', 'Figma', 'Asana', 'Trello', 'Monday.com', 'Zoom', 'Loom', 'Typeform', 'Airtable', 'Intercom', 'Zendesk', 'Freshdesk'],
  },
  {
    id: 'automations',
    name: 'Automations',
    icon: Workflow,
    count: 34,
    gradient: 'from-execution-500 to-execution-600',
    description: 'Build workflow automations with triggers, branching, looping, and scheduling. Enterprise-grade durable execution.',
    apps: ['AI Forms', 'Task Added', 'Webhooks', 'Schedule', 'Conditional Logic', 'Branching', 'Looping', 'Parallel Steps', 'HTTP Request', 'Filter', 'Transform Data', 'Delay', 'Retry Logic', 'Error Handling', 'Email Action', 'SMS Action', 'Slack Action', 'Database Query', 'API Call', 'File Operation', 'Agent Trigger', 'CRM Sync', 'Lead Scoring', 'Report Generation', 'Data Export', 'Approval Step', 'Notification', 'Status Change', 'Tag Added', 'Comment Created', 'Due Date Approaching', 'Milestone Reached', 'Webhook Response', 'Custom Action'],
  },
  {
    id: 'knowledge',
    name: 'Knowledge',
    icon: Database,
    count: 8,
    gradient: 'from-memory-500 to-memory-600',
    description: 'Upload PDFs, CSVs, documents, and more to give AI agents deep context. Build knowledge bases and FAQ bots.',
    apps: ['PDF Documents', 'DOCX Documents', 'Spreadsheets (XLSX)', 'Spreadsheets (CSV)', 'Plain Text Files', 'Markdown Files', 'Image Analysis', 'Video Transcripts'],
  },
  {
    id: 'migrate',
    name: 'Migrate',
    icon: Download,
    count: 36,
    gradient: 'from-warning-400 to-warning-500',
    description: 'Import from Notion, Asana, ClickUp, Trello, Monday, and 25+ tools. Zero-friction onboarding.',
    apps: ['Zapier', 'Activepieces', 'Make', 'Pabbly', 'Notion Import', 'Asana Import', 'ClickUp Import', 'Trello Import', 'Monday.com Import', 'Linear Import', 'Jira Import', 'Confluence Import', 'Google Workspace', 'Microsoft 365', 'Evernote', 'Dropbox Paper', 'Coda', 'Basecamp', 'Wrike', 'Smartsheet', 'Podio', 'Teamwork', 'Todoist', 'TickTick', 'Things 3', 'OmniFocus', 'GQueues', 'Remember The Milk', 'Nozbe', 'ProofHub', 'Quire', 'Redmine', 'Taiga', 'YouTrack', 'OpenProject', 'Plane'],
  },
  {
    id: 'extend',
    name: 'Extend',
    icon: Puzzle,
    count: 15,
    gradient: 'from-brand-500 to-intelligence-500',
    description: 'Browser extensions, desktop apps, embeds, Developer API, and MCP integration for every tool your team uses.',
    apps: ['Chrome Extension', 'Firefox Extension', 'Edge Extension', 'Brave Extension', 'Desktop App (Mac)', 'Desktop App (Windows)', 'Desktop App (Linux)', 'Mobile App (iOS)', 'Mobile App (Android)', 'Developer API (REST)', 'Developer API (GraphQL)', 'MCP Server', 'MCP Client', 'Embed Widget', 'Webhooks'],
  },
];

const recentlyAdded = [
  { name: 'Stripe Checkout Sessions', type: 'New Action', description: 'Generate Stripe checkout URLs from automations for payments with no server code.', gradient: 'from-brand-500 to-brand-600' },
  { name: 'GitHub Export to Repo', type: 'Two-way', description: 'Push Genesis apps into existing repos. Pick a branch, open a PR.', gradient: 'from-intelligence-500 to-intelligence-600' },
  { name: 'Google Calendar: Events & Free/Busy', type: 'New Actions', description: 'List upcoming events and fetch free/busy windows for scheduling apps.', gradient: 'from-execution-500 to-execution-600' },
  { name: 'Salesforce Automation Pieces', type: 'Expanded', description: 'Create/update records, query objects, chain Salesforce steps into AI automations.', gradient: 'from-memory-500 to-memory-600' },
  { name: 'Notion Automation Pieces', type: 'Expanded', description: 'Write to Notion databases, create pages, pull filtered queries into projects.', gradient: 'from-warning-400 to-warning-500' },
  { name: 'Momentum AI MCP — Both Directions', type: 'MCP', description: 'Server lets Claude Desktop, Cursor, VS Code read workspace. Client lets agents call external MCP.', gradient: 'from-brand-500 to-intelligence-500' },
];

const faqs = [
  {
    q: 'How many integrations does Momentum AI support?',
    a: 'Momentum AI connects to 138+ bidirectional apps and services across every category. Triggers pull events in, actions push data out: Communication — Slack, Discord, Microsoft Teams, Email. Productivity — Google Workspace, Microsoft 365, Notion. CRM & Sales — Salesforce, HubSpot, Pipedrive. Payments & E-Commerce — Stripe (including Checkout Sessions), Shopify. Development — GitHub (two-way push to existing repos), GitLab, Jira, Linear. Calendar & Scheduling — Google Calendar (events, free/busy), Outlook, Apple Calendar, Calendly. Marketing — Mailchimp, Twitter/X, LinkedIn, Facebook. Storage — Google Drive, Dropbox, OneDrive, Box. AI Interop — Model Context Protocol (MCP) server and client.',
  },
  {
    q: 'How do Momentum AI integrations work?',
    a: 'Integrations operate through the Automations system — the Execution layer of Workspace DNA. You define triggers (events that start a workflow: new email, Slack message, GitHub issue, calendar event) and actions (operations performed in response: create project, send notification, update CRM, trigger AI agent). Workflows can chain multiple actions across any connected service.',
  },
  {
    q: 'Can AI agents use integrations?',
    a: 'Yes. AI agents can both trigger and respond to integration events. Agents can read data from connected apps, analyze information and make decisions, take actions across integrations based on context, and learn from interaction patterns. Example: Customer emails support → agent reads email, checks CRM history → agent drafts response → agent sends reply and logs activity.',
  },
  {
    q: 'Can I connect custom APIs?',
    a: 'Yes. Momentum AI supports webhooks and HTTP request actions for connecting any service with an API. Webhooks: Set up a webhook URL, configure external service to POST data, trigger automations. HTTP Requests: Make GET, POST, PUT, DELETE requests with custom headers and authentication.',
  },
  {
    q: 'How is this different from Zapier or Make?',
    a: 'Zapier and Make connect apps through predefined triggers and actions. Momentum AI adds AI intelligence to the equation. Key differences: Zapier/Make use rule-based static workflows, while Momentum AI uses AI-powered adaptive workflows that are workspace-aware. Zapier moves data between apps; Momentum AI analyzes data, makes decisions, drafts responses, and adapts over time.',
  },
  {
    q: 'What is the MCP integration?',
    a: 'Momentum AI supports the Model Context Protocol (MCP) in both directions. As an MCP Server — external AI tools like Claude Desktop, Cursor, and VS Code can read and write your workspace. As an MCP Client — your AI agents can call external MCP servers connected to Notion, Linear, and other services.',
  },
  {
    q: 'Does Momentum AI integrate with Shopify and Stripe?',
    a: 'Yes. Native Shopify (26 actions, 7 triggers) and Stripe (16 actions, 5 triggers) integrations. Shopify: Automate order management, product catalog, customer records, inventory. Stripe: Automate payments, subscriptions, invoices, refunds. The Stripe Checkout Session action generates payment URLs from automations with no server code.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most integrations connect in under 2 minutes: Select integration → Authenticate via OAuth → Configure trigger → Add actions → Activate. Pre-built templates speed this up further.',
  },
];

const useCases = [
  {
    icon: BarChart3,
    title: 'AI-Powered Dashboards',
    description: 'Connect data sources via connectors, let AI agents analyze trends, and display live metrics in a Genesis app.',
    gradient: 'from-brand-500 to-brand-600',
  },
  {
    icon: Users,
    title: 'Automated CRM Pipelines',
    description: 'Sync HubSpot, Stripe, and Gmail via connectors. Automate lead scoring with AI agents and trigger follow-ups.',
    gradient: 'from-intelligence-500 to-intelligence-600',
  },
  {
    icon: FileText,
    title: 'Content Generation Engine',
    description: 'Upload knowledge base files, deploy AI agents that research and draft, then automate publishing workflows.',
    gradient: 'from-memory-500 to-memory-600',
  },
];

export default function IntegrationsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('connectors');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeCat = categories.find(c => c.id === activeCategory) || categories[0];
  const filteredApps = activeCat.apps.filter(a =>
    a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />

      <main className="pt-14">
        {/* Hero */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-intelligence-500/10 to-execution-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Puzzle className="w-4 h-4" />
                138+ Bidirectional Connectors
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Momentum AI</span>
                <br />
                <span className="momentum-text">Integrations</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                138+ bidirectional connectors. Triggers pull events in from Slack, Gmail, Stripe, GitHub, and more.
                Actions push data out to the same tools. AI agents decide what happens in between.
              </p>

              {/* Category stats */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                        activeCategory === cat.id
                          ? 'border-brand-500 bg-brand-500/10 text-brand-500 shadow-sm'
                          : 'border-surface-200 dark:border-white/[0.06] text-surface-500 dark:text-surface-400 hover:border-surface-300 dark:hover:border-white/[0.12] hover:text-surface-700 dark:hover:text-surface-300'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-100 dark:bg-white/[0.06]">{cat.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Category Detail */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Category Sidebar */}
              <div className="space-y-4">
                <div className={cn('p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40')}>
                  <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br mb-4 flex items-center justify-center', activeCat.gradient)}>
                    {React.createElement(activeCat.icon, { className: 'w-6 h-6 text-white' })}
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">{activeCat.name}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{activeCat.description}</p>
                  <div className="flex items-center gap-2 text-sm text-surface-500">
                    <Box className="w-4 h-4" />
                    <span>{activeCat.count} apps</span>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search integrations..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Apps Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredApps.map((app, i) => (
                    <div
                      key={i}
                      className="group p-4 rounded-xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', activeCat.gradient)}>
                          {React.createElement(activeCat.icon, { className: 'w-4 h-4 text-white' })}
                        </div>
                        <span className="text-sm font-medium text-surface-900 dark:text-white group-hover:text-brand-500 transition-colors">{app}</span>
                      </div>
                    </div>
                  ))}
                  {filteredApps.length === 0 && (
                    <div className="col-span-full text-center py-12 text-surface-500">No integrations match your search</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recently Added */}
        <section className="py-12 md:py-16 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">Recently Added</h2>
              <p className="text-surface-500 dark:text-surface-400">Latest connector actions and triggers shipped in the last release train.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyAdded.map((item, i) => (
                <div
                  key={i}
                  className="group p-5 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider', item.gradient.includes('brand') ? 'text-brand-500 bg-brand-500/10 border-brand-500/25' : 'text-intelligence-500 bg-intelligence-500/10 border-intelligence-500/25')}>
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">{item.name}</h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/changelog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
                See full release changelog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Powered by Integrations */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">Powered by Integrations</h2>
              <p className="text-surface-500 dark:text-surface-400">Build Genesis Apps with Integrations — combine AI agents, connectors, and automations.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {useCases.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <div
                    key={useCase.title}
                    className="group p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all"
                  >
                    <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform', useCase.gradient)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{useCase.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{useCase.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25 transition-all inline-flex items-center gap-2">
                Build a Genesis App <Zap className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* MCP Section */}
        <section className="py-12 md:py-16 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto p-8 md:p-10 rounded-3xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-500 mb-4">
                    <Terminal className="w-3.5 h-3.5" />
                    MCP — Both Directions
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-3">Model Context Protocol</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-4">
                    As an MCP Server, external AI tools like Claude Desktop, Cursor, and VS Code read and write your workspace.
                    As an MCP Client, your AI agents call external MCP servers connected to Notion, Linear, and more.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                      <CheckCircle className="w-4 h-4 text-memory-500" /> OAuth 2.0 with PKCE
                    </div>
                    <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                      <CheckCircle className="w-4 h-4 text-memory-500" /> 33 built-in tools
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-500/10 via-intelligence-500/5 to-execution-500/10 border border-surface-200/50 dark:border-white/[0.06] text-center">
                    <Terminal className="w-10 h-10 text-brand-500 mx-auto mb-3" />
                    <p className="text-lg font-bold momentum-text">MCP</p>
                    <p className="text-xs text-surface-500 mt-1">Server + Client</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">Integrations FAQ</h2>
              <p className="text-surface-500 dark:text-surface-400">Connect your tools and automate everything</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">{faq.q}</span>
                    <ChevronDown className={cn('w-4 h-4 text-surface-400 shrink-0 transition-transform duration-300', openFaq === i && 'rotate-180')} />
                  </button>
                  <div className={cn('overflow-hidden transition-all duration-300', openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="px-5 pb-5">
                      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect your stack. Let agents run it.</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  138+ integrations. AI-powered automation. One living workspace.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/auth/register" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Start Building Free <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Browse Integrations <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
