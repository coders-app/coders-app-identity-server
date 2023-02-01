interface PasswordHasher {
  passwordHash: (password: string) => Promise<string>;
  passwordCompare: (
    password: string,
    hashedPassword: string
  ) => Promise<boolean>;
}

export default PasswordHasher;
