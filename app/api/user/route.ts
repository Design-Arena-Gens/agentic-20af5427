import { NextResponse } from 'next/server';
import { getUserFromCookie, setUserCookie, toPublicUser, UserRecord } from '../../../lib/auth';

export async function GET() {
  const user = await getUserFromCookie();
  return NextResponse.json({ user: toPublicUser(user) });
}

export async function PUT(req: Request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const updates: Partial<UserRecord> = {};

  if (body.jlptLevel && ['N5', 'N4', 'N3', 'N2', 'N1'].includes(body.jlptLevel)) {
    updates.jlptLevel = body.jlptLevel;
  }
  if (body.displayName && typeof body.displayName === 'string') {
    updates.displayName = body.displayName;
  }
  if (body.preferences && typeof body.preferences === 'object') {
    updates.preferences = { ...user.preferences, ...body.preferences };
  }
  if (body.planner) {
    updates.planner = body.planner;
  }

  const merged: UserRecord = { ...user, ...updates };
  await setUserCookie(merged);
  return NextResponse.json({ user: toPublicUser(merged) });
}
