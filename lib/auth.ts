import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export type UserRecord = {
  email: string;
  passwordHash: string;
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  displayName?: string;
  preferences?: { theme?: 'light' | 'dark' };
  planner?: unknown;
};

export type PublicUser = Pick<UserRecord, 'email' | 'jlptLevel' | 'displayName'>;

const COOKIE_NAME = 'akari_user';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function setUserCookie(user: UserRecord) {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getUserFromCookie(): Promise<UserRecord | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<{ user: UserRecord }>(token, JWT_SECRET);
    return payload.user ?? null;
  } catch {
    return null;
  }
}

export async function clearUserCookie() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export function toPublicUser(user: UserRecord | null): PublicUser | null {
  if (!user) return null;
  return { email: user.email, jlptLevel: user.jlptLevel, displayName: user.displayName };
}
