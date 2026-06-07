'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Zap, Sparkles, Bot, Workflow, LayoutDashboard, Globe,
  BarChart3, Users, MessageSquare, Plus, ArrowRight,
  ChevronRight, Star, Play, FileText, ShoppingCart,
  GraduationCap, Home, Briefcase, ChevronDown, Download,
  Copy, Eye, Code, Palette, BookOpen, Phone, FolderOpen,
  Check, X, Clock, RefreshCw, Maximize2, Minimize2,
  ExternalLink,
} from 'lucide-react';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';

const appTypes = [
  { icon: LayoutDashboard, name: 'Dashboard', desc: 'Analytics, KPIs, and reporting', color: 'from-violet-500 to-purple-600' },
  { icon: Globe, name: 'Website', desc: 'Portals, landing pages, docs', color: 'from-blue-500 to-cyan-600' },
  { icon: Bot, name: 'AI Agent', desc: 'Intelligent assistants and bots', color: 'from-emerald-500 to-teal-600' },
  { icon: Workflow, name: 'Workflow', desc: 'Automations and processes', color: 'from-amber-500 to-orange-600' },
  { icon: Users, name: 'CRM', desc: 'Customer relationships and deals', color: 'from-rose-500 to-pink-600' },
  { icon: BarChart3, name: 'Tracker', desc: 'Goals, metrics, and progress', color: 'from-indigo-500 to-violet-600' },
  { icon: FileText, name: 'Form', desc: 'Surveys and data collection', color: 'from-sky-500 to-blue-600' },
  { icon: ShoppingCart, name: 'Store', desc: 'E-commerce and inventory', color: 'from-green-500 to-emerald-600' },
];

const industries = [
  { value: '', label: 'All Industries' },
  { value: 'tech', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'media', label: 'Media & Entertainment' },
];

