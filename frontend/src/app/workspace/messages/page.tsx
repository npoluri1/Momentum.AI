'use client';

import { useState } from 'react';
import {
  Search, Send, Paperclip, MoreHorizontal,
  Phone, Video, CheckCheck, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const conversations = [
  { id: 1, name: 'Sarah Chen', role: 'Lead Developer', avatar: 'SC', lastMsg: 'The API integration is complete and ready for review.', time: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Mike Ross', role: 'Sales Director', avatar: 'MR', lastMsg: 'Great news! The enterprise deal closed yesterday.', time: '15m ago', unread: 0, online: true },
  { id: 3, name: 'Alice Wu', role: 'Product Designer', avatar: 'AW', lastMsg: 'Here are the new mockups for the dashboard redesign.', time: '1h ago', unread: 5, online: true },
  { id: 4, name: 'James Wilson', role: 'CTO', avatar: 'JW', lastMsg: 'Can we schedule a review for the Q4 roadmap?', time: '3h ago', unread: 1, online: false },
  { id: 5, name: 'Emma Liu', role: 'Marketing Lead', avatar: 'EL', lastMsg: 'The campaign analytics are looking great this quarter!', time: '5h ago', unread: 0, online: true },
  { id: 6, name: 'David Park', role: 'DevOps Engineer', avatar: 'DP', lastMsg: 'Deployment pipeline is green for the staging environment.', time: '1d ago', unread: 0, online: false },
  { id: 7, name: 'Lisa Brown', role: 'Product Manager', avatar: 'LB', lastMsg: 'Sprint retrospective notes are in the shared doc.', time: '1d ago', unread: 3, online: false },
  { id: 8, name: 'Tom Harris', role: 'UX Researcher', avatar: 'TH', lastMsg: 'User testing sessions are scheduled for next week.', time: '2d ago', unread: 0, online: true },
];

const messages = [
  { id: 1, from: 'them', text: 'Hey! The API integration is complete and ready for review.', time: '10:32 AM' },
  { id: 2, from: 'me', text: 'That\'s great news! Let me take a look at it right away.', time: '10:33 AM' },
  { id: 3, from: 'them', text: 'I\'ve also added the unit tests and documentation for the new endpoints.', time: '10:34 AM' },
  { id: 4, from: 'them', text: 'The test coverage is at 92% now.', time: '10:34 AM' },
  { id: 5, from: 'me', text: 'Excellent work! 92% is impressive. Let me review the PR and get back to you.', time: '10:36 AM' },
  { id: 6, from: 'them', text: 'Thanks! There are 2 new messages waiting for you below.', time: '10:38 AM' },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!messageText.trim()) return;
    setMessageText('');
  };

  return (
    <div className="flex h-full">
      {/* Conversation List - Apple style */}
      <div className="w-[380px] shrink-0 border-r border-surface-200/50 dark:border-white/[0.06] flex flex-col bg-white/50 dark:bg-[#0a0a0f]/50">
        <div className="p-4 border-b border-surface-200/50 dark:border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-surface-900 dark:text-white">Messages</h1>
            <button className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all">
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="apple-input w-full pl-10 py-2"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filtered.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all',
                selectedChat.id === chat.id
                  ? 'bg-surface-100/80 dark:bg-white/[0.06]'
                  : 'hover:bg-surface-50/50 dark:hover:bg-white/[0.03]'
              )}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center text-white text-xs font-bold">
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-memory-500 border-2 border-white dark:border-[#0a0a0f]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-surface-900 dark:text-white truncate">{chat.name}</span>
                  <span className="text-[11px] text-surface-400 shrink-0 ml-2">{chat.time}</span>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area - Apple style */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-surface-200/50 dark:border-white/[0.06] bg-white/50 dark:bg-[#0a0a0f]/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center text-white text-xs font-bold">
                {selectedChat.avatar}
              </div>
              {selectedChat.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-memory-500 border-2 border-white dark:border-[#0a0a0f]" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{selectedChat.name}</p>
              <p className="text-[11px] text-surface-400">{selectedChat.online ? 'Online' : 'Offline'} · {selectedChat.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start gap-3',
                msg.from === 'me' ? 'flex-row-reverse' : ''
              )}
            >
              {msg.from === 'them' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                  {selectedChat.avatar}
                </div>
              )}
              <div className={cn(
                'max-w-[70%] rounded-2xl px-4 py-2.5',
                msg.from === 'me'
                  ? 'bg-brand-500 text-white rounded-br-md'
                  : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-700 dark:text-surface-300 rounded-bl-md border border-surface-200/30 dark:border-white/[0.04]'
              )}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className={cn(
                  'flex items-center gap-1 mt-1',
                  msg.from === 'me' ? 'justify-end' : ''
                )}>
                  <span className="text-[10px] opacity-70">{msg.time}</span>
                  {msg.from === 'me' && (
                    <CheckCheck className="w-3 h-3 opacity-70" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input - Apple style */}
        <div className="px-4 py-3 border-t border-surface-200/50 dark:border-white/[0.06] bg-white/50 dark:bg-[#0a0a0f]/30">
          <div className="flex items-center gap-2 bg-surface-100/80 dark:bg-white/[0.06] rounded-2xl px-3 py-1.5 border border-surface-200/50 dark:border-transparent focus-within:border-brand-500/30 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all">
            <button className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${selectedChat.name}...`}
              className="flex-1 bg-transparent text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none py-1.5"
            />
            <button
              onClick={handleSend}
              disabled={!messageText.trim()}
              className="p-1.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
