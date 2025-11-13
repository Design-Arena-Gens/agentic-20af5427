import n5 from '../data/n5.json';
import n4 from '../data/n4.json';

export type DictEntry = { reading: string; meaning: string; pos: string };
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

const dictN5: Record<string, DictEntry> = n5 as any;
const dictN4: Record<string, DictEntry> = n4 as any;

export function lookup(word: string): { level: JLPTLevel; entry: DictEntry } | null {
  if (dictN5[word]) return { level: 'N5', entry: dictN5[word] };
  if (dictN4[word]) return { level: 'N4', entry: dictN4[word] };
  return null;
}

export function compareLevel(a: JLPTLevel, b: JLPTLevel): number {
  const order: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
  return order.indexOf(a) - order.indexOf(b);
}

export function badgeForLevel(level: JLPTLevel) {
  const color = {
    N5: 'bg-emerald-500',
    N4: 'bg-sky-500',
    N3: 'bg-yellow-500',
    N2: 'bg-orange-500',
    N1: 'bg-red-500',
  }[level];
  return `inline-flex items-center text-xs px-2 py-0.5 rounded text-white ${color}`;
}
