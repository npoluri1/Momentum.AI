import { registerCollaborationHandlers } from '../handlers/collaboration';

describe('Collaboration Handlers', () => {
  it('should export registerCollaborationHandlers function', () => {
    expect(registerCollaborationHandlers).toBeDefined();
    expect(typeof registerCollaborationHandlers).toBe('function');
  });
});
