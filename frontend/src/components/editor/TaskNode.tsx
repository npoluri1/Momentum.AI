"use client";

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, ChevronRight, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  done?: boolean;
  children?: Task[];
}

interface Props {
  task: Task;
  depth?: number;
  onUpdate?: (id: string, title: string) => void;
  onAddChild?: (parentId: string) => void;
  onDelete?: (id: string) => void;
}

export default function TaskNode({ task, depth = 0, onUpdate, onAddChild, onDelete }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [done, setDone] = useState(!!task.done);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (title.trim() && onUpdate) {
      onUpdate(task.id, title.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditing(false);
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Outdent (move up level) - future feature
      } else {
        // Indent (create as child) - future feature
      }
    }
  };

  return (
    <div className="pl-2" style={{ paddingLeft: depth * 12 }}>
      <div className="flex items-center gap-2 py-2 group">
        <button
          onClick={() => setDone(!done)}
          className="w-5 h-5 rounded-sm flex items-center justify-center border border-surface-200 dark:border-surface-800 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-pressed={done}
          title={done ? 'Mark incomplete' : 'Mark complete'}
        >
          {done ? <Check className="w-3 h-3 text-brand-500" /> : null}
        </button>

        <div className="flex-1 text-sm">
          <div className="flex items-center gap-2">
            {task.children && task.children.length > 0 ? (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-6" />
            )}

            {isEditing ? (
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 rounded bg-white dark:bg-surface-800 border border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className={`flex-1 px-2 py-1 rounded cursor-text hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors ${
                  done ? 'line-through text-surface-400' : ''
                }`}
              >
                {task.title}
              </div>
            )}
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={() => onAddChild?.(task.id)}
            className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400"
            title="Add subtask"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {showMenu && (
          <div className="absolute right-0 mt-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete?.(task.id);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-danger-500 hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <Trash2 className="w-4 h-4 inline mr-2" /> Delete
            </button>
          </div>
        )}
      </div>

      {expanded && task.children && task.children.length > 0 && (
        <div className="ml-4 border-l border-surface-100 dark:border-surface-800 pl-3">
          {task.children.map((t) => (
            <TaskNode key={t.id} task={t} depth={depth + 1} onUpdate={onUpdate} onAddChild={onAddChild} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

