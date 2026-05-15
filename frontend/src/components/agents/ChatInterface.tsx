'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, User, Sparkles, Loader2, Paperclip,
  StopCircle, RefreshCw, Maximize2, Minimize2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  agentId: string;
  agentName: string;
  agentColor?: string;
  onClose?: () => void;
  fullScreen?: boolean;
}

export default function ChatInterface({ agentId, agentName, agentColor = 'from-violet-500 to-purple-600', onClose, fullScreen: initialFullScreen = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: `Hi! I'm ${agentName}. How can I help you today?`, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(initialFullScreen);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        'hello': `Hello! I'm ${agentName}. How can I assist you today?`,
        'help': `I can help you with:\n- Lead research and enrichment\n- Creating and managing tasks\n- Analyzing data\n- Answering questions about your workspace`,
        'default': `I understand your request. Let me work on that for you. As ${agentName}, I can help with lead research, data analysis, task management, and more. What specific area would you like me to focus on?`,
      };

      const lower = input.toLowerCase();
      const response = responses[Object.keys(responses).find(k => lower.includes(k)) || 'default'];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      { id: '1', role: 'assistant', content: `Hi! I'm ${agentName}. How can I help you today?`, timestamp: new Date() },
    ]);
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden ${fullScreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[600px]'}`}>
      <div className={`flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-700 bg-gradient-to-r ${agentColor}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{agentName}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400" />
              <span className="text-xs text-white/80">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors" title="Clear chat">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setFullScreen(!fullScreen)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors" title={fullScreen ? 'Minimize' : 'Full screen'}>
            {fullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-brand-100 dark:bg-brand-950'
                  : `bg-gradient-to-br ${agentColor}`
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-brand-600 dark:text-brand-400" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-md'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-tl-md'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-surface-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${agentColor} flex items-center justify-center shrink-0`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-surface-100 dark:bg-surface-800 rounded-tl-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                  <span className="text-sm text-surface-500">{agentName} is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${agentName}...`}
              rows={2}
              className="w-full px-4 py-3 pr-10 text-sm rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
            />
            <button className="absolute right-3 bottom-3 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-brand-600/30"
          >
            {isLoading ? <StopCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-surface-400 mt-2 text-center">
          Agent uses {agentName} configuration. Responses are AI-generated.
        </p>
      </div>
    </div>
  );
}
