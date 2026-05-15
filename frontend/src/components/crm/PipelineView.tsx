'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import {
  GripVertical, DollarSign, User, Target, Calendar,
  TrendingUp, MoreHorizontal, ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { CRMDeal } from '@/lib/types';

export type StageId = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface PipelineStage {
  id: StageId;
  title: string;
  color: string;
  deals: CRMDeal[];
}

export interface PipelineViewProps {
  stages: PipelineStage[];
  onDealMove: (dealId: string, fromStage: StageId, toStage: StageId) => void;
  onDealClick?: (deal: CRMDeal) => void;
  loading?: boolean;
  className?: string;
}

const stageDefaults: PipelineStage[] = [
  { id: 'lead', title: 'Lead', color: 'bg-surface-400', deals: [] },
  { id: 'qualified', title: 'Qualified', color: 'bg-brand-400', deals: [] },
  { id: 'proposal', title: 'Proposal', color: 'bg-brand-500', deals: [] },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-warning-500', deals: [] },
  { id: 'closed_won', title: 'Closed Won', color: 'bg-success-500', deals: [] },
  { id: 'closed_lost', title: 'Closed Lost', color: 'bg-danger-500', deals: [] },
];

const stageColors: Record<StageId, string> = {
  lead: 'bg-surface-400',
  qualified: 'bg-brand-400',
  proposal: 'bg-brand-500',
  negotiation: 'bg-warning-500',
  closed_won: 'bg-success-500',
  closed_lost: 'bg-danger-500',
};

const dealPriorityColors: Record<string, 'danger' | 'warning' | 'default'> = {
  high: 'danger',
  medium: 'warning',
  low: 'default',
};

