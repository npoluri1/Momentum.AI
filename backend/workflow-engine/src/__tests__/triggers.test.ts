import { EventTrigger } from '../triggers/event_trigger';
import { ScheduleTrigger } from '../triggers/schedule_trigger';

describe('EventTrigger', () => {
  it('should create an event trigger', () => {
    const trigger = new EventTrigger();
    expect(trigger).toBeDefined();
  });
});

describe('ScheduleTrigger', () => {
  it('should parse cron expressions', () => {
    const trigger = new ScheduleTrigger();
    const result = trigger.parseCron('0 9 * * 1-5');
    expect(result).toBeDefined();
    expect(result.minute).toBe(0);
    expect(result.hour).toBe(9);
    expect(result.dayOfWeek).toContain(1);
  });
});
