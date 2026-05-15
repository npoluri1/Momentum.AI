'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, Button, Badge, Input, Select } from '@/components/ui';
import { ArrowLeft, Send, Brain, Cpu, Globe, Sparkles, Settings, MessageSquare, Database } from 'lucide-react';
import type { Agent, AgentMessage } from '@/lib/types';
import toast from 'react-hot-toast';

const modelOptions = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-ultra', label: 'Gemini Ultra' },
];

const toolOptions = [
  { value: 'web_search', label: 'Web Search' },
  { value: 'code_interpreter', label: 'Code Interpreter' },
  { value: 'file_reader', label: 'File Reader' },
  { value: 'image_gen', label: 'Image Generation' },
  { value: 'api_caller', label: 'API Caller' },
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
  const [activeTab, setActiveTab] = useState<'chat' | 'config' | 'memory'>('chat');

  const [config, setConfig] = useState({
    systemPrompt: '',
    model: 'gpt-4',
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
          model: data.model || 'gpt-4',
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-red-400 text-lg mb-2">{error}</p>
        <button onClick={() => router.back()} className="text-indigo-400 hover:text-indigo-300 text-sm">Go back</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-96 bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
          <p className="text-sm text-gray-500">{agent.model} &middot; {agent.provider}</p>
        </div>
        <Badge variant={agent.status === 'active' ? 'success' : 'default'} className="ml-auto">
          {agent.status}
        </Badge>
      </div>

      <div className="flex gap-2 border-b border-gray-800">
        {([
          { key: 'chat', label: 'Chat', icon: MessageSquare },
          { key: 'config', label: 'Configuration', icon: Settings },
          { key: 'memory', label: 'Memory', icon: Database },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'text-indigo-400 border-indigo-500'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-0 flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <Brain className="h-12 w-12 mb-3 text-gray-700" />
                    <p className="text-sm">Start a conversation with {agent.name}</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {msg.role === 'user' ? 'U' : 'AI'}
                      </div>
                      <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm ${
                        msg.role === 'user'
                          ? 'bg-indigo-500/10 text-gray-200'
                          : 'bg-gray-800 text-gray-300'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs text-gray-600 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-gray-700/50 p-4">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={sending}
                  />
                  <Button type="submit" isLoading={sending} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-300">Agent Info</h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Model</p>
                <p className="text-gray-200">{agent.model}</p>
              </div>
              <div>
                <p className="text-gray-500">Provider</p>
                <p className="text-gray-200 capitalize">{agent.provider}</p>
              </div>
              <div>
                <p className="text-gray-500">Temperature</p>
                <p className="text-gray-200">{agent.temperature}</p>
              </div>
              <div>
                <p className="text-gray-500">Tools</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {agent.tools.length > 0 ? agent.tools.map((t) => (
                    <Badge key={t} variant="info">{t}</Badge>
                  )) : <span className="text-gray-600">None</span>}
                </div>
              </div>
              <div>
                <p className="text-gray-500">Memory</p>
                <p className="text-gray-200">{agent.memory ? 'Enabled' : 'Disabled'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'config' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">System Prompt</label>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                rows={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter the system prompt for this agent..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Model"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                options={modelOptions}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Temperature: {config.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Tools</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {toolOptions.map((tool) => (
                  <label key={tool.value} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={config.tools.includes(tool.value)}
                      onChange={(e) => {
                        setConfig({
                          ...config,
                          tools: e.target.checked
                            ? [...config.tools, tool.value]
                            : config.tools.filter((t) => t !== tool.value),
                        });
                      }}
                      className="rounded border-gray-600 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-300">{tool.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <Database className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-300">Enable Memory</p>
                <p className="text-xs text-gray-600">Agent will remember past conversations</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, memory: !config.memory })}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${config.memory ? 'bg-indigo-500' : 'bg-gray-600'}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform mt-0.5 ${config.memory ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <Button onClick={saveConfig}>Save Configuration</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'memory' && (
        <Card>
          <CardContent className="p-6">
            {agent.memory ? (
              <div className="space-y-3">
                {messages.filter((m) => m.role !== 'system').slice(-10).map((msg) => (
                  <div key={msg.id} className="flex gap-3 p-3 rounded-lg bg-gray-800/50">
                    <Brain className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{msg.role} &middot; {new Date(msg.timestamp).toLocaleString()}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-8">No memory entries yet</p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Memory is disabled for this agent</p>
                <p className="text-gray-600 text-xs mt-1">Enable memory in the configuration tab</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