function DealCard({ deal, onClick, isDragging }: { deal: CRMDeal; onClick?: (deal: CRMDeal) => void; isDragging?: boolean }) {
  const probColor = deal.stage === 'closed_won' ? 'text-success-500' :
    deal.stage === 'closed_lost' ? 'text-danger-500' :
    'text-brand-500';

  const probability = {
    lead: 10, qualified: 25, proposal: 50, negotiation: 75,
    closed_won: 100, closed_lost: 0,
  }[deal.stage];

  return (
    <div
      onClick={() => onClick?.(deal)}
      className={cn(
        'bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-3 cursor-grab active:cursor-grabbing space-y-2.5',
        'hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all',
        isDragging && 'shadow-lg ring-2 ring-brand-500/30 opacity-90'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-surface-300 cursor-grab" />
          <p className="text-sm font-medium">{deal.title}</p>
        </div>
        <button className="p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <DollarSign className="w-3.5 h-3.5 text-surface-400" />
        <span className="font-semibold">{formatCurrency(deal.value)}</span>
        <span className="text-surface-300 mx-1">|</span>
        <Target className="w-3.5 h-3.5 text-surface-400" />
        <span className={cn('text-xs font-medium', probColor)}>{probability}%</span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {deal.contact && (
            <span className="flex items-center gap-1 text-surface-400">
              <User className="w-3 h-3" />
              {deal.contact.name}
            </span>
          )}
          {deal.expectedCloseDate && (
            <span className="flex items-center gap-1 text-surface-400">
              <Calendar className="w-3 h-3" />
              {formatDate(deal.expectedCloseDate)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant={dealPriorityColors[deal.priority]} size="sm">{deal.priority}</Badge>
          {deal.assignedTo && (
            <Avatar name={deal.assignedTo.name} src={deal.assignedTo.avatar} size="xs" />
          )}
        </div>
      </div>
    </div>
  );
}

export function PipelineView({
  stages: externalStages,
  onDealMove,
  onDealClick,
  loading = false,
  className,
}: PipelineViewProps) {
  const [internalStages, setInternalStages] = useState<PipelineStage[]>(stageDefaults);
  const [activeDeal, setActiveDeal] = useState<CRMDeal | null>(null);

  const stages = externalStages?.length ? externalStages : internalStages;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const findStageByDealId = useCallback(
    (dealId: string): StageId | null => {
      for (const stage of stages) {
        if (stage.deals.some((d) => d.id === dealId)) return stage.id;
      }
      return null;
    },
    [stages]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const deal = event.active.data.current?.deal as CRMDeal;
    if (deal) setActiveDeal(deal);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const overId = over.id as string;

    const fromStage = findStageByDealId(dealId);
    let toStage: StageId | null = null;

    if (stages.some((s) => s.id === overId)) {
      toStage = overId as StageId;
    } else {
      toStage = findStageByDealId(overId);
    }

    if (!fromStage || !toStage || fromStage === toStage) return;
    onDealMove(dealId, fromStage, toStage);

    if (!externalStages?.length) {
      setInternalStages((prev) => {
        const newStages = prev.map((s) => ({ ...s, deals: [...s.deals] }));
        const fromIdx = newStages.findIndex((s) => s.id === fromStage);
        const toIdx = newStages.findIndex((s) => s.id === toStage);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const dealIdx = newStages[fromIdx].deals.findIndex((d) => d.id === dealId);
        if (dealIdx === -1) return prev;
        const [moved] = newStages[fromIdx].deals.splice(dealIdx, 1);
        moved.stage = toStage;
        newStages[toIdx].deals.push(moved);
        return newStages;
      });
    }
  }, [stages, findStageByDealId, onDealMove, externalStages]);

  const totals = useMemo(() => {
    const result: Record<StageId, { total: number; count: number }> = {} as Record<StageId, { total: number; count: number }>;
    stages.forEach((s) => {
      result[s.id] = {
        total: s.deals.reduce((sum, d) => sum + d.value, 0),
        count: s.deals.length,
      };
    });
    return result;
  }, [stages]);

  if (loading) {
    return (
      <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-72 shrink-0 space-y-3">
            <div className="h-8 w-24 bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" />
            <div className="h-16 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="h-28 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const renderStageContent = (stage: PipelineStage) => {
    if (stage.id === 'closed_lost') return null;

    const { total, count } = totals[stage.id];

    return (
      <div className="flex items-center gap-3 text-xs text-surface-500 mb-3 px-1">
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {formatCurrency(total)}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {count} deals
        </span>
      </div>
    );
  };

  return (
    <div className={cn('relative', className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ minHeight: '400px' }}>
          {stages.filter((s) => s.id !== 'closed_lost').map((stage) => (
            <div key={stage.id} className="w-72 shrink-0 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn('w-2.5 h-2.5 rounded-full', stageColors[stage.id])} />
                <h3 className="text-sm font-semibold">{stage.title}</h3>
                <span className="text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded-full">{stage.deals.length}</span>
              </div>

              {renderStageContent(stage)}

              <div
                className={cn(
                  'flex-1 space-y-2 min-h-[200px] rounded-xl bg-surface-50/50 dark:bg-surface-900/30 p-2 border-2 border-dashed',
                  'border-transparent transition-colors'
                )}
              >
                {stage.deals.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-xs text-surface-400 text-center">
                    <div>
                      <p>No deals</p>
                      <p className="text-surface-500 mt-0.5">Drag deals here</p>
                    </div>
                  </div>
                ) : (
                  stage.deals.map((deal) => (
                    <div key={deal.id} className="group">
                      <DndContext>
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          onClick={onDealClick}
                        />
                      </DndContext>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}

          {stages.filter((s) => s.id === 'closed_lost').map((stage) => (
            <div key={stage.id} className="w-72 shrink-0 flex flex-col opacity-60">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn('w-2.5 h-2.5 rounded-full', stageColors[stage.id])} />
                <h3 className="text-sm font-semibold">{stage.title}</h3>
                <span className="text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded-full">{stage.deals.length}</span>
              </div>
              <div className="flex-1 space-y-2 min-h-[200px] rounded-xl bg-surface-50/50 dark:bg-surface-900/30 p-2 border-2 border-dashed border-transparent">
                {stage.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
                ))}
                {stage.deals.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-xs text-surface-400 text-center">
                    <p>No lost deals</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div className="w-72">
              <DealCard deal={activeDeal} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
