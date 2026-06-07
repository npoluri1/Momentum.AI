'use client';

import { useState, useRef, useEffect } from 'react';
import { cn, formatRelativeTime, getInitials } from '@/lib/utils';
import {
  MessageSquare, Send, AtSign, Paperclip, X,
  Edit2, Trash2, MoreHorizontal, Check, Smile,
} from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: { id: string; name: string; avatar?: string };
  mentions: string[];
  attachments?: { name: string; url: string }[];
  editedAt?: string;
  createdAt: string;
}

interface CommentSectionProps {
  resourceType: 'task' | 'project' | 'deal' | 'agent_session';
  resourceId: string;
  comments: Comment[];
  currentUserId: string;
  onAddComment: (content: string, mentions: string[]) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string) => Promise<void>;
  className?: string;
}

const MENTION_USERS = [
  { id: 'u1', name: 'Sarah Chen' },
  { id: 'u2', name: 'Alex Rivera' },
  { id: 'u3', name: 'John Doe' },
  { id: 'u4', name: 'Maria Santos' },
  { id: 'u5', name: 'David Kim' },
  { id: 'u6', name: 'Priya Sharma' },
];

export default function CommentSection({
  resourceType,
  resourceId,
  comments: initialComments,
  currentUserId,
  onAddComment,
  onDeleteComment,
  onEditComment,
  className,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mentionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Handle @mention detection
  const handleCommentChange = (value: string) => {
    setNewComment(value);
    const cursorPos = inputRef.current?.selectionStart || 0;
    const textBefore = value.slice(0, cursorPos);
    const atMatch = textBefore.match(/@(\w*)$/);
    if (atMatch) {
      setShowMentions(true);
      setMentionSearch(atMatch[1].toLowerCase());
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: { id: string; name: string }) => {
    const cursorPos = inputRef.current?.selectionStart || 0;
    const textBefore = newComment.slice(0, cursorPos);
    const textAfter = newComment.slice(cursorPos);
    const atIndex = textBefore.lastIndexOf('@');
    const newText = textBefore.slice(0, atIndex) + `@${user.name} ` + textAfter;
    setNewComment(newText);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  // Extract mentioned user IDs from content
  const extractMentions = (content: string): string[] => {
    const mentions: string[] = [];
    const regex = /@(\w+\s?\w*)/g;
    let match: RegExpExecArray | null = regex.exec(content);
    while (match !== null) {
      const current = match;
      const found = MENTION_USERS.find(u =>
        u.name.toLowerCase().includes(current[1].toLowerCase())
      );
      if (found) mentions.push(found.id);
      match = regex.exec(content);
    }
    return mentions;
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const mentions = extractMentions(newComment);
      await onAddComment(newComment.trim(), mentions);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setShowMentions(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim() || !onEditComment) return;
    try {
      await onEditComment(commentId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      console.error('Failed to edit comment:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!onDeleteComment) return;
    try {
      await onDeleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const filteredMentions = MENTION_USERS.filter(u =>
    u.name.toLowerCase().includes(mentionSearch)
  );

  // Close mentions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mentionRef.current && !mentionRef.current.contains(e.target as Node)) {
        setShowMentions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2.5 mb-1">
        <MessageSquare className="w-4 h-4 text-brand-500" />
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
          Comments
        </h3>
        <span className="text-xs text-surface-400 dark:text-surface-500 font-medium">
          {comments.length}
        </span>
      </div>

      {/* Comment List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
            <p className="text-xs text-surface-400 dark:text-surface-500">
              No comments yet. Start the conversation.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isOwn = comment.author.id === currentUserId;
            const isEditing = editingId === comment.id;

            return (
              <div
                key={comment.id}
                className={cn(
                  'group relative flex gap-3 p-3 rounded-xl transition-all',
                  'hover:bg-surface-50/50 dark:hover:bg-white/[0.03]'
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0 mt-0.5">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {getInitials(comment.author.name)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-surface-900 dark:text-white">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-surface-400 dark:text-surface-500">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                    {comment.editedAt && (
                      <span className="text-[10px] text-surface-400 dark:text-surface-500 italic">
                        edited
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full text-sm bg-surface-100/80 dark:bg-white/[0.06] rounded-xl p-3 border border-surface-200/50 dark:border-white/[0.06] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none min-h-[60px]"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(comment.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditContent(''); }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
                      {comment.content.split(/(@\w+\s?\w*)/g).map((part, i) => {
                        if (part.startsWith('@')) {
                          const matched = MENTION_USERS.find(u =>
                            u.name.toLowerCase() === part.slice(1).toLowerCase().trim()
                          );
                          return matched ? (
                            <span key={i} className="text-brand-500 dark:text-brand-400 font-medium bg-brand-500/10 px-1 rounded">
                              {part.trim()}
                            </span>
                          ) : (
                            <span key={i}>{part}</span>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </p>
                  )}

                  {/* Attachments */}
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {comment.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-surface-100/50 dark:bg-white/[0.04] text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 border border-surface-200/30 dark:border-white/[0.04] transition-all"
                        >
                          <Paperclip className="w-3 h-3" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Metadata row */}
                  <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isOwn && onEditComment && (
                      <button
                        onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                        className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    )}
                    {isOwn && onDeleteComment && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-surface-400 hover:text-danger-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    )}
                    <button className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors flex items-center gap-1">
                      <Smile className="w-3 h-3" /> React
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comment Input */}
      <div className="relative">
        <div className={cn(
          'flex items-end gap-2 p-2 rounded-2xl transition-all',
          'bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent',
          'focus-within:border-brand-500/30 focus-within:ring-2 focus-within:ring-brand-500/10'
        )}>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newComment}
              onChange={(e) => handleCommentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Add a comment... (use @ to mention)`}
              rows={1}
              className="w-full bg-transparent text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none resize-none py-1.5 px-1 min-h-[32px] max-h-32"
            />

            {/* Mentions Dropdown */}
            {showMentions && (
              <div
                ref={mentionRef}
                className="absolute bottom-full left-0 mb-1 w-60 rounded-xl overflow-hidden border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-surface-800 shadow-xl shadow-lg animate-fade-in"
              >
                <div className="px-3 py-2 text-[10px] font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wide border-b border-surface-100 dark:border-white/[0.04]">
                  Team Members
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {filteredMentions.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-surface-400">No members found</p>
                  ) : (
                    filteredMentions.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => insertMention(user)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-colors"
                      >
                        <AtSign className="w-3.5 h-3.5 text-brand-500" />
                        {user.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.06] transition-all"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              className={cn(
                'p-1.5 rounded-xl transition-all',
                newComment.trim() && !isSubmitting
                  ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20'
                  : 'text-surface-400 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-surface-400 dark:text-surface-500 mt-1.5 pl-1">
          Press <kbd className="px-1 py-0.5 rounded bg-surface-200/50 dark:bg-white/[0.06] text-[9px] font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-surface-200/50 dark:bg-white/[0.06] text-[9px] font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
