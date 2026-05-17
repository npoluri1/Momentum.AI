import { ActionRegistry } from '../actions/action_registry';

describe('ActionRegistry', () => {
  it('should register and retrieve actions', () => {
    const registry = new ActionRegistry();
    const actionTypes = registry.getRegisteredActions();
    expect(actionTypes.length).toBeGreaterThan(0);
  });

  it('should contain expected action types', () => {
    const registry = new ActionRegistry();
    const actionTypes = registry.getRegisteredActions();
    expect(actionTypes).toContain('create_task');
    expect(actionTypes).toContain('http_request');
    expect(actionTypes).toContain('send_email');
    expect(actionTypes).toContain('slack_notify');
  });
});
