'use client';

import { useEffect, useState, useRef } from 'react';
import type React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Send, Bot, Settings, Cpu,
  Database, Code, Clock, CheckCircle, XCircle,
  Play, Copy,
  User, Brain, Webhook, Zap, RefreshCw, Activity,
  BarChart3, MessageSquare, FileText, Image, Globe,
} from 'lucide-react';
import type { Agent, AgentMessage } from '@/lib/types';
import toast from 'react-hot-toast';

const modelOptions = [
  { value: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', speed: 'Fast', quality: 'Best' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI', speed: 'Fast', quality: 'Great' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI', speed: 'Fastest', quality: 'Good' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus', provider: 'Anthropic', speed: 'Moderate', quality: 'Best' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', provider: 'Anthropic', speed: 'Fast', quality: 'Great' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku', provider: 'Anthropic', speed: 'Fastest', quality: 'Good' },
  { value: 'gemini-pro', label: 'Gemini Pro', provider: 'Google', speed: 'Fast', quality: 'Great' },
  { value: 'gemini-ultra', label: 'Gemini Ultra', provider: 'Google', speed: 'Moderate', quality: 'Best' },
];

const toolOptions = [
  { value: 'web_search', label: 'Web Search', icon: Globe, desc: 'Search the internet' },
  { value: 'code_interpreter', label: 'Code Interpreter', icon: Code, desc: 'Run Python code' },
  { value: 'file_reader', label: 'File Reader', icon: FileText, desc: 'Read documents' },
  { value: 'image_gen', label: 'Image Generation', icon: Image, desc: 'Generate images' },
  { value: 'api_caller', label: 'API Caller', icon: Webhook, desc: 'Call external APIs' },
];

