'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minus, Maximize2, Bot, User, Zap, Globe, FileText, Cpu, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type PaletteTab = 'tools' | 'connect' | 'files' | 'models';

interface PaletteCategory {
  id: PaletteTab;
  label: string;
  icon: React.ElementType;
  sections: { label: string; items: string[] }[];
}

const paletteData: PaletteCategory[] = [
  {
    id: 'tools',
    label: 'Tools',
    icon: Zap,
    sections: [
      { label: 'Web', items: ['Web Search', 'Web Scraping', 'YouTube Transcribe', 'RSS Reader'] },
      { label: 'Media', items: ['Image Generation', 'Image Analysis', 'Audio Transcription', 'PDF Reader'] },
      { label: 'Code', items: ['Code Execution', 'Bash Sandbox', 'Custom Commands', 'Data Processing'] },
      { label: 'Workspace', items: ['Project Edit', 'Knowledge Read', 'Knowledge Write', 'Calendar', 'Email'] },
      { label: 'Coordination', items: ['Ask Agent', 'Ask Agent Team', 'Ask Questions', 'Slash Commands'] },
    ],
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: Globe,
    sections: [
      { label: 'Comms', items: ['Slack', 'Discord', 'Teams', 'WhatsApp', 'Telegram', 'Zoom', 'Email', 'Gmail', 'Mailchimp'] },
      { label: 'CRM & Payments', items: ['HubSpot', 'Salesforce', 'Apollo', 'Stripe', 'Shopify'] },
      { label: 'Google', items: ['Sheets', 'Drive', 'Calendar', 'Docs', 'Forms'] },
      { label: 'Developer', items: ['GitHub', 'Jira', 'Linear', 'Webhook'] },
      { label: 'Project', items: ['Trello', 'Asana', 'Notion', 'Monday'] },
      { label: 'Social', items: ['LinkedIn', 'X', 'Facebook', 'Reddit', 'YouTube'] },
      { label: 'Scheduling', items: ['Calendly', 'Typeform', 'Webflow'] },
      { label: 'Publishing', items: ['WordPress', 'Twilio'] },
      { label: 'Storage', items: ['Airtable', 'OneDrive', 'Dropbox', 'Box', 'RSS'] },
    ],
  },
  {
    id: 'files',
    label: 'Files',
    icon: FileText,
    sections: [
      { label: 'Docs', items: ['PDF', 'Word', 'PowerPoint', 'Markdown', 'Plain text'] },
      { label: 'Data', items: ['Excel', 'CSV', 'JSON'] },
      { label: 'Code', items: ['Code'] },
      { label: 'Media', items: ['Images', 'Audio', 'Video'] },
      { label: 'Bundles', items: ['ZIP', 'Google Drive', 'Dropbox'] },
    ],
  },
  {
    id: 'models',
    label: 'Models',
    icon: Cpu,
    sections: [
      { label: 'OpenAI', items: ['GPT 5.2', 'GPT 5.1', 'o3', 'o4-mini'] },
      { label: 'Anthropic', items: ['Claude Opus 4.7', 'Claude Opus 4.6', 'Claude Sonnet 4.6', 'Claude Haiku 3.5'] },
      { label: 'Google', items: ['Gemini 3.1 Pro', 'Gemini 3 Pro', 'Gemini 2.5 Flash', 'Gemini 2.0 Flash'] },
      { label: 'Open-weight', items: ['Qwen 3.6 Max', 'Kimi K2.6', 'DeepSeek V4 Pro', 'DeepSeek V4 Flash', 'MiniMax', 'GLM'] },
    ],
  },
];

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [activePalette, setActivePalette] = useState<PaletteTab>('tools');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am GIO, your Global Intelligence Orchestrator. How can I assist you with your workspace today?',
      timestamp: new Date(),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll work on "${input}". Let me set up the right tools and integrations for this. I'll keep you posted on progress.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 1000);
  };

  const handleItemClick = (item: string, section: string) => {
    const prompt = `Connect/integrate ${item} (${section}) and set it up for my workspace`;
    setInput(prompt);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/40 hover:shadow-xl hover:shadow-brand-500/50 hover:scale-105 transition-all duration-300 z-50 group"
      >
        <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex flex-col bg-surface-900 border border-surface-800/50 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden',
        isMinimized ? 'h-14 w-64' : 'h-[600px] w-[420px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-800/50 border-b border-surface-700/30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-brand-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">GIO Assistant</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-surface-400">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-surface-400 hover:text-surface-200 hover:bg-surface-700/50 rounded-md transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-surface-400 hover:text-surface-200 hover:bg-surface-700/50 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3 max-w-[85%]',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    msg.role === 'assistant' ? 'bg-surface-800 text-brand-400' : 'bg-brand-600 text-white'
                  )}
                >
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div
                  className={cn(
                    'px-3 py-2 rounded-2xl text-sm',
                    msg.role === 'assistant'
                      ? 'bg-surface-800 text-surface-200 rounded-tl-none'
                      : 'bg-brand-600 text-white rounded-tr-none shadow-lg shadow-brand-500/10'
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] opacity-50 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Palette Tabs */}
          <div className="flex items-center gap-0.5 px-3 py-2 bg-surface-800/30 border-t border-surface-700/30">
            {paletteData.map((tab) => {
              const Icon = tab.icon;
              const isActive = activePalette === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePalette(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 shadow-sm'
                      : 'text-surface-500 hover:text-surface-300 hover:bg-surface-700/50'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Palette Content */}
          <div className="overflow-y-auto max-h-[200px] px-3 py-2 space-y-2 scrollbar-thin border-t border-surface-800/30">
            {paletteData.filter(t => t.id === activePalette).map((tab) => (
              tab.sections.map((section) => (
                <div key={section.label}>
                  <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5 px-1">{section.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {section.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleItemClick(item, section.label)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-surface-800/50 border border-surface-700/30 text-surface-400 hover:text-surface-200 hover:bg-surface-700/50 hover:border-brand-500/30 transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 flex items-center gap-2 overflow-x-auto scrollbar-hide border-t border-surface-800/30 bg-surface-900/30">
            <Sparkles className="w-3 h-3 text-brand-400 shrink-0" />
            {['Build an app', 'Create agent', 'Set up workflow', 'Connect tool'].map((p) => (
              <button
                key={p}
                onClick={() => setInput(p)}
                className="shrink-0 px-2.5 py-1 text-[10px] font-medium rounded-full bg-surface-800/50 text-surface-400 hover:text-surface-200 hover:bg-surface-700/50 transition-all whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-surface-800/50 bg-surface-900/50">
            <form onSubmit={handleSend} className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const form = (e.target as HTMLTextAreaElement).closest('form');
                      if (form) form.requestSubmit();
                    }
                  }}
                  placeholder="Ask GIO anything..."
                  rows={1}
                  className="flex-1 w-full bg-surface-800 border border-surface-700/50 rounded-xl px-3 py-2 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all resize-none overflow-y-auto scrollbar-thin min-h-[36px] max-h-[80px] leading-relaxed"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="shrink-0 rounded-xl h-[36px]"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
