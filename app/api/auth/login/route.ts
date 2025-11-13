import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromCookie, setUserCookie, verifyPassword, toPublicUser } from '../../../../lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { email, password } = parsed.data;

  // As we have no DB, treat the cookie as the source of truth for this device.
  const existing = await getUserFromCookie();
  if (!existing || existing.email !== email) {
    return NextResponse.json({ error: 'User not found on this device. Please sign up.' }, { status: 404 });
  }

  const ok = await verifyPassword(password, existing.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  await setUserCookie(existing);
  return NextResponse.json({ user: toPublicUser(existing) });
}
