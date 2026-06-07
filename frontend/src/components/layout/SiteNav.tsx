'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Zap, ChevronDown, Menu, X, Download, Bot, Workflow, AppWindow, Star, LineChart,
  Globe, Users, Shield, Grid3X3, Code, BarChart3, Trello, Blocks, Box, Layers,
  Moon, Sun, ArrowRight, Briefcase, HandCoins, Building2,
} from 'lucide-react';

function MenuItem({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub: string }) {
  return (
    <Link href={sub.startsWith('/') ? sub : `/${sub.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06] cursor-pointer transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-colors">
        <Icon className="w-4 h-4 text-surface-600 dark:text-surface-400 group-hover:text-brand-500 transition-colors" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-surface-900 dark:text-white">{label}</div>
        <div className="text-xs text-surface-500 dark:text-surface-400 truncate">{sub.startsWith('/') ? 'Go to page' : sub}</div>
      </div>
    </Link>
  );
}

export default function SiteNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-surface-200/50 dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm shadow-brand-500/30">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-surface-900 dark:text-white" style={{ fontFamily: "'Comfortaa', sans-serif" }}>momentum ai</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {['Create', 'Connect', 'Clone', 'Company'].map((menu) => (
                <div
                  key={menu}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(menu)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button className="px-3 py-1.5 text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1">
                    {menu}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {activeMenu === menu && (
                    <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f] shadow-2xl shadow-black/20 p-2">
                      {menu === 'Create' && (
                        <>
                          <MenuItem icon={AppWindow} label="Vibe Apps" sub="/vibe-apps" />
                          <MenuItem icon={Bot} label="Vibe Agents" sub="/vibe-agents" />
                          <MenuItem icon={Workflow} label="Vibe Workflows" sub="/vibe-workflows" />
                          <MenuItem icon={Code} label="Vibe Coding" sub="/vibe-coding" />
                          <MenuItem icon={Box} label="AI System Builder" sub="/ai" />
                          <MenuItem icon={Star} label="Templates" sub="/templates" />
                          <MenuItem icon={LineChart} label="Pricing" sub="/pricing" />
                        </>
                      )}
                      {menu === 'Connect' && (
                        <>                            <MenuItem icon={Layers} label="Unify" sub="/features" />
                          <MenuItem icon={Globe} label="Remote Work" sub="/gallery" />
                          <MenuItem icon={Users} label="Client Portal" sub="/client-portal" />
                          <MenuItem icon={Shield} label="Enterprise" sub="/enterprise" />
                          <MenuItem icon={Grid3X3} label="Integrations" sub="/integrations" />
                          <MenuItem icon={Code} label="Developers" sub="/developers" />
                        </>
                      )}
                      {menu === 'Clone' && (
                        <>
                          <MenuItem icon={Star} label="Gallery" sub="/gallery" />
                          <MenuItem icon={Blocks} label="Features" sub="/features" />
                          <MenuItem icon={BarChart3} label="Dashboards" sub="/gallery" />
                          <MenuItem icon={Workflow} label="Workflows" sub="/gallery" />
                          <MenuItem icon={Trello} label="Tools" sub="/gallery" />
                          <MenuItem icon={Globe} label="Websites" sub="/gallery" />
                          <MenuItem icon={Box} label="Kits" sub="/gallery" />
                        </>
                      )}
                      {menu === 'Company' && (
                        <>
                          <MenuItem icon={Users} label="About" sub="/about" />
                          <MenuItem icon={Briefcase} label="Careers" sub="/careers" />
                          <MenuItem icon={Shield} label="Security" sub="/security" />
                          <MenuItem icon={HandCoins} label="Affiliates" sub="/affiliates" />
                          <MenuItem icon={Building2} label="Enterprise" sub="/enterprise" />
                          <MenuItem icon={Code} label="Developers" sub="/developers" />
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/download" className="text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">Download</Link>
            <Link href="/blog" className="text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">Blog</Link>
            <Link href="/changelog" className="text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">Changelog</Link>
            <Link href="/pricing" className="text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">Pricing</Link>
            <Link href="/auth/login" className="text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">Login</Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/auth/register" className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25 transition-all active:scale-[0.98]">
              Sign up for free
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline-block" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-white/[0.06]">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f] max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <Link href="/download" className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06]">Download</Link>
            <Link href="/blog" className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06]">Blog</Link>
            <Link href="/changelog" className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06]">Changelog</Link>
            <Link href="/pricing" className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06]">Pricing</Link>
            <Link href="/auth/login" className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06]">Login</Link>
            <div className="pt-2 border-t border-surface-200 dark:border-white/[0.06]">
              <p className="px-3 py-1 text-xs font-semibold text-surface-400 uppercase tracking-wider">Create</p>
              <MenuItem icon={AppWindow} label="Vibe Apps" sub="/vibe-apps" />
              <MenuItem icon={Bot} label="Vibe Agents" sub="/vibe-agents" />
              <MenuItem icon={Workflow} label="Vibe Workflows" sub="/vibe-workflows" />
              <MenuItem icon={Code} label="Vibe Coding" sub="/vibe-coding" />
              <p className="px-3 py-1 mt-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">Connect</p>
              <MenuItem icon={Grid3X3} label="Integrations" sub="/integrations" />
              <MenuItem icon={Download} label="Downloads" sub="/download" />
              <MenuItem icon={Code} label="Developer API" sub="/developers" />
              <p className="px-3 py-1 mt-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">Company</p>
              <MenuItem icon={Users} label="About" sub="/about" />
              <MenuItem icon={Briefcase} label="Careers" sub="/careers" />
              <MenuItem icon={Shield} label="Security" sub="/security" />
              <MenuItem icon={HandCoins} label="Affiliates" sub="/affiliates" />
              <MenuItem icon={Building2} label="Enterprise" sub="/enterprise" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
