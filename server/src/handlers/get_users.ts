
import { type User } from '../schema';

export const getUsers = async (): Promise<Omit<User, 'password_hash'>[]> => {
  // This is a placeholder declaration! Real code should be implemented here.
  // The goal of this handler is to fetch all users from the database
  // excluding password_hash for security reasons.
  return [];
};