const sampleLogs = [
  { id: 'l1', action: 'Research competitor pricing', status: 'success', duration: '4.2s', tokens: 1240, timestamp: '2 min ago' },
  { id: 'l2', action: 'Analyze Q4 dataset', status: 'success', duration: '8.7s', tokens: 3450, timestamp: '15 min ago' },
  { id: 'l3', action: 'Write blog outline', status: 'success', duration: '3.1s', tokens: 980, timestamp: '1 hour ago' },
  { id: 'l4', action: 'Generate lead report', status: 'error', duration: '12.5s', tokens: 0, timestamp: '3 hours ago' },
  { id: 'l5', action: 'Summarize meeting notes', status: 'success', duration: '2.8s', tokens: 760, timestamp: '5 hours ago' },
];

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'config' | 'logs'>('chat');
  const [showLogs, setShowLogs] = useState(false);

  const [config, setConfig] = useState({
    systemPrompt: '',
    model: 'gpt-4o',
    temperature: 0.7,
    tools: [] as string[],
    memory: false,
  });

  useEffect(() => {
    if (!params.id) return;
    api.getAgent(params.id as string)
      .then((data) => {
        setAgent(data);
        setConfig({
          systemPrompt: data.systemPrompt || '',
          model: data.model || 'gpt-4o',
          temperature: data.temperature ?? 0.7,
          tools: data.tools || [],
          memory: data.memory || false,
        });
      })
      .catch(() => setError('Agent not found'))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      api.getAgentMessages(params.id as string)
        .then(setMessages)
        .catch(() => {});
    }
  }, [params.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !agent || sending) return;

    const userMsg: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      agentId: agent.id,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const response = await api.sendAgentMessage(agent.id, input.trim());
      setMessages((prev) => [...prev, response]);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  async function saveConfig() {
    if (!agent) return;
    try {
      const updated = await api.updateAgent(agent.id, config);
      setAgent(updated);
      toast.success('Agent configuration saved');
    } catch {
      toast.error('Failed to save configuration');
    }
  }

  const selectedModel = modelOptions.find(m => m.value === config.model);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-surface-400" />
        </div>
        <p className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{error}</p>
        <button onClick={() => router.back()} className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">Go back</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-white/[0.06] animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-100 dark:bg-white/[0.06] rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-surface-100 dark:bg-white/[0.06] rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-surface-100 dark:bg-white/[0.06] rounded-2xl animate-pulse" />
          <div className="h-96 bg-surface-100 dark:bg-white/[0.06] rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/50 dark:border-white/[0.06] shrink-0 bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-bold text-surface-900 dark:text-white">{agent.name}</h1>
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                    agent.status === 'active'
                      ? 'text-success-500 bg-success-500/10 border-success-500/20'
                      : 'text-surface-400 bg-surface-100 dark:bg-white/[0.04] border-surface-200 dark:border-white/[0.06]'
                  )}>
                    <div className={cn('w-1.5 h-1.5 rounded-full', agent.status === 'active' ? 'bg-success-500' : 'bg-surface-400')} />
                    {agent.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <p className="text-xs text-surface-400 dark:text-surface-500">{agent.model} · {agent.provider}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5',
                showLogs
                  ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                  : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 border border-surface-200/50 dark:border-transparent hover:bg-surface-200/50 dark:hover:bg-white/[0.1]'
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              Logs
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-1 border-b border-surface-200/50 dark:border-white/[0.06] bg-white/30 dark:bg-transparent">
          {[
            { key: 'chat' as const, label: 'Chat', icon: MessageSquare },
            { key: 'config' as const, label: 'Configuration', icon: Settings },
            { key: 'logs' as const, label: 'Logs', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all',
                activeTab === tab.key
                  ? 'text-brand-500 border-brand-500'
                  : 'text-surface-400 dark:text-surface-500 border-transparent hover:text-surface-600 dark:hover:text-surface-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex h-full">
              <div className="flex-1 flex flex-col min-w-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 flex items-center justify-center mb-5 border border-brand-500/10">
                        <Brain className="w-10 h-10 text-brand-500/60" />
                      </div>
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Chat with {agent.name}</h3>
                      <p className="text-sm text-surface-400 dark:text-surface-500 max-w-sm">
                        Ask me anything — I can research, analyze, write, and execute tasks for you.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-6 max-w-md">
                        {[
                          'Research latest market trends in AI',
                          'Write a blog post about productivity',
                          'Analyze this dataset for insights',
                          'Help me draft a sales email',
                        ].map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => setInput(prompt)}
                            className="text-xs px-3 py-2 rounded-xl bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.06] text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.08] transition-all text-left"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex items-start gap-3 animate-fade-in',
                          msg.role === 'user' ? 'flex-row-reverse' : ''
                        )}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shrink-0 shadow-sm">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={cn(
                          'rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[80%]',
                          msg.role === 'assistant'
                            ? 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-700 dark:text-surface-300 border border-surface-200/30 dark:border-white/[0.04]'
                            : 'bg-brand-500 text-white shadow-md shadow-brand-500/20 rounded-br-md'
                        )}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <div className={cn(
                            'flex items-center gap-2 mt-2',
                            msg.role === 'user' ? 'justify-end' : ''
                          )}>
                            <span className={cn(
                              'text-[10px]',
                              msg.role === 'assistant' ? 'text-surface-400 dark:text-surface-500' : 'text-white/60'
                            )}>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                            {msg.role === 'assistant' && (
                              <button
                                onClick={() => { navigator.clipboard.writeText(msg.content); toast.success('Copied!'); }}
                                className="p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {sending && (
                    <div className="flex items-start gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/30 dark:border-white/[0.04]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-surface-200/50 dark:border-white/[0.06] bg-white/50 dark:bg-[#0a0a0f]/50">
                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    <div className={cn(
                      'flex-1 flex items-end gap-2 p-2 rounded-2xl transition-all',
                      'bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent',
                      'focus-within:border-brand-500/30 focus-within:ring-2 focus-within:ring-brand-500/10'
                    )}>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                        placeholder={`Message ${agent.name}...`}
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none resize-none py-1.5 px-2 max-h-32"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className={cn(
                          'p-1.5 rounded-xl transition-all shrink-0',
                          input.trim() && !sending
                            ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20'
                            : 'text-surface-400 cursor-not-allowed'
                        )}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Agent Info Sidebar (chat mode) */}
              <aside className="hidden xl:block w-72 border-l border-surface-200/50 dark:border-white/[0.06] p-5 overflow-y-auto bg-white/30 dark:bg-[#0a0a0f]/30">
                <div className="space-y-4">
                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Tasks', value: '1,247', icon: CheckCircle, color: 'text-success-500' },
                      { label: 'Avg. Time', value: '3.2s', icon: Clock, color: 'text-intelligence-500' },
                      { label: 'Tokens', value: '45.2K', icon: Cpu, color: 'text-memory-500' },
                      { label: 'Rating', value: '4.8/5', icon: BarChart3, color: 'text-warning-500' },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                          <Icon className={cn('w-3.5 h-3.5 mb-1.5', stat.color)} />
                          <p className="text-sm font-bold text-surface-900 dark:text-white">{stat.value}</p>
                          <p className="text-[10px] text-surface-400">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tools */}
                  <div>
                    <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Tools</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.tools.length > 0 ? agent.tools.map((t) => {
                        const toolDef = toolOptions.find(to => to.value === t);
                        return (
                          <span key={t} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-lg bg-surface-100/50 dark:bg-white/[0.04] text-surface-500 dark:text-surface-400 border border-surface-200/30 dark:border-white/[0.04]">
                            <ToolIcon icon={toolDef?.icon} />
                            {toolDef?.label || t}
                          </span>
                        );
                      }) : (
                        <span className="text-[10px] text-surface-400">No tools enabled</span>
                      )}
                    </div>
                  </div>

                  {/* Model */}
                  <div>
                    <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Model</h4>
                    <div className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{agent.model}</p>
                      <p className="text-[10px] text-surface-400 capitalize">{agent.provider}</p>
                    </div>
                  </div>

                  {/* Memory toggle */}
                  <div>
                    <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Memory</h4>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                      <Database className={cn('w-4 h-4', agent.memory ? 'text-brand-500' : 'text-surface-400')} />
                      <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                        {agent.memory ? 'Conversation memory enabled' : 'Memory disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* CONFIG TAB */}
          {activeTab === 'config' && (
            <div className="p-6 md:p-8 max-w-3xl space-y-6">
              {/* System Prompt */}
              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">System Prompt</h3>
                <textarea
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  rows={6}
                  className="w-full bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/50 dark:border-white/[0.06] rounded-xl px-4 py-3 text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none font-mono"
                  placeholder="You are a helpful AI assistant that..."
                />
              </div>

              {/* Model & Temperature */}
              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Model Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">Model</label>
                    <select
                      value={config.model}
                      onChange={(e) => setConfig({ ...config, model: e.target.value })}
                      className="apple-input"
                    >
                      {modelOptions.map(m => (
                        <option key={m.value} value={m.value}>{m.label} ({m.provider})</option>
                      ))}
                    </select>
                    {selectedModel && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-surface-400">Speed: {selectedModel.speed}</span>
                        <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                        <span className="text-[10px] text-surface-400">Quality: {selectedModel.quality}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">
                      Temperature: {config.temperature.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                      className="w-full accent-brand-500 h-1.5 rounded-full appearance-none bg-surface-200 dark:bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-surface-400 mt-1">
                      <span>Precise</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools */}
              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {toolOptions.map((tool) => (
                    <button
                      key={tool.value}
                      onClick={() => {
                        setConfig({
                          ...config,
                          tools: config.tools.includes(tool.value)
                            ? config.tools.filter((t) => t !== tool.value)
                            : [...config.tools, tool.value],
                        });
                      }}
                      className={cn(
                        'flex items-start gap-2.5 p-3 rounded-xl border transition-all text-left',
                        config.tools.includes(tool.value)
                          ? 'bg-brand-500/10 border-brand-500/30'
                          : 'bg-surface-50/50 dark:bg-white/[0.02] border-surface-200/50 dark:border-white/[0.06] hover:bg-surface-100/50 dark:hover:bg-white/[0.04]'
                      )}
                    >
                      <tool.icon className={cn(
                        'w-4 h-4 mt-0.5',
                        config.tools.includes(tool.value) ? 'text-brand-500' : 'text-surface-400'
                      )} />
                      <div>
                        <p className={cn(
                          'text-xs font-semibold',
                          config.tools.includes(tool.value) ? 'text-brand-500' : 'text-surface-700 dark:text-surface-300'
                        )}>
                          {tool.label}
                        </p>
                        <p className="text-[10px] text-surface-400">{tool.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Memory */}
              <div className="apple-card p-5">
                <div className="flex items-center gap-3">
                  <Database className={cn('w-5 h-5', config.memory ? 'text-brand-500' : 'text-surface-400')} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">Memory</p>
                    <p className="text-xs text-surface-400">Agent remembers past conversations and context</p>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, memory: !config.memory })}
                    className={cn(
                      'relative inline-flex h-6 w-11 rounded-full transition-colors border-2 border-transparent',
                      config.memory ? 'bg-brand-500' : 'bg-surface-300 dark:bg-white/[0.12]'
                    )}
                  >
                    <span className={cn(
                      'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                      config.memory ? 'translate-x-5' : 'translate-x-0'
                    )} />
                  </button>
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setConfig({
                      systemPrompt: agent.systemPrompt || '',
                      model: agent.model || 'gpt-4o',
                      temperature: agent.temperature ?? 0.7,
                      tools: agent.tools || [],
                      memory: agent.memory || false,
                    });
                    toast.success('Configuration reset');
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={saveConfig}
                  className="apple-button-primary"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Runs', value: '1,247', change: '+12%', icon: Play, color: 'text-memory-500' },
                  { label: 'Success Rate', value: '98.2%', change: '+0.5%', icon: CheckCircle, color: 'text-success-500' },
                  { label: 'Avg Duration', value: '3.2s', change: '-0.3s', icon: Clock, color: 'text-intelligence-500' },
                  { label: 'Tokens Used', value: '45.2K', change: '+5.2K', icon: Cpu, color: 'text-brand-500' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="apple-stat-card">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={cn('w-4 h-4', stat.color)} />
                        <span className={cn(
                          'text-[10px] font-medium',
                          stat.change.startsWith('+') ? 'text-success-500' : 'text-surface-400'
                        )}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-surface-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent runs */}
              <div className="apple-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Executions</h3>
                  <button className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-100/50 dark:border-white/[0.03]">
                        {['Action', 'Status', 'Duration', 'Tokens', 'Time'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleLogs.map((log) => (
                        <tr key={log.id} className="border-b border-surface-100/30 dark:border-white/[0.02] hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{log.action}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                              log.status === 'success'
                                ? 'text-success-500 bg-success-500/10 border-success-500/20'
                                : 'text-danger-500 bg-danger-500/10 border-danger-500/20'
                            )}>
                              {log.status === 'success' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {log.status === 'success' ? 'Success' : 'Error'}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs text-surface-500 dark:text-surface-400 font-mono">{log.duration}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs text-surface-500 dark:text-surface-400 font-mono">{log.tokens.toLocaleString()}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs text-surface-400">{log.timestamp}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>        </div>
    </div>
  );
}

function ToolIcon({ icon: Icon }: { icon?: React.ComponentType<{ className?: string }> }) {
  if (!Icon) return null;
  return <Icon className="w-3 h-3" />;
}