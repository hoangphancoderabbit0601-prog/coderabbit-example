import { compare, genSalt, hash } from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(SALT_ROUNDS);
  return hash(password, salt);
};

export const comparePassword = async (
  providedPass: string,
  storedPass: string,
): Promise<boolean> => {
  return compare(providedPass, storedPass);
};
