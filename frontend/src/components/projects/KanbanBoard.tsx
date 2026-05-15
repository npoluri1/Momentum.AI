'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus, MoreHorizontal, Trash2, Clock, Calendar,
  AlertCircle, GripVertical, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/modal';
import { cn, formatDate, formatRelativeTime } from '@/lib/utils';
import type { Task, User } from '@/lib/types';

export type ColumnStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface KanbanColumn {
  id: ColumnStatus;
  title: string;
  color: string;
  tasks: Task[];
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onTaskMove: (taskId: string, fromColumn: ColumnStatus, toColumn: ColumnStatus, newIndex: number) => void;
  onTaskReorder: (columnId: ColumnStatus, tasks: Task[]) => void;
  onAddColumn?: (title: string) => void;
  onDeleteColumn?: (columnId: ColumnStatus) => void;
  onAddTask?: (columnId: ColumnStatus) => void;
  onTaskClick?: (task: Task) => void;
  onTaskUpdate?: (task: Task) => void;
  loading?: boolean;
  className?: string;
}

const defaultColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: 'bg-surface-400', tasks: [] },
  { id: 'in_progress', title: 'In Progress', color: 'bg-brand-500', tasks: [] },
  { id: 'review', title: 'Review', color: 'bg-warning-500', tasks: [] },
  { id: 'done', title: 'Done', color: 'bg-success-500', tasks: [] },
];

const statusColors: Record<ColumnStatus, string> = {
  todo: 'bg-surface-400',
  in_progress: 'bg-brand-500',
  review: 'bg-warning-500',
  done: 'bg-success-500',
};

const priorityColors: Record<string, 'danger' | 'warning' | 'primary' | 'default'> = {
  urgent: 'danger',
  high: 'warning',
  medium: 'primary',
  low: 'default',
};

function TaskCard({ task, onClick }: { task: Task; onClick?: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(task)}
      className={cn(
        'group bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-3 cursor-grab active:cursor-grabbing',
        'hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all',
        isDragging && 'shadow-lg ring-2 ring-brand-500/30',
        'space-y-2'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={priorityColors[task.priority]} size="sm">{task.priority}</Badge>
          {task.labels?.slice(0, 2).map((label) => (
            <Badge key={label} variant="default" size="sm">{label}</Badge>
          ))}
          {task.labels && task.labels.length > 2 && (
            <Badge variant="default" size="sm">+{task.labels.length - 2}</Badge>
          )}
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-all">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-sm font-medium leading-snug">{task.title}</p>

      <div className="flex items-center justify-between text-xs text-surface-400">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className={cn('flex items-center gap-1', overdue && 'text-danger-500')}>
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.timeEstimate && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.timeEstimate}h
            </span>
          )}
        </div>
        {task.assignee && (
          <Avatar name={task.assignee.name} src={task.assignee.avatar} size="xs" />
        )}
      </div>
    </div>
  );
}

