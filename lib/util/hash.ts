'use server'
import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcryptHash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcryptCompare(password, hash);
};
