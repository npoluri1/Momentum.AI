'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Heart, User, ArrowRight, Mail, Calendar,
  BookOpen, Tag, TrendingUp,
} from 'lucide-react';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';

const categories = [
  'All',
  'AI & Automation',
  'Tutorials',
  'Product Updates',
  'Engineering',
  'Design',
  'Company',
];

const posts = [
  {
    title: 'AI Micro Apps Explained: Why 150,000+ Have Already Been Built in 2026',
    category: 'AI & Automation',
    excerpt: 'TechCrunch coined "micro apps" in January 2026. Gizmo raised $22M. And on Momentum AI Genesis alone, non-developers have already built 150,000+ of them. Here is what they are, why they matter, and the 12 archetypes you can clone today.',
    author: 'Alex Chen',
    date: 'May 26, 2026',
    readTime: '17 min read',
    likes: 324,
    featured: true,
    gradient: 'from-brand-500 via-intelligence-500 to-execution-500',
  },
  {
    title: 'Custom Domains, Secured Faster',
    category: 'Product Updates',
    excerpt: 'Custom domains now provision automatically with SSL certificates in under 60 seconds. No more waiting. No more configuration. Just point your DNS and go.',
    author: 'Sarah Chen',
    date: 'May 29, 2026',
    readTime: '4 min read',
    likes: 186,
    gradient: 'from-intelligence-500 to-brand-500',
  },
  {
    title: 'Automate from Agents, Teams & Media',
    category: 'Product Updates',
    excerpt: 'New automation triggers let you start workflows from agent decisions, team member changes, and media uploads. Your workspace reacts to what matters.',
    author: 'Sarah Chen',
    date: 'May 28, 2026',
    readTime: '3 min read',
    likes: 142,
    gradient: 'from-memory-500 to-execution-500',
  },
  {
    title: 'Connect Any Service, Keys Stay Safe',
    category: 'Product Updates',
    excerpt: 'Introducing secure credential storage for your API keys and secrets. Connect any service without exposing sensitive data — encrypted at rest and never logged.',
    author: 'Elena Voss',
    date: 'May 26, 2026',
    readTime: '5 min read',
    likes: 204,
    gradient: 'from-execution-500 to-memory-500',
  },
  {
    title: 'AI Agent Teams Collaboration: How They Co-Edit Work With Humans in 2026',
    category: 'AI & Automation',
    excerpt: 'Multiple AI agents can now collaborate on the same project simultaneously — editing, reviewing, and handing off tasks to each other and to human team members in real-time.',
    author: 'David Kim',
    date: 'May 22, 2026',
    readTime: '12 min read',
    likes: 267,
    gradient: 'from-brand-500 to-intelligence-500',
  },
  {
    title: 'AI App Builder vs AI Workspace Builder: The 2026 Category Split',
    category: 'AI & Automation',
    excerpt: 'The AI tooling landscape is diverging into two distinct categories: app builders that generate code, and workspace builders like Momentum AI that create living systems with memory, agents, and automations.',
    author: 'Alex Chen',
    date: 'May 19, 2026',
    readTime: '10 min read',
    likes: 198,
    gradient: 'from-intelligence-500 to-execution-500',
  },
  {
    title: 'How to Build an Internal Tool Without Code in 2026',
    category: 'Tutorials',
    excerpt: 'No engineering backlog? No problem. Learn how to build a fully functional internal tool with AI agents, databases, and automations — all from a single prompt.',
    author: 'Aisha Patel',
    date: 'May 15, 2026',
    readTime: '8 min read',
    likes: 156,
    gradient: 'from-memory-500 to-intelligence-500',
  },
  {
    title: 'Building the Real-Time Collaboration Engine',
    category: 'Engineering',
    excerpt: 'A deep dive into the architecture powering Momentum AI\'s real-time sync, CRDT-based conflict resolution, and offline-first design that makes collaboration seamless.',
    author: 'Elena Voss',
    date: 'May 10, 2026',
    readTime: '10 min read',
    likes: 89,
    gradient: 'from-brand-500 to-execution-500',
  },
  {
    title: 'Designing AI-First User Experiences',
    category: 'Design',
    excerpt: 'How our design team approaches the challenge of making AI agents feel like collaborators, not tools — with principles for natural interaction and trust-building.',
    author: 'Jordan Lee',
    date: 'May 5, 2026',
    readTime: '7 min read',
    likes: 134,
    gradient: 'from-warning-400 to-brand-500',
  },
  {
    title: 'From Startup to Scale: Our Journey to 5M Users',
    category: 'Company',
    excerpt: 'How Momentum AI grew from a small team with a big idea to serving millions of users worldwide. Lessons learned, mistakes made, and what\'s next.',
    author: 'Jordan Lee',
    date: 'Apr 28, 2026',
    readTime: '6 min read',
    likes: 312,
    gradient: 'from-execution-500 to-memory-500',
  },
];

