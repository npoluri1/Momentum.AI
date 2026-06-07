'use client';

import { useState, useRef, useEffect } from 'react';
import { cn, formatRelativeTime, getInitials } from '@/lib/utils';
import {
  MessageSquare, Send, Smile, Paperclip, MoreHorizontal,
  Check, CheckCheck, X, Edit2, Trash2, Reply,
  Image, FileText, Link as LinkIcon, ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: { id: string; name: string; avatar?: string };
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  replyTo?: { id: string; content: string; sender: string };
  reactions?: Record<string, string[]>;
  read: boolean;
}

interface TeamChatProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (content: string, replyToId?: string) => Promise<void>;
  className?: string;
  title?: string;
  subtitle?: string;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😄', '🎉', '👀', '🚀'];

export default function TeamChat({
  messages: initialMessages,
  currentUserId,
  onSendMessage,
  className,
  title = 'Team Chat',
  subtitle = 'Real-time collaboration',
}: TeamChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSendMessage(newMessage.trim(), replyTo?.id);
      setNewMessage('');
      setReplyTo(null);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      const reactions = { ...msg.reactions };
      if (!reactions[emoji]) reactions[emoji] = [];
      const idx = reactions[emoji].indexOf(currentUserId);
      if (idx > -1) {
        reactions[emoji] = reactions[emoji].filter(id => id !== currentUserId);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        reactions[emoji] = [...reactions[emoji], currentUserId];
      }
      return { ...msg, reactions: Object.keys(reactions).length > 0 ? reactions : undefined };
    }));
    setShowReactions(null);
  };

  const isOwn = (senderId: string) => senderId === currentUserId;

  // Sample messages
  const displayMessages = messages.length > 0 ? messages : sampleMessages;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200/50 dark:border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shadow-sm">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{title}</h3>
            <p className="text-[10px] text-surface-400 dark:text-surface-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
          <span className="text-xs text-surface-400">8 online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayMessages.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-8 h-8 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
            <p className="text-xs text-surface-400 dark:text-surface-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          displayMessages.map((msg) => {
            const own = isOwn(msg.sender.id);

            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100/50 dark:bg-white/[0.04]">
                    <span className="text-[10px] text-surface-400 dark:text-surface-500">{msg.content}</span>
                    <span className="text-[10px] text-surface-400">{formatRelativeTime(msg.timestamp)}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={cn(
                  'group flex gap-3',
                  own ? 'flex-row-reverse' : ''
                )}
              >
                {/* Avatar */}
                <div className="shrink-0 mt-0.5">
                  {msg.sender.avatar ? (
                    <img src={msg.sender.avatar} alt={msg.sender.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                      {getInitials(msg.sender.name)}
                    </div>
                  )}
                </div>

                {/* Message bubble */}
                <div className={cn('max-w-[75%] min-w-0', own && 'items-end')}>
                  {/* Sender name */}
                  {!own && (
                    <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400 mb-1 ml-1">
                      {msg.sender.name}
                    </p>
                  )}

                  {/* Reply reference */}
                  {msg.replyTo && (
                    <div className={cn(
                      'flex items-center gap-2 px-3 py-1.5 mb-1 rounded-lg border-l-2',
                      own
                        ? 'bg-brand-600/30 border-brand-400'
                        : 'bg-surface-100/50 dark:bg-white/[0.04] border-surface-300 dark:border-surface-600'
                    )}>
                      <Reply className="w-3 h-3 text-surface-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-surface-500 dark:text-surface-400">
                          {msg.replyTo.sender}
                        </p>
                        <p className="text-[10px] text-surface-400 dark:text-surface-500 truncate">
                          {msg.replyTo.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Message content */}
                  <div className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    own
                      ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20 rounded-br-md'
                      : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-700 dark:text-surface-300 border border-surface-200/30 dark:border-white/[0.04] rounded-bl-md'
                  )}>
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>

                  {/* Reactions */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={cn(
                      'flex items-center gap-1 mt-1',
                      own && 'justify-end'
                    )}>
                      {Object.entries(msg.reactions).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all',
                            users.includes(currentUserId)
                              ? 'bg-brand-500/10 border-brand-500/30 text-brand-500'
                              : 'bg-surface-100/50 dark:bg-white/[0.04] border-surface-200/50 dark:border-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/[0.08]'
                          )}
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px]">{users.length}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions row */}
                  <div className={cn(
                    'flex items-center gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity',
                    own && 'justify-end'
                  )}>
                    <span className="text-[10px] text-surface-400">
                      {formatRelativeTime(msg.timestamp)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setReplyTo(msg)}
                        className="p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                      >
                        <Reply className="w-3 h-3" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                          className="p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                        >
                          <Smile className="w-3 h-3" />
                        </button>
                        {showReactions === msg.id && (
                          <div className={cn(
                            'absolute bottom-full mb-1 flex items-center gap-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-white/[0.06] rounded-xl px-2 py-1.5 shadow-xl',
                            own ? 'right-0' : 'left-0'
                          )}>
                            {EMOJI_REACTIONS.map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(msg.id, emoji)}
                                className="hover:scale-125 transition-transform text-sm"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {own && (
                      <div className="flex items-center">
                        {msg.read ? (
                          <CheckCheck className="w-3 h-3 text-brand-500" />
                        ) : (
                          <Check className="w-3 h-3 text-surface-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-50/50 dark:bg-white/[0.02] border-t border-surface-200/50 dark:border-white/[0.06]">
          <Reply className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-brand-500">
              Replying to {replyTo.sender.name}
            </p>
            <p className="text-[11px] text-surface-400 truncate">{replyTo.content}</p>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="p-1 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-surface-200/50 dark:border-white/[0.06]">
        <div className={cn(
          'flex items-end gap-2 p-2 rounded-2xl transition-all',
          'bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent',
          'focus-within:border-brand-500/30 focus-within:ring-2 focus-within:ring-brand-500/10'
        )}>
          <button className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.06] transition-all shrink-0">
            <Image className="w-4 h-4" />
          </button>
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none resize-none py-1.5 max-h-32"
          />
          {newMessage.trim() ? (
            <button
              onClick={handleSend}
              disabled={isSubmitting}
              className="p-1.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.06] transition-all shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sample messages for preview
const sampleMessages: ChatMessage[] = [
  {
    id: 'm1',
    sender: { id: 'u1', name: 'Sarah Chen' },
    content: 'Hey team! Just finished the API integration for the CRM sync. Ready for review.',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    type: 'text',
    reactions: { '🚀': ['u2', 'u3'], '👍': ['u4'] },
    read: true,
  },
  {
    id: 'm2',
    sender: { id: 'u2', name: 'Alex Rivera' },
    content: 'Great work Sarah! I\'ll take a look at it this afternoon. Can you share the docs link?',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    type: 'text',
    read: true,
  },
  {
    id: 'm3',
    sender: { id: 'u1', name: 'Sarah Chen' },
    content: 'Sure! Here\'s the Notion doc with the full spec: notion.so/crm-api-v2',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    type: 'text',
    replyTo: { id: 'm2', content: 'I\'ll take a look at it this afternoon', sender: 'Alex Rivera' },
    reactions: { '👍': ['u2'] },
    read: true,
  },
  {
    id: 'm4',
    sender: { id: 'u3', name: 'John Doe' },
    content: 'Just a heads up — the deployment window for this sprint closes on Friday. Let\'s make sure we get the review in before then.',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    type: 'text',
    reactions: { '👀': ['u1', 'u2'] },
    read: false,
  },
  {
    id: 'm5',
    sender: { id: 'u4', name: 'Maria Santos' },
    content: 'Good point John. I\'ll prioritize the review for tomorrow morning. Also, the staging environment is ready whenever we need it.',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    type: 'text',
    read: false,
  },
  {
    id: 'm6',
    sender: { id: 'u5', name: 'System' },
    content: 'Sarah Chen deployed version 2.1.0 to staging',
    timestamp: new Date(Date.now() - 15000).toISOString(),
    type: 'system',
    read: false,
  },
];
