"use client";

import { useState } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 cursor-grab active:cursor-grabbing flex items-center gap-2 transition-all ${isDragging ? 'opacity-50 scale-95' : ''}`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-4 h-4 text-surface-400 flex-shrink-0" />
      <div className="text-sm flex-1 truncate">{task.title}</div>
    </div>
  );
}

export default function BoardView({ columns: initialColumns, onMove }: { columns: Column[]; onMove?: (taskId: string, toColumnId: string) => void }) {
  const [columns, setColumns] = useState(initialColumns);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCol = columns.find((c) => c.tasks.some((t) => t.id === active.id));
    const overCol = columns.find((c) => c.id === over.id || c.tasks.some((t) => t.id === over.id));

    if (!activeCol || !overCol) return;

    const activeTask = activeCol.tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === activeCol.id) return { ...col, tasks: col.tasks.filter((t) => t.id !== active.id) };
        if (col.id === overCol.id) {
          const tasks = [...col.tasks];
          const overIdx = tasks.findIndex((t) => t.id === over.id);
          if (overIdx >= 0) tasks.splice(overIdx + 1, 0, activeTask);
          else tasks.push(activeTask);
          return { ...col, tasks };
        }
        return col;
      })
    );

    if (onMove) onMove(active.id as string, overCol.id);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.id} className="rounded-xl p-4 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 min-h-96">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-sm text-surface-900 dark:text-white">{col.title}</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">{col.tasks.length}</span>
            </div>
            <SortableContext items={col.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {col.tasks.length === 0 ? (
                  <div className="text-xs text-surface-400 text-center py-8">Drop tasks here</div>
                ) : (
                  col.tasks.map((task) => <DraggableTask key={task.id} task={task} />)
                )}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}

