import type PasswordHasher from "./PasswordHasher";
import bcrypt from "bcryptjs";

class PasswordHasherBcrypt implements PasswordHasher {
  salt = 10;

  async passwordHash(password: string) {
    const hashedPassword = await bcrypt.hash(password, this.salt);
    return hashedPassword;
  }

  async passwordCompare(password: string, hashedPassword: string) {
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    return isValidPassword;
  }
}

export default PasswordHasherBcrypt;
