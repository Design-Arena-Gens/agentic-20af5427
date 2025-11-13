const hiraMap: Record<string, string> = {
  "\u3042":"a","\u3044":"i","\u3046":"u","\u3048":"e","\u304a":"o",
  "\u304b":"ka","\u304d":"ki","\u304f":"ku","\u3051":"ke","\u3053":"ko",
  "\u3055":"sa","\u3057":"shi","\u3059":"su","\u305b":"se","\u305d":"so",
  "\u305f":"ta","\u3061":"chi","\u3064":"tsu","\u3066":"te","\u3068":"to",
  "\u306a":"na","\u306b":"ni","\u306c":"nu","\u306d":"ne","\u306e":"no",
  "\u306f":"ha","\u3072":"hi","\u3075":"fu","\u3078":"he","\u307b":"ho",
  "\u307e":"ma","\u307f":"mi","\u3080":"mu","\u3081":"me","\u3082":"mo",
  "\u3084":"ya","\u3086":"yu","\u3088":"yo",
  "\u3089":"ra","\u308a":"ri","\u308b":"ru","\u308c":"re","\u308d":"ro",
  "\u308f":"wa","\u3092":"o","\u3093":"n",
  "\u304c":"ga","\u304e":"gi","\u3050":"gu","\u3052":"ge","\u3054":"go",
  "\u3056":"za","\u3058":"ji","\u305a":"zu","\u305c":"ze","\u305e":"zo",
  "\u3060":"da","\u3062":"ji","\u3065":"zu","\u3067":"de","\u3069":"do",
  "\u3070":"ba","\u3073":"bi","\u3076":"bu","\u3079":"be","\u307c":"bo",
  "\u3071":"pa","\u3074":"pi","\u3077":"pu","\u307a":"pe","\u307d":"po",
  "\u304d\u3083":"kya","\u304d\u3085":"kyu","\u304d\u3087":"kyo",
  "\u3057\u3083":"sha","\u3057\u3085":"shu","\u3057\u3087":"sho",
  "\u3061\u3083":"cha","\u3061\u3085":"chu","\u3061\u3087":"cho",
  "\u306b\u3083":"nya","\u306b\u3085":"nyu","\u306b\u3087":"nyo",
  "\u3072\u3083":"hya","\u3072\u3085":"hyu","\u3072\u3087":"hyo",
  "\u307f\u3083":"mya","\u307f\u3085":"myu","\u307f\u3087":"myo",
  "\u308a\u3083":"rya","\u308a\u3085":"ryu","\u308a\u3087":"ryo",
  "\u304e\u3083":"gya","\u304e\u3085":"gyu","\u304e\u3087":"gyo",
  "\u3058\u3083":"ja","\u3058\u3085":"ju","\u3058\u3087":"jo",
  "\u3073\u3083":"bya","\u3073\u3085":"byu","\u3073\u3087":"byo",
  "\u3074\u3083":"pya","\u3074\u3085":"pyu","\u3074\u3087":"pyo"
};

export function toRomaji(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const two = text.slice(i, i + 2);
    if (hiraMap[two]) { out += hiraMap[two]; i++; continue; }
    const ch = text[i];
    if (ch === "\u3063") { // small tsu
      const next = text[i+1];
      if (next) {
        const rom = toRomaji(next).charAt(0);
        out += rom;
      }
      continue;
    }
    out += hiraMap[ch] || ch;
  }
  return out;
}
