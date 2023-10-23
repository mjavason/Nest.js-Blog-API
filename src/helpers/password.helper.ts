import { hash } from 'bcrypt';

export async function hashPassword(password: string) {
  const saltRounds = 10; // You can adjust the number of rounds for security
  return await hash(password, saltRounds);
}

/**
 * Passwords will contain at least 1 upper case letter
 * Passwords will contain at least 1 lower case letter
 * Passwords will contain at least 1 number or special character
 * There is no length validation (min, max) in this regex!
 * @returns RegExp
 */

export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
