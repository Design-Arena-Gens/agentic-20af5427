"use client";

import { useEffect, useMemo, useState } from 'react';
import { tinySegment } from '../../lib/segmenter';
import { lookup } from '../../lib/jlpt';
import { toRomaji } from '../../lib/romaji';

export default function TranslatorPage() {
  const [text, setText] = useState('??????????');
  const [tokens, setTokens] = useState<string[]>([]);

  useEffect(() => { setTokens(tinySegment(text)); }, [text]);

  const glosses = useMemo(() => tokens.map((t) => ({ t, info: lookup(t) })), [tokens]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Translator</h1>
        <p className="text-gray-600 dark:text-gray-300">Offline, dictionary-based translation with readings and romaji. No external APIs.</p>
      </div>

      <textarea className="w-full min-h-[140px] px-3 py-2 rounded border bg-transparent" value={text} onChange={(e)=>setText(e.target.value)} />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
          <div className="font-semibold mb-2">Tokens</div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((t, i) => (
              <span key={i} className="px-2 py-1 rounded border">{t}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
          <div className="font-semibold mb-2">Glossary</div>
          <ul className="space-y-2">
            {glosses.map(({ t, info }, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="min-w-20 font-medium">{t}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  {info ? (
                    <>
                      <div>{info.entry.reading} ({toRomaji(info.entry.reading)})</div>
                      <div className="text-gray-500 dark:text-gray-400">{info.entry.meaning}</div>
                    </>
                  ) : (
                    <div className="text-gray-500">?</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
