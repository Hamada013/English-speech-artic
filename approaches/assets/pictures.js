/* A picture for every word of the approaches part, in the approved look (warm flat colours, thin brown lines):
   - a drawing from the words part's kit (given the approved look by skin()), by the word's drawing key;
   - a silly creature for made-up words, a different colour for each word, so a child who says "tat" sees something funny;
   - otherwise a card with the word written large. */
window.ApproachPictures = (() => {
  const K = window.ArticulationKit, Cozy = window.ArticulationCozy, L = '#5a3d2b';
  const line = (w = 6) => `stroke="${L}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const uris = new Map();
  const svg = (body, viewBox = '0 0 200 200') => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="240" height="240">${body}</svg>`);
  const kit = key => svg(Cozy.skin(K.words[key]));
  const textCard = word => svg(`<rect x="10" y="40" width="180" height="120" rx="26" fill="#fffaf0" ${line()}/><text x="100" y="116" text-anchor="middle" font-family="system-ui, sans-serif" font-size="44" font-weight="800" fill="${L}">${word}</text>`);
  /* The silly creature for a made-up word: a wobbly blob with googly eyes and its tongue out, coloured by the word. */
  function silly(word) {
    let seed = 0; for (const ch of word) seed = (seed * 31 + ch.codePointAt(0)) >>> 0;
    const colors = ['#c9b0d8', '#9fc378', '#f2a7b8', '#92c5e8', '#f3c27a', '#6ba39b'], color = colors[seed % colors.length], tilt = (seed >> 3) % 2 ? 1 : -1;
    return svg(`<path d="M40 170c-24-40-10-118 60-120 70 2 84 80 60 120-12 18-108 18-120 0Z" fill="${color}" ${line()}/><path d="M64 48l-12-26M136 48l12-26" ${line(5)}/><circle cx="52" cy="20" r="9" fill="${color}" ${line(4)}/><circle cx="148" cy="20" r="9" fill="${color}" ${line(4)}/>
      <circle cx="78" cy="96" r="22" fill="#fff" ${line(4)}/><circle cx="126" cy="${96 + tilt * 4}" r="16" fill="#fff" ${line(4)}/><circle cx="${84 + tilt * 4}" cy="102" r="9" fill="${L}"/><circle cx="${122 - tilt * 3}" cy="${92 + tilt * 6}" r="7" fill="${L}"/>
      <path d="M76 138q24 18 48 0" fill="#b5633f" ${line(4)}/><path d="M96 146q10 24 20 4" fill="#ef9a8a" ${line(3)}/><text x="168" y="70" font-family="system-ui, sans-serif" font-size="40" font-weight="800" fill="${L}">?</text>`);
  }
  /* The picture of a word object ({ word, meaning, nonword }): kit drawing, new drawing, letter card, silly creature or text. */
  function uri(w) {
    const key = w.word + (w.nonword ? '*' : '');
    if (uris.has(key)) return uris.get(key);
    const out = w.nonword ? silly(w.word) : K.words[w.meaning] ? kit(w.meaning) : textCard(w.word);
    uris.set(key, out);
    return out;
  }
  return { uri };
})();
