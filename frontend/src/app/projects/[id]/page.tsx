'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Card, CardContent, CardHeader, Button, Badge, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Plus, Columns, List, GripVertical, X, Send,
  MessageSquare, Clock, Activity, BarChart3,
} from 'lucide-react';
import type { Project, Task } from '@/lib/types';
import toast from 'react-hot-toast';

const statusColumns = [
  { id: 'todo', label: 'To Do', color: 'border-t-gray-500' },
  { id: 'in_progress', label: 'In Progress', color: 'border-t-blue-500' },
  { id: 'review', label: 'Review', color: 'border-t-amber-500' },
  { id: 'done', label: 'Done', color: 'border-t-green-500' },
];

const priorityColors: Record<string, string> = {
  urgent: 'text-red-400',
  high: 'text-amber-400',
  medium: 'text-blue-400',
  low: 'text-gray-500',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string; time: Date }[]>([]);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      api.getProject(params.id as string),
      api.getTasks(params.id as string),
    ])
      .then(([proj, tsks]) => {
        setProject(proj);
        setTasks(tsks);
      })
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    socket.emit('join:project', params.id);
    socket.on('task:updated', (task: Task) => {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    });
    socket.on('task:created', (task: Task) => {
      setTasks((prev) => [...prev, task]);
    });
    socket.on('chat:message', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leave:project', params.id);
      socket.off('task:updated');
      socket.off('task:created');
      socket.off('chat:message');
    };
  }, [params.id]);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string, currentStatus: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('currentStatus', currentStatus);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const currentStatus = e.dataTransfer.getData('currentStatus');
    if (currentStatus === newStatus) return;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t)));
    try {
      await api.updateTask(taskId, { status: newStatus as Task['status'] });
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: currentStatus as Task['status'] } : t)));
      toast.error('Failed to update task');
    }
  }, []);

  function sendChatMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = { id: Date.now().toString(), user: 'You', text: chatInput.trim(), time: new Date() };
    setChatMessages((prev) => [...prev, msg]);
    getSocket().emit('chat:message', { projectId: params.id, ...msg });
    setChatInput('');
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
      <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-96 bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>;
  }

  if (!project) return null;

  const tasksByStatus = statusColumns.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant={project.status === 'active' ? 'success' : 'default'}>{project.status}</Badge>
            <span className="text-sm text-gray-500">{project.progress}% complete</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('kanban')}
            className={cn('p-2 rounded-lg transition-colors', view === 'kanban' ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-500 hover:text-gray-300')}
          ><Columns className="h-4 w-4" /></button>
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-500 hover:text-gray-300')}
          ><List className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {view === 'kanban' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statusColumns.map((column) => (
                <div
                  key={column.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={cn('rounded-xl bg-gray-900/50 border border-gray-800 border-t-2', column.color)}
                >
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-800">
                    <span className="text-sm font-medium text-gray-300">{column.label}</span>
                    <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                      {tasksByStatus[column.id]?.length || 0}
                    </span>
                  </div>
                  <div className="p-2 space-y-2 min-h-[200px]">
                    {tasksByStatus[column.id]?.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                        className="bg-gray-800 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-gray-750 border border-gray-700/50 group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={cn('text-xs font-medium', priorityColors[task.priority])}>
                            {task.priority}
                          </span>
                          <GripVertical className="h-3 w-3 text-gray-600 opacity-0 group-hover:opacity-100" />
                        </div>
                        <p className="text-sm text-gray-200 line-clamp-2">{task.title}</p>
                        {task.assignee && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700/50">
                            <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                              {task.assignee.name.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-500">{task.assignee.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <button className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-700/50 hover:border-gray-600 transition-colors">
                      <Plus className="h-3 w-3" /> Add Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase">
                      <th className="px-4 py-3 font-medium">Task</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Priority</th>
                      <th className="px-4 py-3 font-medium">Assignee</th>
                      <th className="px-4 py-3 font-medium">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">No tasks yet</td></tr>
                    ) : (
                      tasks.map((task) => (
                        <tr key={task.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-sm text-gray-200">{task.title}</td>
                          <td className="px-4 py-3"><Badge variant="info">{task.status.replace('_', ' ')}</Badge></td>
                          <td className="px-4 py-3"><Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'info' : 'default'}>{task.priority}</Badge></td>
                          <td className="px-4 py-3 text-sm text-gray-400">{task.assignee?.name || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><h3 className="text-sm font-medium text-gray-300 flex items-center gap-2"><Activity className="h-4 w-4" />Activity</h3></CardHeader>
            <CardContent className="p-3 space-y-2 max-h-64 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/50">
                  <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">U</div>
                  <div>
                    <p className="text-xs text-gray-400">Task was updated</p>
                    <p className="text-xs text-gray-600">2h ago</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-600 text-center py-2">No more activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="text-sm font-medium text-gray-300 flex items-center gap-2"><MessageSquare className="h-4 w-4" />Team Chat</h3></CardHeader>
            <CardContent className="p-0 flex flex-col h-72">
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs flex-shrink-0">{msg.user.charAt(0)}</div>
                    <div>
                      <p className="text-xs text-gray-300"><span className="font-medium">{msg.user}</span></p>
                      <p className="text-xs text-gray-400">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {chatMessages.length === 0 && <p className="text-xs text-gray-600 text-center py-8">No messages yet</p>}
              </div>
              <form onSubmit={sendChatMessage} className="flex gap-2 p-3 border-t border-gray-700/50">
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="text-xs" />
                <Button type="submit" size="sm"><Send className="h-3 w-3" /></Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="text-sm font-medium text-gray-300 flex items-center gap-2"><BarChart3 className="h-4 w-4" />Progress</h3></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Overall</span><span>{project.progress}%</span></div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${project.progress}%` }} /></div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between"><span>To Do</span><span>{tasksByStatus.todo?.length || 0}</span></div>
                <div className="flex justify-between"><span>In Progress</span><span>{tasksByStatus.in_progress?.length || 0}</span></div>
                <div className="flex justify-between"><span>Review</span><span>{tasksByStatus.review?.length || 0}</span></div>
                <div className="flex justify-between"><span>Done</span><span>{tasksByStatus.done?.length || 0}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
