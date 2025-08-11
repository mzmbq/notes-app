import * as bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
  const salt = 10;
  return await bcrypt.hash(password, salt);
}

async function isCorrectPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}

export { hashPassword, isCorrectPassword };
