import PasswordHasherBcrypt from "./PasswordHasherBcrypt";
import bcrypt from "bcryptjs";

describe("Given an instance of PasswordHasherBcrypt class", () => {
  const passwordHasher = new PasswordHasherBcrypt();
  const password = "test-password";
  const hashedPassword = "test-hash";
  describe("When the method passwordHash is invoked with 'test-password' as password", () => {
    test("Then it should return the password hashed", async () => {
      const salt = 10;
      jest.spyOn(bcrypt, "hash").mockImplementation(() => hashedPassword);

      const returnedHashedPassword = await passwordHasher.passwordHash(
        password
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(returnedHashedPassword).toBe(hashedPassword);
    });
  });

  describe("And when the method passwordCompare is invoked with 'test-password' as password and a a valid hashed password", () => {
    test("Then it should return true", async () => {
      jest.spyOn(bcrypt, "compare").mockImplementation(() => true);

      const resultComparison = await passwordHasher.passwordCompare(
        password,
        hashedPassword
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(resultComparison).toBe(true);
    });
  });
});
