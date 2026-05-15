import type { Condition, ConditionGroup } from '../types.js';

export class ConditionalEngine {
  evaluate(group: ConditionGroup, context: Record<string, unknown>): boolean {
    return this.evaluateConditionGroup(group, context);
  }

  private evaluateConditionGroup(group: ConditionGroup, context: Record<string, unknown>): boolean {
    if (group.operator === 'and') {
      return group.conditions.every((cond) => this.evaluateSingle(cond, context));
    } else {
      return group.conditions.some((cond) => this.evaluateSingle(cond, context));
    }
  }

  private evaluateSingle(condition: Condition | ConditionGroup, context: Record<string, unknown>): boolean {
    if ('operator' in condition && 'field' in condition) {
      return this.evaluateCondition(condition, context);
    }
    return this.evaluateConditionGroup(condition as ConditionGroup, context);
  }

  private evaluateCondition(condition: Condition, context: Record<string, unknown>): boolean {
    const actualValue = this.resolveValue(condition.field, context);

    switch (condition.operator) {
      case 'equals':
        return actualValue === condition.value;
      case 'not_equals':
        return actualValue !== condition.value;
      case 'contains':
        if (typeof actualValue === 'string' && typeof condition.value === 'string') {
          return actualValue.includes(condition.value);
        }
        if (Array.isArray(actualValue)) {
          return actualValue.includes(condition.value);
        }
        return false;
      case 'not_contains':
        if (typeof actualValue === 'string' && typeof condition.value === 'string') {
          return !actualValue.includes(condition.value);
        }
        if (Array.isArray(actualValue)) {
          return !actualValue.includes(condition.value);
        }
        return true;
      case 'greater_than':
        return this.compareValues(actualValue, condition.value) > 0;
      case 'less_than':
        return this.compareValues(actualValue, condition.value) < 0;
      case 'regex':
        if (typeof actualValue === 'string' && typeof condition.value === 'string') {
          try {
            return new RegExp(condition.value).test(actualValue);
          } catch {
            return false;
          }
        }
        return false;
      case 'exists':
        return actualValue !== undefined && actualValue !== null;
      case 'not_exists':
        return actualValue === undefined || actualValue === null;
      default:
        return false;
    }
  }

  private resolveValue(field: string, context: Record<string, unknown>): unknown {
    const keys = field.split('.');
    let value: unknown = context;

    for (const key of keys) {
      if (value === null || value === undefined) {
        return undefined;
      }
      if (typeof value === 'object' && key in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private compareValues(a: unknown, b: unknown): number {
    const numA = typeof a === 'number' ? a : Number(a);
    const numB = typeof b === 'number' ? b : Number(b);

    if (isNaN(numA) || isNaN(numB)) {
      return String(a).localeCompare(String(b));
    }

    return numA - numB;
  }
}
