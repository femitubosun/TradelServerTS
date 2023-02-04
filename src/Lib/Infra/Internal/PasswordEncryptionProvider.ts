import * as bcrypt from "bcrypt";
import { encryptionConfig } from "AppConfig/index";

export class PasswordEncryptionProvider {
  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, encryptionConfig.SALT_ROUNDS);
  }

  public static async verifyPassword(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
