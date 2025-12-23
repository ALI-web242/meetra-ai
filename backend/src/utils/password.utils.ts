import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Recommended salt rounds for bcrypt

export class PasswordUtils {
  /**
   * Hashes a plain text password.
   * @param password The plain text password to hash.
   * @returns A promise that resolves to the hashed password string.
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param password The plain text password to compare.
   * @param hashedPassword The hashed password to compare against.
   * @returns A promise that resolves to a boolean indicating if the passwords match.
   */
  static async comparePassword(password: string, hashedPassword: string | null | undefined): Promise<boolean> {
    if (!hashedPassword || hashedPassword.trim() === '') {
      return false;
    }
    return bcrypt.compare(password, hashedPassword);
  }
}
