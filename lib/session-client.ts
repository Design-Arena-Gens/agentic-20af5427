"use client";

export type ClientUser = { email: string; jlptLevel?: string } | null;

export async function getCurrentUser(): Promise<ClientUser> {
  try {
    const res = await fetch('/api/user', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}