const categories = [
  { value: '', label: 'All', icon: '🏗️' },
  { value: 'dashboard', label: 'Dashboard', icon: '📊' },
  { value: 'agent', label: 'AI Agent', icon: '🤖' },
  { value: 'workflow', label: 'Workflow', icon: '⚡' },
  { value: 'crm', label: 'CRM', icon: '👥' },
  { value: 'website', label: 'Website', icon: '🌐' },
  { value: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
  { value: 'mobile', label: 'Mobile App', icon: '📱' },
  { value: 'api', label: 'API Service', icon: '🔌' },
];

const modelTiers = [
  { value: 'auto', label: 'Auto-detect by AI 🎯' },
  { value: 'economy', label: 'Economy - Fast & Cheap' },
  { value: 'standard', label: 'Standard - Balanced' },
  { value: 'premium', label: 'Premium - Best Quality' },
];

const techStacks = [
  { value: 'auto', label: 'Auto-detect by AI' },
  { value: 'nextjs', label: 'Next.js + TypeScript + PostgreSQL' },
  { value: 'react', label: 'React + Node.js + MongoDB' },
  { value: 'python', label: 'Python FastAPI + PostgreSQL' },
  { value: 'flutter', label: 'Flutter + Firebase' },
  { value: 'reactnative', label: 'React Native + Supabase' },
  { value: 'rails', label: 'Ruby on Rails + PostgreSQL' },
];

const examplePrompts = [
  'E-Commerce Analytics Dashboard via fallback',
  'A React e-commerce dashboard with real-time sales data, inventory tracking, and AI-powered sales forecasting.',
  'A Flutter cross-platform social media app with AI feed personalization',
  'A LangChain multi-agent customer support system with RAG',
  'A Next.js SaaS analytics platform with real-time dashboards',
  'A Python FastAPI microservice gateway with rate limiting',
  'A React Native health tracker with wearable device integration',
];

const generatedFiles = [
  {
    name: 'package.json', language: 'json',
    content: JSON.stringify({
      name: 'e-commerce-analytics-dashboard', version: '1.0.0',
      scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
      dependencies: { next: '^14.2.0', react: '^18.3.0', recharts: '^2.12.0', prisma: '^5.14.0' },
    }, null, 2),
  },
  {
    name: 'tsconfig.json', language: 'json',
    content: JSON.stringify({
      compilerOptions: {
        target: 'es5', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true,
        strict: true, noEmit: true, esModuleInterop: true, module: 'esnext',
        moduleResolution: 'bundler', jsx: 'preserve', incremental: true,
        paths: { '@/*': ['./src/*'] },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
    }, null, 2),
  },
  {
    name: 'next.config.js', language: 'javascript',
    content: [
      '/** @type {import("next").NextConfig} */',
      'const nextConfig = {',
      '  images: { domains: ["localhost"] },',
      '};',
      '',
      'module.exports = nextConfig;',
    ].join('\n'),
  },
  {
    name: 'postcss.config.js', language: 'javascript',
    content: 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };',
  },
  {
    name: 'tailwind.config.ts', language: 'typescript',
    content: [
      'import type { Config } from "tailwindcss";',
      '',
      'const config: Config = {',
      '  content: ["./src/**/*.{ts,tsx}"],',
      '  theme: {',
      '    extend: {',
      '      colors: { brand: { 500: "#ff2d60" }, surface: { 900: "#0f172a" } },',
      '    },',
      '  },',
      '  plugins: [],',
      '};',
      '',
      'export default config;',
    ].join('\n'),
  },
  {
    name: 'layout.tsx', language: 'typescript',
    content: [
      'import type { Metadata } from "next";',
      'import "./globals.css";',
      '',
      'export const metadata: Metadata = {',
      '  title: "E-Commerce Analytics",',
      '  description: "Real-time sales dashboard",',
      '};',
      '',
      'export default function RootLayout({ children }: { children: React.ReactNode }) {',
      '  return (',
      '    <html lang="en">',
      '      <body className="min-h-screen bg-surface-50">{children}</body>',
      '    </html>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    name: 'page.tsx', language: 'typescript',
    content: [
      '"use client";',
      '',
      'import { useState, useEffect } from "react";',
      'import { Header } from "@/components/Header";',
      'import { Sidebar } from "@/components/Sidebar";',
      'import { Chart } from "@/components/Chart";',
      'import { mockData } from "./mockData";',
      '',
      'export default function DashboardPage() {',
      '  const [data] = useState(mockData);',
      '',
      '  return (',
      '    <div className="flex h-screen">',
      '      <Sidebar />',
      '      <div className="flex-1">',
      '        <Header title="Dashboard" />',
      '        <main className="p-6 space-y-6">',
      '          <div className="grid grid-cols-4 gap-4">',
      '            <StatCard label="Total Revenue" value={"$" + data.revenue.toLocaleString()} />',
      '            <StatCard label="Orders" value={data.orders.toString()} />',
      '            <StatCard label="Customers" value={data.customers.toString()} />',
      '            <StatCard label="Growth" value={data.growth + "%"} />',
      '          </div>',
      '          <Chart data={data.salesHistory} />',
      '        </main>',
      '      </div>',
      '    </div>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    name: 'route.ts', language: 'typescript',
    content: [
      'import { NextResponse } from "next/server";',
      '',
      'export async function GET() {',
      '  return NextResponse.json({',
      '    revenue: 284500, orders: 1234, customers: 892, growth: 12.5,',
      '    salesHistory: [',
      '      { month: "Jan", sales: 4000 },',
      '      { month: "Feb", sales: 3000 },',
      '      { month: "Mar", sales: 5000 },',
      '      { month: "Apr", sales: 4500 },',
      '      { month: "May", sales: 6000 },',
      '      { month: "Jun", sales: 5500 },',
      '    ],',
      '  });',
      '}',
    ].join('\n'),
  },
  {
    name: 'globals.css', language: 'css',
    content: '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root { --brand: 346 100% 63%; }\nbody { font-family: "Inter", sans-serif; }',
  },
  {
    name: 'mockData.ts', language: 'typescript',
    content: [
      'export const mockData = {',
      '  revenue: 284500, orders: 1234, customers: 892, growth: 12.5,',
      '  salesHistory: [',
      '    { month: "Jan", sales: 4000 },',
      '    { month: "Feb", sales: 3000 },',
      '    { month: "Mar", sales: 5000 },',
      '    { month: "Apr", sales: 4500 },',
      '    { month: "May", sales: 6000 },',
      '    { month: "Jun", sales: 5500 },',
      '  ],',
      '  topProducts: [',
      '    { name: "Widget Pro", sales: 432 },',
      '    { name: "Gadget X", sales: 321 },',
      '    { name: "Tool Kit", sales: 289 },',
      '  ],',
      '};',
    ].join('\n'),
  },
  {
    name: 'Header.tsx', language: 'typescript',
    content: [
      '"use client";',
      '',
      'export function Header({ title }: { title: string }) {',
      '  return (',
      '    <header className="h-16 border-b flex items-center px-6 bg-white">',
      '      <h1 className="text-xl font-semibold">{title}</h1>',
      '      <div className="ml-auto flex items-center gap-4">',
      '        <input placeholder="Search..." className="px-3 py-1.5 rounded-lg border text-sm" />',
      '        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium">JD</div>',
      '      </div>',
      '    </header>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    name: 'Sidebar.tsx', language: 'typescript',
    content: [
      '"use client";',
      'import { LayoutDashboard, ShoppingCart, Users, BarChart3, Settings } from "lucide-react";',
      '',
      'const items = [',
      '  { icon: LayoutDashboard, label: "Dashboard" },',
      '  { icon: ShoppingCart, label: "Orders" },',
      '  { icon: Users, label: "Customers" },',
      '  { icon: BarChart3, label: "Analytics" },',
      '  { icon: Settings, label: "Settings" },',
      '];',
      '',
      'export function Sidebar() {',
      '  return (',
      '    <aside className="w-56 border-r bg-white p-4">',
      '      <div className="text-lg font-bold mb-8">Analytics</div>',
      '      <nav className="space-y-1">',
      '        {items.map((item) => (',
      '          <button key={item.label} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-surface-600 hover:bg-surface-100 transition-colors">',
      '            <item.icon className="w-4 h-4" /> {item.label}',
      '          </button>',
      '        ))}',
      '      </nav>',
      '    </aside>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    name: 'Chart.tsx', language: 'typescript',
    content: [
      '"use client";',
      'import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";',
      '',
      'export function Chart({ data }: { data: { month: string; sales: number }[] }) {',
      '  return (',
      '    <div className="bg-white rounded-xl border p-6">',
      '      <h3 className="font-semibold mb-4">Sales Overview</h3>',
      '      <ResponsiveContainer width="100%" height={300}>',
      '        <BarChart data={data}>',
      '          <CartesianGrid strokeDasharray="3 3" />',
      '          <XAxis dataKey="month" /> <YAxis />',
      '          <Tooltip />',
      '          <Bar dataKey="sales" fill="#ff2d60" radius={[4, 4, 0, 0]} />',
      '        </BarChart>',
      '      </ResponsiveContainer>',
      '    </div>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    name: 'schema.prisma', language: 'prisma',
    content: [
      'generator client { provider = "prisma-client-js" }',
      'datasource db { provider = "postgresql" url = env("DATABASE_URL") }',
      '',
      'model Product {',
      '  id String @id @default(cuid())',
      '  name String',
      '  price Float',
      '  stock Int',
      '  category String',
      '  createdAt DateTime @default(now())',
      '  orders Order[]',
      '}',
      '',
      'model Order {',
      '  id String @id @default(cuid())',
      '  productId String',
      '  product Product @relation(fields: [productId], references: [id])',
      '  quantity Int',
      '  total Float',
      '  status String @default("pending")',
      '  createdAt DateTime @default(now())',
      '}',
    ].join('\n'),
  },
  {
    name: '.env.example', language: 'text',
    content: 'DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"\nNEXT_PUBLIC_API_URL="http://localhost:3000/api"',
  },
  {
    name: 'Dockerfile', language: 'dockerfile',
    content: 'FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nEXPOSE 3000\nCMD ["npm", "start"]',
  },
  {
    name: 'docker-compose.yml', language: 'yaml',
    content: 'version: "3.8"\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - DATABASE_URL=postgresql://user:password@db:5432/ecommerce\n    depends_on:\n      - db\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: password\n      POSTGRES_DB: ecommerce\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:',
  },
  {
    name: 'README.md', language: 'markdown',
    content: [
      '# E-Commerce Analytics Dashboard',
      '',
      'A real-time e-commerce analytics dashboard built with Next.js 14.',
      '',
      '## Features',
      '- Real-time sales tracking',
      '- Inventory management',
      '- AI-powered forecasting',
      '',
      '## Tech Stack',
      '- Next.js 14, TypeScript, Tailwind CSS',
      '- Prisma + PostgreSQL',
      '- Recharts',
    ].join('\n'),
  },
];

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string; icon?: string }[];
  onChange: (value: string) => void;
  description?: string;
}

function Dropdown({ label, value, options, onChange, description }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-xl border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-surface-900 dark:text-white hover:border-surface-300 dark:hover:border-white/[0.12] transition-colors"
      >
        <span className="truncate">{selected?.icon}{selected?.icon ? ' ' : ''}{selected?.label || options[0]?.label}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-surface-400 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f] shadow-xl shadow-black/[0.08] dark:shadow-black/[0.3] py-1 max-h-48 overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2',
                opt.value === value
                  ? 'bg-brand-500/10 text-brand-500 font-medium'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04]'
              )}
            >
              {opt.icon && <span>{opt.icon}</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {description && <p className="text-[10px] text-surface-400 mt-1">{description}</p>}
    </div>
  );
}

