"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; displayName?: string; jlptLevel?: string } | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [jlptLevel, setJlptLevel] = useState('N5');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/user').then(async (r) => {
      const data = await r.json();
      setUser(data.user);
      setDisplayName(data.user?.displayName || '');
      setJlptLevel(data.user?.jlptLevel || 'N5');
    });
  }, []);

  async function save() {
    setSaving(true);
    await fetch('/api/user', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName, jlptLevel }) });
    setSaving(false);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account and JLPT preferences.</p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input disabled className="w-full px-3 py-2 rounded border bg-gray-50 dark:bg-gray-900" value={user?.email || ''} />
        </div>
        <div>
          <label className="block text-sm mb-1">Display name</label>
          <input className="w-full px-3 py-2 rounded border bg-transparent" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">JLPT level</label>
          <select className="w-full px-3 py-2 rounded border bg-transparent" value={jlptLevel} onChange={(e) => setJlptLevel(e.target.value)}>
            {['N5','N4','N3','N2','N1'].map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-brand-600 text-white">
            {saving ? 'Saving?' : 'Save changes'}
          </button>
          <button onClick={logout} className="px-4 py-2 rounded border">Log out</button>
        </div>
      </div>
    </div>
  );
}
