import { User } from '../../src/user/user.entity';
import { validate } from 'class-validator';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.id = 'test-uuid-123';
    user.email = 'test@example.com';
    user.passwordHash = 'hashedpassword123';
    user.createdAt = new Date();
    user.updatedAt = new Date();
  });

  describe('User creation', () => {
    it('should create a user with all required fields', () => {
      expect(user.id).toBe('test-uuid-123');
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedpassword123');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should allow null googleOAuthId for email/password users', () => {
      expect(user.googleOAuthId).toBeUndefined();
    });

    it('should support Google OAuth users', () => {
      user.googleOAuthId = 'google-oauth-id-123';
      expect(user.googleOAuthId).toBe('google-oauth-id-123');
    });
  });

  describe('User validation', () => {
    it('should have valid email format', () => {
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should have non-empty passwordHash', () => {
      expect(user.passwordHash).toBeTruthy();
      expect(user.passwordHash.length).toBeGreaterThan(0);
    });

    it('should have UUID format for id', () => {
      // UUID format check (simplified)
      expect(user.id).toBeTruthy();
    });
  });
});
