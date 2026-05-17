'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Card, CardContent, CardHeader, Button, Badge, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Clock, User, Calendar, MessageSquare, Paperclip,
  CheckCircle2, Circle, Plus, X, Send,
} from 'lucide-react';
import type { Task, Comment, SubTask } from '@/lib/types';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!params.taskId) return;
    api.getTask(params.taskId as string)
      .then(setTask)
      .catch(() => setError('Task not found'))
      .finally(() => setLoading(false));

    api.getComments(params.taskId as string)
      .then(setComments)
      .catch(() => {});
  }, [params.taskId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    socket.emit('join:task', params.taskId);

    socket.on('comment:new', (comment: Comment) => {
      setComments((prev) => [...prev, comment]);
    });
    socket.on('task:updated', (updated: Task) => {
      setTask(updated);
    });

    return () => {
      socket.emit('leave:task', params.taskId);
      socket.off('comment:new');
      socket.off('task:updated');
    };
  }, [params.taskId]);

  async function updateTask(data: Partial<Task>) {
    if (!task) return;
    try {
      const updated = await api.updateTask(task.id, data);
      setTask(updated);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentInput.trim() || !task || sending) return;
    setSending(true);
    try {
      const comment = await api.addComment(task.id, commentInput.trim());
      setComments((prev) => [...prev, comment]);
      setCommentInput('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSending(false);
    }
  }

  function toggleSubtask(subtaskId: string) {
    if (!task) return;
    const updated = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask({ subtasks: updated });
  }

  function addSubtask() {
    if (!subtaskTitle.trim() || !task) return;
    const newSub: SubTask = {
      id: Date.now().toString(),
      title: subtaskTitle.trim(),
      completed: false,
    };
    updateTask({ subtasks: [...task.subtasks, newSub] });
    setSubtaskTitle('');
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
    return <div className="space-y-4">
      <div className="h-8 w-96 bg-gray-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-96 bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-96 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    </div>;
  }

  if (!task) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{task.title}</h1>
            <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'primary' : 'default'}>
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <select
              value={task.status}
              onChange={(e) => updateTask({ status: e.target.value as Task['status'] })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Description</h3>
              <p className="text-sm text-gray-400 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
              </h3>
              <div className="space-y-1 mb-3">
                {task.subtasks.length === 0 && (
                  <p className="text-sm text-gray-600 py-2">No subtasks</p>
                )}
                {task.subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer" onClick={() => toggleSubtask(st.id)}>
                    {st.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    )}
                    <span className={cn('text-sm', st.completed ? 'text-gray-600 line-through' : 'text-gray-300')}>{st.title}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                  placeholder="Add subtask..."
                  className="text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                />
                <Button size="sm" onClick={addSubtask} disabled={!subtaskTitle.trim()}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({comments.length})
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {comment.author.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-200">{comment.author.name}</span>
                          <span className="text-xs text-gray-600">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={addComment} className="flex gap-2 p-4 border-t border-gray-700/50">
                <Input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write a comment..."
                  className="text-sm"
                />
                <Button type="submit" size="sm" loading={sending} disabled={!commentInput.trim()}>
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Assignee</p>
                  <p className="text-gray-300">{task.assignee?.name || 'Unassigned'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="text-gray-300">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Time Tracking</p>
                  <p className="text-gray-300">{task.timeSpent || 0}m / {task.timeEstimate || 0}m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments ({task.attachments?.length || 0})
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              {task.attachments?.length > 0 ? (
                <div className="space-y-2">
                  {task.attachments.map((att) => (
                    <div key={att.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 text-sm">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-300 flex-1 truncate">{att.name}</span>
                      <span className="text-xs text-gray-600">{(att.size / 1024).toFixed(1)}KB</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">No attachments</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              {task.labels?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.labels.map((label) => (
                    <Badge key={label} variant="primary">{label}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
