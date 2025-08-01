import * as bcrypt from 'bcryptjs';

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordUtil.SALT_ROUNDS);
  }

  async comparePasswords(
    input: string,
    storedHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(input, storedHash);
  }
}
