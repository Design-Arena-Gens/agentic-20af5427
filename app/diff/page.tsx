"use client";

import { useEffect, useMemo, useState } from 'react';
import { tinySegment } from '../../lib/segmenter';
import { badgeForLevel, compareLevel, lookup, JLPTLevel } from '../../lib/jlpt';

export default function DiffPage() {
  const [text, setText] = useState('?????????????????');
  const [level, setLevel] = useState<JLPTLevel>('N5');

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(({ user }) => setLevel((user?.jlptLevel || 'N5') as JLPTLevel));
  }, []);

  const tokens = useMemo(() => tinySegment(text), [text]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Difficulty Highlighter</h1>
          <p className="text-gray-600 dark:text-gray-300">Paste Japanese text and see words above your JLPT level.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">My JLPT</label>
          <select className="px-3 py-2 rounded border bg-transparent" value={level} onChange={(e)=>setLevel(e.target.value as JLPTLevel)}>
            {(['N5','N4','N3','N2','N1'] as JLPTLevel[]).map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
          </select>
        </div>
      </div>

      <textarea className="w-full min-h-[140px] px-3 py-2 rounded border bg-transparent" value={text} onChange={(e)=>setText(e.target.value)} />

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Legend: <span className={badgeForLevel('N5')}>N5</span> <span className={badgeForLevel('N4')}>N4</span> <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-gray-600 text-white">Unknown</span></div>
        <div className="leading-8 text-lg flex flex-wrap">
          {tokens.map((tok, i) => (
            <Token key={i} token={tok} userLevel={level} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Token({ token, userLevel }: { token: string; userLevel: JLPTLevel }) {
  const info = lookup(token);
  if (!/^[\u3040-\u30ff\u4e00-\u9faf]+$/.test(token)) return <span className="mr-1">{token}</span>;
  const above = info ? compareLevel(info.level, userLevel) < 0 : true; // unknown treated as above
  const cls = above ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200';
  return (
    <span className={`mr-1 px-1.5 py-0.5 rounded ${cls}`} title={info ? `${info.entry.reading} ? ${info.entry.meaning} ? ${info.level}` : 'Unknown level'}>
      {token}
    </span>
  );
}
