'use client';

import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export interface ComparisonPlan {
  name: string;
  price?: string;
  period?: string;
  popular?: boolean;
  badge?: string;
  highlight?: boolean;
}

export interface ComparisonRow {
  feature: string;
  values: (string | boolean)[];
}

export interface ComparisonCategory {
  name: string;
  rows: ComparisonRow[];
}

interface ComparisonTableProps {
  plans: ComparisonPlan[];
  rows: ComparisonRow[];
  highlightIndex?: number;
  className?: string;
}

export function ComparisonTable({ plans, rows, highlightIndex = 2, className }: ComparisonTableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f]/40', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.03]">
            <th scope="col" className="text-left px-5 py-3.5 font-semibold text-surface-900 dark:text-white">Feature</th>
            {plans.map((plan, i) => (
              <th
                key={plan.name}
                scope="col"
                className={cn(
                  'text-center px-4 py-3.5',
                  i === highlightIndex
                    ? 'font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5'
                    : 'font-medium text-surface-500 dark:text-surface-400'
                )}
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100 dark:divide-white/[0.04]">
          {rows.map((row) => (
            <tr key={row.feature} className="hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-3.5 font-medium text-surface-700 dark:text-surface-300">{row.feature}</td>
              {row.values.map((val, i) => (
                <td
                  key={i}
                  className={cn('px-4 py-3.5 text-center', i === highlightIndex ? 'bg-brand-50/30 dark:bg-brand-500/5' : '')}
                >
                  {typeof val === 'boolean' ? (
                    val ? (
                      <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" />
                    ) : (
                      <span className="text-surface-300 dark:text-surface-600">—</span>
                    )
                  ) : (
                    <span className="text-xs text-surface-600 dark:text-surface-400">{val}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ComparisonPlanCardsProps {
  plans: ComparisonPlan[];
  className?: string;
}

export function ComparisonPlanCards({ plans, className }: ComparisonPlanCardsProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10', className)}>
      {plans.map((plan, i) => (
        <div
          key={plan.name}
          className={cn(
            'relative p-4 rounded-2xl border text-center transition-all',
            plan.popular
              ? 'bg-brand-500 text-white border-brand-500 shadow-xl shadow-brand-500/20 scale-105 z-10'
              : 'bg-white dark:bg-[#0a0a0f]/40 border-surface-200 dark:border-white/[0.06] text-surface-900 dark:text-white'
          )}
        >
          {plan.popular && plan.badge && (
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-brand-600 text-[10px] font-bold shadow-sm whitespace-nowrap">
              {plan.badge}
            </div>
          )}
          <div className={cn('text-sm font-bold mb-1', plan.popular ? 'text-white' : '')}>{plan.name}</div>
          {plan.price && (
            <div className={cn('text-2xl font-extrabold', plan.popular ? 'text-white' : 'text-surface-900 dark:text-white')}>
              {plan.price}
            </div>
          )}
          {plan.period && (
            <div className={cn('text-xs', plan.popular ? 'text-white/80' : 'text-surface-400')}>{plan.period}</div>
          )}
        </div>
      ))}
    </div>
  );
}

interface CapabilitySectionProps {
  categories: ComparisonCategory[];
  plans: ComparisonPlan[];
  highlightIndex?: number;
  className?: string;
}

export function CapabilitySection({ categories, plans, highlightIndex = 2, className }: CapabilitySectionProps) {
  return (
    <div className={cn('space-y-10', className)}>
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">{category.name}</h3>
          <div className="rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.03]">
                  <th scope="col" className="text-left px-5 py-3 font-semibold text-surface-900 dark:text-white">Feature</th>
                  {plans.map((plan, i) => (
                    <th
                      key={plan.name}
                      scope="col"
                      className={cn(
                        'text-center px-3 py-3',
                        i === highlightIndex
                          ? 'font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/30 dark:bg-brand-500/5'
                          : 'font-medium text-surface-500'
                      )}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-white/[0.04]">
                {category.rows.map((row) => (
                  <tr key={row.feature} className="hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-surface-700 dark:text-surface-300">{row.feature}</td>
                    {row.values.map((val, i) => (
                      <td
                        key={i}
                        className={cn('px-3 py-3 text-center', i === highlightIndex ? 'bg-brand-50/30 dark:bg-brand-500/5' : '')}
                      >
                        {typeof val === 'boolean' ? (
                          val ? (
                            <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" />
                          ) : (
                            <span className="text-surface-300 dark:text-surface-600">—</span>
                          )
                        ) : (
                          <span className="text-xs font-medium text-surface-600 dark:text-surface-400">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