const recentPosts = [
  'AI Micro Apps Explained: Why 150,000+ Have Already Been Built in 2026',
  'Custom Domains, Secured Faster',
  'Automate from Agents, Teams & Media',
  'Connect Any Service, Keys Stay Safe',
];

const categoriesWidget = [
  'AI & Automation', 'Tutorials', 'Product Updates',
  'Engineering', 'Design', 'Company',
];

const tagCloud = [
  'AI Agents', 'Micro Apps', 'Workflows', 'Automation', 'CRDT',
  'Real-time Sync', 'Collaboration', 'No-Code', 'Internal Tools',
  'Custom Domains', 'Security', 'API Keys',
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const featuredPost = filteredPosts.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative">
        <section className="pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <BookOpen className="w-4 h-4" />
                Insights & Updates
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-surface-900 dark:text-white">Momentum AI Blog</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Product updates, tips, and stories from the Momentum AI team
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {featuredPost && (
              <div className="relative rounded-2xl overflow-hidden border border-surface-200/50 dark:border-white/[0.06] group cursor-pointer mb-10">
                <div className={cn(
                  'aspect-[2/1] md:aspect-[3/1] relative bg-gradient-to-br',
                  featuredPost.gradient
                )}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-grid-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm mb-3">
                      {featuredPost.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base max-w-2xl mb-4 line-clamp-2">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold text-white">
                          {featuredPost.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{featuredPost.author}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                    activeCategory === cat
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                      : 'bg-white dark:bg-white/[0.04] text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/[0.08] hover:bg-surface-50 dark:hover:bg-white/[0.06]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-8">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory)).map((post, i) => (
                    <div
                      key={i}
                      className="group rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                      <div className={cn(
                        'aspect-video relative bg-gradient-to-br',
                        post.gradient
                      )}>
                        <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-black/50 text-white/90 backdrop-blur-sm">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-2 leading-snug group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500/20 to-intelligence-500/20 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-surface-700 dark:text-surface-300">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-surface-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime.replace(' min read', 'm')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-surface-200 dark:border-white/[0.08] text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-white/[0.06] disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-9 h-9 rounded-lg text-sm font-medium transition-all',
                        currentPage === page
                          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                          : 'border border-surface-200 dark:border-white/[0.08] text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-white/[0.06]'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <span className="text-surface-400 px-1">...</span>
                  <button className="w-9 h-9 rounded-lg border border-surface-200 dark:border-white/[0.08] text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-white/[0.06] text-sm font-medium transition-all">
                    8
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === 8}
                    className="p-2 rounded-lg border border-surface-200 dark:border-white/[0.08] text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-white/[0.06] disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <aside className="hidden lg:block w-80 shrink-0 space-y-6">
                <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-5">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-500" />
                    Recent Posts
                  </h3>
                  <div className="space-y-3">
                    {recentPosts.map((post, i) => (
                      <div key={i} className="group cursor-pointer">
                        <p className="text-sm text-surface-600 dark:text-surface-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                          {post}
                        </p>
                        {i < recentPosts.length - 1 && (
                          <div className="border-t border-surface-100 dark:border-white/[0.06] mt-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-5">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-intelligence-500" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categoriesWidget.map((cat, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white cursor-pointer transition-colors py-1"
                      >
                        <span>{cat}</span>
                        <span className="text-xs text-surface-400 bg-surface-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-full">
                          {posts.filter(p => p.category === cat).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-5">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tagCloud.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-surface-100 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Stay Updated
                </h2>
                <p className="text-brand-100 mb-8 max-w-md mx-auto">
                  Get the latest posts delivered straight to your inbox. No spam, ever.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <div className="relative flex-1 w-full">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>
                  <button className="px-6 py-3 text-sm font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg whitespace-nowrap flex items-center gap-2">
                    Subscribe <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
