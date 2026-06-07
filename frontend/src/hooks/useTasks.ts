import { useState, useCallback, useEffect } from 'react';
import { taskAPI } from '@/lib/taskAPI';
import { getSocket } from '@/lib/socket';

interface Task {
  id: string;
  title: string;
  done?: boolean;
  children?: Task[];
  parentId?: string;
  status?: string;
}

export function useTasks(projectId: string, initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from backend on mount
  useEffect(() => {
    const loadTasks = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        // Temporarily use local tasks, but ready for backend API
        // const data = await taskAPI.list(projectId);
        // if (data) setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [projectId]);

  // WebSocket listeners for real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    socket.emit('join:project', projectId);

    socket.on('task:created', (payload: any) => {
      if (payload?.task) {
        setTasks((prev) => [...prev, payload.task]);
      }
    });

    socket.on('task:updated', (payload: any) => {
      if (payload?.task) {
        setTasks((prev) => updateTaskRecursive(prev, payload.task.id, payload.task));
      }
    });

    socket.on('task:deleted', (payload: any) => {
      if (payload?.taskId) {
        setTasks((prev) => deleteTaskRecursive(prev, payload.taskId));
      }
    });

    return () => {
      socket.emit('leave:project', projectId);
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [projectId]);

  const addTask = useCallback(
    async (title: string, parentId?: string) => {
      const newTask: Task = {
        id: `t_${Date.now()}`,
        title,
        done: false,
        parentId,
        children: [],
      };

      // Optimistic update
      if (parentId) {
        setTasks((prev) => addChildRecursive(prev, parentId, newTask));
      } else {
        setTasks((prev) => [...prev, newTask]);
      }

      // Sync to backend (fire and forget for now)
      try {
        // await taskAPI.create(projectId, { title, parentId });
        const socket = getSocket();
        socket.emit('task:create', { projectId, task: newTask });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create task');
      }

      return newTask;
    },
    [projectId]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      // Optimistic update
      setTasks((prev) => updateTaskRecursive(prev, id, updates));

      // Sync to backend
      try {
        // await taskAPI.update(projectId, id, updates);
        const socket = getSocket();
        socket.emit('task:update', { projectId, taskId: id, updates });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task');
      }
    },
    [projectId]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      // Optimistic update
      setTasks((prev) => deleteTaskRecursive(prev, id));

      // Sync to backend
      try {
        // await taskAPI.delete(projectId, id);
        const socket = getSocket();
        socket.emit('task:delete', { projectId, taskId: id });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    },
    [projectId]
  );

  const moveTask = useCallback(
    async (id: string, toStatus: string) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: toStatus, done: toStatus === 'done' } : t)));

      try {
        // await taskAPI.update(projectId, id, { status: toStatus });
        const socket = getSocket();
        socket.emit('task:move', { projectId, taskId: id, toStatus });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to move task');
      }
    },
    [projectId]
  );

  return { tasks, loading, error, addTask, updateTask, deleteTask, moveTask };
}

// Helper functions
function updateTaskRecursive(tasks: Task[], id: string, updates: any): Task[] {
  return tasks.map((t) => {
    if (t.id === id) return { ...t, ...updates };
    if (t.children) return { ...t, children: updateTaskRecursive(t.children, id, updates) };
    return t;
  });
}

function deleteTaskRecursive(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id).map((t) => ({
    ...t,
    children: t.children ? deleteTaskRecursive(t.children, id) : [],
  }));
}

function addChildRecursive(tasks: Task[], parentId: string, child: Task): Task[] {
  return tasks.map((t) => {
    if (t.id === parentId) return { ...t, children: [...(t.children || []), child] };
    if (t.children) return { ...t, children: addChildRecursive(t.children, parentId, child) };
    return t;
  });
}

