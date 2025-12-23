import { GuestSession } from '../../src/guest/guest-session.entity';

describe('GuestSession Entity', () => {
  let guestSession: GuestSession;

  beforeEach(() => {
    guestSession = new GuestSession();
    guestSession.id = 'guest-session-uuid';
    guestSession.meetingId = 'meeting-uuid';
    guestSession.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    guestSession.createdAt = new Date();
  });

  describe('GuestSession creation', () => {
    it('should create a guest session with all required fields', () => {
      expect(guestSession.id).toBe('guest-session-uuid');
      expect(guestSession.meetingId).toBe('meeting-uuid');
      expect(guestSession.expiresAt).toBeInstanceOf(Date);
      expect(guestSession.createdAt).toBeInstanceOf(Date);
    });

    it('should allow null userId for anonymous guests', () => {
      expect(guestSession.userId).toBeUndefined();
    });

    it('should support linking to user account', () => {
      guestSession.userId = 'user-uuid';
      expect(guestSession.userId).toBe('user-uuid');
    });

    it('should have expiration time in the future', () => {
      expect(guestSession.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });
});
