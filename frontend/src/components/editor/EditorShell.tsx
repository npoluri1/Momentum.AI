"use client";

import { useState, useEffect } from 'react';
import { List, Grid, Calendar, Plus } from 'lucide-react';
import TaskNode from './TaskNode';
import BoardView from '@/components/projects/BoardView';
import ListView from '@/components/projects/ListView';
import CalendarView from '@/components/projects/CalendarView';
import { getSocket } from '@/lib/socket';

interface Props {
  projectId: string;
}

const sampleTasks = [
  {
    id: 't1',
    title: 'Project kickoff meeting',
    done: false,
    children: [
      { id: 't1-1', title: 'Prepare agenda', done: true },
      { id: 't1-2', title: 'Invite stakeholders', done: false },
    ],
  },
  { id: 't2', title: 'Design hero section', done: false },
  { id: 't3', title: 'Implement authentication', done: false },
];

export default function EditorShell({ projectId }: Props) {
  const [view, setView] = useState<'list' | 'board' | 'calendar'>('list');
  const [tasks, setTasks] = useState(sampleTasks as any[]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const created = { id: `t_${Date.now()}`, title: newTask.trim(), done: false, children: [] };
    setTasks((t) => [...t, created]);
    try {
      const s = getSocket();
      if (!s.connected) s.connect();
      s.emit('task:create', { projectId, task: created });
    } catch (err) {
      // no-op
    }
    setNewTask('');
  };

  const updateTask = (id: string, title: string) => {
    setTasks((prev) => updateTaskRecursive(prev, id, { title }));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => deleteTaskRecursive(prev, id));
  };

  const addChildTask = (parentId: string) => {
    const newChildId = `t_${Date.now()}`;
    setTasks((prev) => addChildRecursive(prev, parentId, { id: newChildId, title: 'New subtask', done: false, children: [] }));
  };

  const updateTaskRecursive = (tasks: any[], id: string, updates: any): any[] => {
    return tasks.map((t) => {
      if (t.id === id) return { ...t, ...updates };
      if (t.children) return { ...t, children: updateTaskRecursive(t.children, id, updates) };
      return t;
    });
  };

  const deleteTaskRecursive = (tasks: any[], id: string): any[] => {
    return tasks.filter((t) => t.id !== id).map((t) => ({
      ...t,
      children: t.children ? deleteTaskRecursive(t.children, id) : [],
    }));
  };

  const addChildRecursive = (tasks: any[], parentId: string, child: any): any[] => {
    return tasks.map((t) => {
      if (t.id === parentId) return { ...t, children: [...(t.children || []), child] };
      if (t.children) return { ...t, children: addChildRecursive(t.children, parentId, child) };
      return t;
    });
  };

  const columns = [
    { id: 'todo', title: 'To do', tasks: tasks.filter((t) => !t.done) },
    { id: 'in_progress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: tasks.filter((t) => t.done) },
  ];

  const handleMove = (taskId: string, toColumnId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: toColumnId === 'done' } : t)));
  };

  useEffect(() => {
    const s = getSocket();
    if (!s.connected) s.connect();
    s.emit('join:project', projectId);
    s.on('task:created', (payload: any) => {
      if (payload?.task) setTasks((prev) => [...prev, payload.task]);
    });
    s.on('task:updated', (payload: any) => {
      if (payload?.task) setTasks((prev) => prev.map((t) => (t.id === payload.task.id ? payload.task : t)));
    });

    return () => {
      s.emit('leave:project', projectId);
      s.off('task:created');
      s.off('task:updated');
    };
  }, [projectId]);

  return (
    <div className="flex-1 flex h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex-1 flex flex-col border-r border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Project: {projectId}</h2>
            <div className="flex items-center gap-1 text-xs text-surface-500">
              <span>•</span>
              <span>Private</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-surface-100 dark:bg-surface-800' : ''}`} title="List view">
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setView('board')} className={`p-2 rounded ${view === 'board' ? 'bg-surface-100 dark:bg-surface-800' : ''}`} title="Board view">
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('calendar')} className={`p-2 rounded ${view === 'calendar' ? 'bg-surface-100 dark:bg-surface-800' : ''}`} title="Calendar view">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-auto">
          <div className="flex items-center gap-2 mb-4">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Quick add task..."
              className="flex-1 px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <button onClick={addTask} className="momentum-button flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {view === 'list' && (
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskNode key={task.id} task={task} onUpdate={updateTask} onAddChild={addChildTask} onDelete={deleteTask} />
              ))}
            </div>
          )}

          {view === 'board' && <BoardView columns={columns} onMove={handleMove} />}

          {view === 'calendar' && <CalendarView />}
        </div>
      </div>

      <aside className="w-[var(--eve-panel-width)] p-4">
        <div className="rounded-xl border border-surface-200 dark:border-surface-800 p-3">
          <h3 className="text-sm font-semibold">Details</h3>
          <p className="text-xs text-surface-500 mt-2">Project activity, members, attachments and automation will appear here.</p>
        </div>
      </aside>
    </div>
  );
}


