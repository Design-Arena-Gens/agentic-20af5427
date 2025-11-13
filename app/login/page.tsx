"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const next = typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('next') || '/profile') : '/profile';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Login failed');
      return;
    }
    router.push(next);
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full px-3 py-2 rounded border bg-transparent" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full px-3 py-2 rounded border bg-transparent" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full px-4 py-2 rounded bg-brand-600 hover:bg-brand-700 text-white font-medium">
          {loading ? 'Signing in?' : 'Sign in'}
        </button>
      </form>
      <p className="mt-3 text-sm">
        No account? <Link href="/signup" className="text-brand-600">Sign up</Link>
      </p>
    </div>
  );
}
