"use client";

import { useEffect, useMemo, useState } from 'react';

type PlanTask = { id: string; title: string; description: string; minutes: number; category: 'vocab'|'grammar'|'listening'|'reading'|'kanji'|'review' };

type DayPlan = { day: string; tasks: PlanTask[] };

type Plan = { weekOf: string; jlptLevel: string; days: DayPlan[] };

function generatePlan(level: string): Plan {
  const now = new Date();
  const weekOf = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const baseMins = level === 'N5' ? 45 : level === 'N4' ? 60 : 75;
  const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const focus: Record<string, PlanTask[]> = {
    N5: [
      { id: 'n5-vocab', title: 'Core N5 Vocab', description: 'Learn 15 core N5 words', minutes: 20, category: 'vocab' },
      { id: 'n5-grammar', title: 'N5 Grammar Basics', description: 'Study 1-2 grammar points', minutes: 15, category: 'grammar' },
      { id: 'n5-listen', title: 'Listening Practice', description: 'Short shadowing exercise', minutes: 10, category: 'listening' },
    ],
    N4: [
      { id: 'n4-vocab', title: 'N4 Vocab', description: 'Learn 20 new words', minutes: 25, category: 'vocab' },
      { id: 'n4-grammar', title: 'N4 Grammar', description: '2 grammar points + exercises', minutes: 20, category: 'grammar' },
      { id: 'n4-read', title: 'Reading', description: 'Short graded reader', minutes: 15, category: 'reading' },
    ],
  } as any;

  const planTasks = focus[level] || focus['N5'];
  const days: DayPlan[] = daysOfWeek.map((d, i) => ({
    day: d,
    tasks: planTasks.map((t) => ({ ...t, id: `${t.id}-${i}`, minutes: Math.round(t.minutes * (baseMins / 45)) }))
  }));

  return { weekOf: weekOf.toISOString().slice(0,10), jlptLevel: level, days };
}

export default function PlannerPage() {
  const [level, setLevel] = useState('N5');
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(({ user }) => {
      setLevel(user?.jlptLevel || 'N5');
      setPlan(generatePlan(user?.jlptLevel || 'N5'));
    });
  }, []);

  const totalMins = useMemo(() => plan?.days.reduce((sum, d) => sum + d.tasks.reduce((s,t)=>s+t.minutes,0), 0) || 0, [plan]);

  function regen(lvl: string) {
    const p = generatePlan(lvl);
    setPlan(p);
    fetch('/api/user', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jlptLevel: lvl, planner: p }) });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Planner</h1>
          <p className="text-gray-600 dark:text-gray-300">Weekly plan tailored to your JLPT level.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded border bg-transparent" value={level} onChange={(e)=>setLevel(e.target.value)}>
            {['N5','N4','N3','N2','N1'].map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
          </select>
          <button className="px-4 py-2 rounded bg-brand-600 text-white" onClick={()=>regen(level)}>Regenerate</button>
        </div>
      </div>

      {plan && (
        <div className="grid md:grid-cols-2 gap-6">
          {plan.days.map((d) => (
            <div key={d.day} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
              <div className="font-semibold mb-3">{d.day}</div>
              <ul className="space-y-3">
                {d.tasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full" style={{ background: categoryColor(t.category) }} />
                    <div className="flex-1">
                      <div className="font-medium">{t.title} <span className="text-xs text-gray-500">? {t.minutes}m</span></div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{t.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-300">Weekly minutes: {totalMins}</div>
    </div>
  );
}

function categoryColor(cat: string) {
  switch (cat) {
    case 'vocab': return '#8b5cf6';
    case 'grammar': return '#ec4899';
    case 'listening': return '#06b6d4';
    case 'reading': return '#22c55e';
    case 'kanji': return '#f59e0b';
    case 'review': return '#64748b';
    default: return '#a3a3a3';
  }
}
