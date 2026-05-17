import { registerPresenceHandlers } from '../handlers/presence';

describe('Presence Handlers', () => {
  it('should export registerPresenceHandlers function', () => {
    expect(registerPresenceHandlers).toBeDefined();
    expect(typeof registerPresenceHandlers).toBe('function');
  });
});