function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <div className="p-4 rounded-xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
      <p className="text-xs text-surface-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-surface-900 dark:text-white">{value}</p>
      {change && <p className="text-xs text-memory-500 mt-0.5">{change}</p>}
    </div>
  );
}

function CreatePageContent({ initialPrompt = '' }: { initialPrompt?: string }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedType, setSelectedType] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'preview' | 'design' | 'instructions' | 'contact'>('files');
  const [selectedFile, setSelectedFile] = useState('package.json');
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState('');
  const [modelTier, setModelTier] = useState('auto');
  const [techStack, setTechStack] = useState('auto');

  const currentFile = generatedFiles.find(f => f.name === selectedFile) || generatedFiles[0];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsBuilding(true);
    try {
      // Call the actual Genesis API
      const response = await fetch('/api/v1/agents/genesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          organization_id: 'org-123', // In a real app, this would come from context/auth
          user_id: 'user-123'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate system');
      }

      const result = await response.json();
      
      setIsBuilding(false);
      setGenerated(true);
      
      // Redirect to the newly created project after a brief delay to show success
      setTimeout(() => {
        window.location.href = `/dashboard/projects/${result.project_id}`;
      }, 1500);

    } catch (error) {
      console.error('Generation error:', error);
      setIsBuilding(false);
      alert('Failed to generate your workspace. Please try again.');
    }
  };

  const handleCopyAll = () => {
    const allCode = generatedFiles.map(f => `// ${f.name}\n${f.content}`).join('\n\n');
    navigator.clipboard.writeText(allCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const allCode = generatedFiles.map(f => `// ${f.name}\n${f.content}`).join('\n\n');
    const blob = new Blob([allCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'e-commerce-analytics-dashboard.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const fileTree = [
    { name: 'package.json', icon: FileText },
    { name: 'tsconfig.json', icon: FileText },
    { name: 'next.config.js', icon: FileText },
    { name: 'postcss.config.js', icon: FileText },
    { name: 'tailwind.config.ts', icon: FileText },
    { name: 'layout.tsx', icon: FileText },
    { name: 'page.tsx', icon: FileText },
    { name: 'route.ts', icon: FileText },
    { name: 'globals.css', icon: FileText },
    { name: 'mockData.ts', icon: FileText },
    { name: 'Header.tsx', icon: FileText },
    { name: 'Sidebar.tsx', icon: FileText },
    { name: 'Chart.tsx', icon: FileText },
    { name: 'schema.prisma', icon: FileText },
    { name: '.env.example', icon: FileText },
    { name: 'Dockerfile', icon: FileText },
    { name: 'docker-compose.yml', icon: FileText },
    { name: 'README.md', icon: FileText },
  ];

  return (
    <div className={cn('min-h-screen bg-surface-50 dark:bg-surface-950', fullscreen && 'fixed inset-0 z-50 overflow-y-auto')}>
      <SiteNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200/50 dark:border-brand-800/50 text-sm font-medium text-brand-700 dark:text-brand-300 mb-3">
              <Sparkles className="w-4 h-4" />
              Genesis App Builder
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Describe what to build
            </h1>
          </div>
          {generated && (
            <button onClick={() => setFullscreen(!fullscreen)} className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-colors">
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Config Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Dropdown label="Industry" value={industry} options={industries} onChange={setIndustry} />
          <Dropdown label="Category" value={category} options={categories} onChange={setCategory} description="App type filter" />
          <Dropdown label="Model Tier" value={modelTier} options={modelTiers} onChange={setModelTier} description="Choose your AI model budget tier" />
          <Dropdown label="Tech Stack" value={techStack} options={techStacks} onChange={setTechStack} />
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build..."
              rows={4}
              className="w-full px-5 py-4 text-sm rounded-2xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isBuilding}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuilding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {examplePrompts.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              >
                {ex.length > 50 ? ex.slice(0, 50) + '...' : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Output */}
        {generated && (
          <div className="animate-fade-in">
            {/* Project Header */}
            <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 mb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">E-Commerce Analytics Dashboard</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400 max-w-2xl">
                    A React-based e-commerce dashboard with real-time sales data, inventory tracking, and AI-powered sales forecasting.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={handleDownload} className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download ZIP
                  </button>
                  <button onClick={handleCopyAll} className="px-4 py-2 text-sm font-semibold rounded-xl border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all flex items-center gap-2">
                    {copied ? <Check className="w-4 h-4 text-memory-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy All Code'}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 rounded-full bg-intelligence-500/10 text-intelligence-500 text-xs font-medium">
                  Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS
                </span>
                <span className="text-xs text-surface-400 flex items-center gap-1">
                  <FolderOpen className="w-3.5 h-3.5" /> 18 files generated
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-4 border-b border-surface-200 dark:border-white/[0.06]">
              {([
                { id: 'files', label: 'Files', icon: Code },
                { id: 'preview', label: 'Preview', icon: Eye },
                { id: 'design', label: 'Design', icon: Palette },
                { id: 'instructions', label: 'Run Instructions', icon: BookOpen },
                { id: 'contact', label: 'Contact', icon: Phone },
              ] as const).map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-[1px]',
                      activeTab === tab.id
                        ? 'border-brand-500 text-brand-500'
                        : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === 'files' && (
              <div className="grid md:grid-cols-[240px_1fr] gap-4">
                <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-2 max-h-[500px] overflow-y-auto">
                  {fileTree.map(file => {
                    const Icon = file.icon;
                    const isSelected = selectedFile === file.name;
                    return (
                      <button
                        key={file.name}
                        onClick={() => setSelectedFile(file.name)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                          isSelected
                            ? 'bg-brand-500/10 text-brand-500 font-medium'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-white/[0.04]'
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate font-mono text-xs">{file.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-200 dark:border-white/[0.06] bg-surface-50 dark:bg-white/[0.03]">
                    <span className="text-xs font-mono text-surface-500">{currentFile.name}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentFile.content);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-1 rounded text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-memory-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-surface-800 dark:text-surface-200 overflow-x-auto max-h-[450px] leading-relaxed">
                    <code>{currentFile.content}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Live Preview</h3>
                  <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all flex items-center gap-2">
                    <Play className="w-4 h-4" /> Run Preview
                  </button>
                </div>
                <div className="border border-surface-200 dark:border-white/[0.06] rounded-xl overflow-hidden bg-white">
                  <div className="flex items-center gap-2 px-4 py-2 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-white/[0.06]">
                    <div className="w-3 h-3 rounded-full bg-danger-500" />
                    <div className="w-3 h-3 rounded-full bg-warning-500" />
                    <div className="w-3 h-3 rounded-full bg-memory-500" />
                    <span className="ml-2 text-xs text-surface-400 font-mono">localhost:3000</span>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <StatCard label="Total Revenue" value="$284,500" change="+12.5% vs last month" />
                      <StatCard label="Orders" value="1,234" change="+8.3% vs last month" />
                      <StatCard label="Customers" value="892" change="+5.7% vs last month" />
                      <StatCard label="Growth" value="12.5%" change="+2.1 pp vs last month" />
                    </div>
                    <div className="p-4 rounded-xl border border-surface-200/50 dark:border-white/[0.06] bg-surface-50 dark:bg-surface-800/50">
                      <p className="text-sm font-medium text-surface-900 dark:text-white mb-3">Sales Overview</p>
                      <div className="flex items-end gap-2 h-32">
                        {[60, 45, 75, 68, 90, 82].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full rounded-t-md bg-brand-500 transition-all" style={{ height: `${h}%` }} />
                            <span className="text-[10px] text-surface-400">{['Jan','Feb','Mar','Apr','May','Jun'][i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Design System</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Colors</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Primary', color: 'bg-brand-500' },
                        { label: 'Secondary', color: 'bg-surface-500' },
                        { label: 'Background', color: 'bg-surface-50 dark:bg-surface-950' },
                        { label: 'Surface', color: 'bg-white dark:bg-surface-900' },
                      ].map(c => (
                        <div key={c.label} className="flex items-center gap-3">
                          <div className={cn('w-8 h-8 rounded-lg border border-surface-200 dark:border-white/[0.06]', c.color)} />
                          <span className="text-sm text-surface-600 dark:text-surface-400">{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Typography</p>
                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-surface-900 dark:text-white">Heading XL</p>
                      <p className="text-lg font-semibold text-surface-900 dark:text-white">Heading Large</p>
                      <p className="text-base font-medium text-surface-900 dark:text-white">Body Text</p>
                      <p className="text-sm text-surface-500">Small Text / Captions</p>
                      <p className="text-xs font-mono text-surface-600 dark:text-surface-400">font-family: Inter, sans-serif</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Run Instructions</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">1. Install dependencies</p>
                    <div className="p-3 rounded-xl bg-surface-100 dark:bg-white/[0.06] font-mono text-sm text-surface-800 dark:text-surface-200">npm install</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">2. Set up environment</p>
                    <div className="p-3 rounded-xl bg-surface-100 dark:bg-white/[0.06] font-mono text-sm text-surface-800 dark:text-surface-200">cp .env.example .env.local</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">3. Run database migrations</p>
                    <div className="p-3 rounded-xl bg-surface-100 dark:bg-white/[0.06] font-mono text-sm text-surface-800 dark:text-surface-200">npx prisma migrate dev</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">4. Start development server</p>
                    <div className="p-3 rounded-xl bg-surface-100 dark:bg-white/[0.06] font-mono text-sm text-surface-800 dark:text-surface-200">npm run dev</div>
                  </div>
                  <div className="p-4 rounded-xl bg-warning-500/10 border border-warning-500/20">
                    <p className="text-sm text-warning-600 dark:text-warning-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Make sure PostgreSQL is running locally or update DATABASE_URL in .env.local
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Need Help?</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: MessageSquare, label: 'Chat Support', desc: 'Talk to our AI support agent', action: 'Start Chat', color: 'from-brand-500 to-brand-600' },
                    { icon: BookOpen, label: 'Documentation', desc: 'Browse the full API docs', action: 'View Docs', color: 'from-intelligence-500 to-intelligence-600' },
                    { icon: Phone, label: 'Schedule Call', desc: 'Talk to a solutions engineer', action: 'Book Now', color: 'from-memory-500 to-memory-600' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="p-5 rounded-xl border border-surface-200/50 dark:border-white/[0.06] bg-surface-50 dark:bg-white/[0.03]">
                        <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', item.color)}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-semibold text-surface-900 dark:text-white mb-1">{item.label}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">{item.desc}</p>
                        <button className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                          {item.action} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!generated && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500/20 to-intelligence-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Ready to build something amazing?</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 max-w-md mx-auto">
              Configure your project settings above, describe what you need, and AI will generate the complete application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PromptInitializer() {
  const searchParams = useSearchParams();
  const urlPrompt = searchParams.get('prompt') || '';
  return <CreatePageContent initialPrompt={urlPrompt} />;
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    }>
      <PromptInitializer />
    </Suspense>
  );
}