function ColumnHeader({ column, taskCount, onAdd, onDelete }: {
  column: KanbanColumn;
  taskCount: number;
  onAdd?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        <div className={cn('w-2.5 h-2.5 rounded-full', statusColors[column.id])} />
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <span className="text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded-full">{taskCount}</span>
      </div>
      <div className="flex items-center gap-1">
        {onAdd && (
          <button onClick={onAdd} className="p-1 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="p-1 rounded text-surface-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  columns: externalColumns,
  onTaskMove,
  onTaskReorder,
  onAddColumn,
  onDeleteColumn,
  onAddTask,
  onTaskClick,
  onTaskUpdate,
  loading = false,
  className,
}: KanbanBoardProps) {
  const [internalColumns, setInternalColumns] = useState<KanbanColumn[]>(defaultColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnStatus | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const columns = externalColumns?.length ? externalColumns : internalColumns;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const allTaskIds = useMemo(
    () => columns.flatMap((col) => col.tasks.map((t) => t.id)),
    [columns]
  );

  const findColumnByTaskId = useCallback(
    (taskId: string): ColumnStatus | null => {
      for (const col of columns) {
        if (col.tasks.some((t) => t.id === taskId)) return col.id;
      }
      return null;
    },
    [columns]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as Task;
    if (task) {
      setActiveTask(task);
      setActiveColumn(findColumnByTaskId(task.id));
    }
  }, [findColumnByTaskId]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromCol = findColumnByTaskId(activeId);
    let toCol: ColumnStatus | null = null;

    if (columns.some((c) => c.id === overId)) {
      toCol = overId as ColumnStatus;
    } else {
      toCol = findColumnByTaskId(overId);
    }

    if (!fromCol || !toCol || fromCol === toCol) return;

    const fromIndex = columns.findIndex((c) => c.id === fromCol);
    const toIndex = columns.findIndex((c) => c.id === toCol);
    if (fromIndex === -1 || toIndex === -1) return;

    const newColumns = columns.map((col) => ({ ...col, tasks: [...col.tasks] }));
    const taskIndex = newColumns[fromIndex].tasks.findIndex((t) => t.id === activeId);
    if (taskIndex === -1) return;
    const [movedTask] = newColumns[fromIndex].tasks.splice(taskIndex, 1);
    movedTask.status = toCol;

    const overTaskIndex = newColumns[toIndex].tasks.findIndex((t) => t.id === overId);
    if (overTaskIndex === -1) {
      newColumns[toIndex].tasks.push(movedTask);
    } else {
      newColumns[toIndex].tasks.splice(overTaskIndex, 0, movedTask);
    }

    if (!externalColumns?.length) {
      setInternalColumns(newColumns);
    }
  }, [columns, findColumnByTaskId, externalColumns]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const fromCol = findColumnByTaskId(activeId);
    let toCol: ColumnStatus | null = null;

    if (columns.some((c) => c.id === overId)) {
      toCol = overId as ColumnStatus;
    } else {
      toCol = findColumnByTaskId(overId);
    }

    if (!fromCol || !toCol) return;

    const fromIdx = columns.findIndex((c) => c.id === fromCol);
    const toIdx = columns.findIndex((c) => c.id === toCol);

    if (fromIdx === -1 || toIdx === -1) return;

    if (fromCol === toCol) {
      const tasks = [...columns[fromIdx].tasks];
      const oldIndex = tasks.findIndex((t) => t.id === activeId);
      const newIndex = tasks.findIndex((t) => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(tasks, oldIndex, newIndex);
      onTaskReorder?.(fromCol, reordered);
      if (!externalColumns?.length) {
        setInternalColumns((prev) =>
          prev.map((col) => (col.id === fromCol ? { ...col, tasks: reordered } : col))
        );
      }
    } else {
      onTaskMove(activeId, fromCol, toCol, columns[toIdx].tasks.length);
    }
  }, [columns, findColumnByTaskId, onTaskMove, onTaskReorder, externalColumns]);

  if (loading) {
    return (
      <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-72 shrink-0 space-y-3">
            <div className="h-8 w-24 bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-24 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ minHeight: '400px' }}>
          {columns.map((column) => (
            <div key={column.id} className="w-72 shrink-0 flex flex-col">
              <ColumnHeader
                column={column}
                taskCount={column.tasks.length}
                onAdd={() => onAddTask?.(column.id)}
                onDelete={column.id !== 'todo' && column.id !== 'done' ? () => onDeleteColumn?.(column.id) : undefined}
              />

              <SortableContext items={column.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 space-y-2 min-h-[100px] rounded-xl bg-surface-50/50 dark:bg-surface-900/30 p-2 border-2 border-dashed border-transparent transition-colors">
                  {column.tasks.length === 0 ? (
                    <div className="flex items-center justify-center h-24 text-xs text-surface-400">
                      <div className="text-center">
                        <p>No tasks</p>
                        <button onClick={() => onAddTask?.(column.id)} className="text-brand-500 hover:text-brand-600 mt-1">Add one</button>
                      </div>
                    </div>
                  ) : (
                    column.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          ))}

          {onAddColumn && (
            <div className="w-72 shrink-0">
              <button
                onClick={() => onAddColumn('New Column')}
                className="w-full h-32 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 flex items-center justify-center gap-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:border-surface-400 dark:hover:border-surface-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Column</span>
              </button>
            </div>
          )}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-72 bg-white dark:bg-surface-800 rounded-xl border-2 border-brand-500 shadow-xl p-3 space-y-2 opacity-90">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant={priorityColors[activeTask.priority]} size="sm">{activeTask.priority}</Badge>
              </div>
              <p className="text-sm font-medium">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal open={!!detailTask} onClose={() => setDetailTask(null)} title={detailTask?.title} size="lg">
        {detailTask && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={priorityColors[detailTask.priority]}>{detailTask.priority}</Badge>
              <Badge variant="default">{detailTask.status.replace('_', ' ')}</Badge>
            </div>
            <p className="text-sm text-surface-500">{detailTask.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {detailTask.assignee && (
                <div><span className="text-surface-400">Assignee:</span> <span className="font-medium">{detailTask.assignee.name}</span></div>
              )}
              {detailTask.dueDate && (
                <div><span className="text-surface-400">Due:</span> <span className="font-medium">{formatDate(detailTask.dueDate)}</span></div>
              )}
              {detailTask.timeEstimate && (
                <div><span className="text-surface-400">Estimate:</span> <span className="font-medium">{detailTask.timeEstimate}h</span></div>
              )}
              {detailTask.timeSpent && (
                <div><span className="text-surface-400">Spent:</span> <span className="font-medium">{detailTask.timeSpent}h</span></div>
              )}
            </div>
            {detailTask.labels && detailTask.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {detailTask.labels.map((label) => <Badge key={label} variant="default" size="sm">{label}</Badge>)}
              </div>
            )}
            {detailTask.subtasks && detailTask.subtasks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Subtasks ({detailTask.subtasks.filter((s) => s.completed).length}/{detailTask.subtasks.length})</h4>
                <div className="space-y-1.5">
                  {detailTask.subtasks.map((sub) => (
                    <label key={sub.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={sub.completed} readOnly className="rounded border-surface-300 text-brand-500 focus:ring-brand-500" />
                      <span className={sub.completed ? 'line-through text-surface-400' : ''}>{sub.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
