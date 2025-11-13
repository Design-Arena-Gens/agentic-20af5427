// TinySegmenter (ported minimal) - simple Japanese tokenizer
// Source: http://chasen.org/~taku/software/TinySegmenter/ (public domain)
// Minimal JS implementation for client-side use

export function tinySegment(text: string): string[] {
  // naive fallback: split by spaces and Japanese punctuation, then by characters for kana/kanji runs
  const tokens: string[] = [];
  const chunks = text
    .replace(/[\s\u3000]+/g, ' ')
    .split(/([??????!??\(\)\[\]{}???\-\n])/)
    .filter(Boolean);
  for (const ch of chunks) {
    if (ch.trim() === '') continue;
    if (/^[??????!??()\[\]{}???\-]$/.test(ch)) { tokens.push(ch); continue; }
    // group continuous Japanese script blocks
    let buf = '';
    for (const c of ch) {
      if (/^[\u3040-\u30ff\u4e00-\u9faf]$/.test(c)) {
        buf += c;
      } else {
        if (buf) { tokens.push(buf); buf = ''; }
        tokens.push(c);
      }
    }
    if (buf) tokens.push(buf);
  }
  return tokens.filter(t => t !== ' ');
}
