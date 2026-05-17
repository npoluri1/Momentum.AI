'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent, Button, Input, Select } from '@/components/ui';
import { ArrowLeft, Bot, Sparkles, Globe, Cpu, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const providerOptions = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Gemini' },
];

const modelByProvider: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  anthropic: [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  ],
  gemini: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-ultra', label: 'Gemini Ultra' },
  ],
};

const toolOptions = [
  { value: 'web_search', label: 'Web Search' },
  { value: 'code_interpreter', label: 'Code Interpreter' },
  { value: 'file_reader', label: 'File Reader' },
  { value: 'image_gen', label: 'Image Generation' },
  { value: 'api_caller', label: 'API Caller' },
];

const providerIcons: Record<string, typeof Bot> = {
  openai: Sparkles,
  anthropic: Globe,
  gemini: Cpu,
};

export default function NewAgentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    provider: 'openai' as 'openai' | 'anthropic' | 'gemini',
    model: 'gpt-4',
    systemPrompt: '',
    temperature: 0.7,
    tools: [] as string[],
    memory: false,
  });

  const models = modelByProvider[form.provider] || [];
  const ProviderIcon = providerIcons[form.provider];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Agent name is required');
      return;
    }
    setSaving(true);
    try {
      const agent = await api.createAgent(form);
      toast.success('Agent created successfully');
      router.push(`/agents/${agent.id}`);
    } catch {
      toast.error('Failed to create agent');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Agent</h1>
          <p className="text-sm text-gray-500 mt-1">Configure a new AI agent for your team</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Basic Information
            </h2>
            <Input
              id="name"
              label="Agent Name"
              placeholder="e.g. Code Assistant"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="What does this agent do?"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <ProviderIcon className="h-4 w-4" />
              Model Configuration
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Provider"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value as 'openai' | 'anthropic' | 'gemini', model: modelByProvider[e.target.value]?.[0]?.value || 'gpt-4' })}
                options={providerOptions}
              />
              <Select
                label="Model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                options={models}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Temperature: {form.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-300">System Prompt</label>
              <textarea
                id="systemPrompt"
                value={form.systemPrompt}
                onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
                rows={5}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="You are a helpful AI assistant that..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-300">Tools & Memory</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {toolOptions.map((tool) => (
                <label key={tool.value} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.tools.includes(tool.value)}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        tools: e.target.checked
                          ? [...form.tools, tool.value]
                          : form.tools.filter((t) => t !== tool.value),
                      });
                    }}
                    className="rounded border-gray-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-300">{tool.label}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
              <Database className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-300">Enable Memory</p>
                <p className="text-xs text-gray-600">Agent remembers past conversations</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, memory: !form.memory })}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${form.memory ? 'bg-indigo-500' : 'bg-gray-600'}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform mt-0.5 ${form.memory ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={saving}>Create Agent</Button>
        </div>
      </form>
    </div>
  );
}
