import * as bcrypt from 'bcryptjs';

export function encodePassword(rawPassword: string) {
  const salt = 10;
  return bcrypt.hash(rawPassword, salt);
}

export function comparePasswords(rawPassword: string, hash: string) {
  return bcrypt.compare(rawPassword, hash);
}
