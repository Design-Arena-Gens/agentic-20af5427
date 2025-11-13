import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword, setUserCookie, toPublicUser } from '../../../../lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2).max(50).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { email, password, displayName } = parsed.data;
  const passwordHash = await hashPassword(password);

  await setUserCookie({ email, passwordHash, displayName, jlptLevel: 'N5', preferences: { theme: 'light' } });

  return NextResponse.json({ user: toPublicUser({ email, passwordHash, displayName, jlptLevel: 'N5' }) });
}
