/* Describes the approaches part the way the shared plan and report expect a part: each error pattern stands where a sound
   stands elsewhere, and the three approaches stand where the levels stand. A full session has a fixed number of grades:
   10 for pairs and oppositions (5 listening, 5 saying), 5 for cycles (the 5 words said). */
window.ArticulationData = (() => {
  const A = window.ApproachData;
  const positions = [
    { id: 'pairs', name: 'Minimal pairs', example: 'key / tea' },
    { id: 'oppositions', name: 'Multiple oppositions', example: 'tea / key / sea / three' },
    { id: 'cycles', name: 'Cycles', example: 'One pattern each week' },
  ];
  const SIZES = { pairs: 10, oppositions: 10, cycles: 5 };
  /* A short label for a pattern: its first contrast (ك←ت), or a mark for the deletion patterns. */
  const SHOW = { sblends: 's+C', lblends: 'C+l', rblends: 'C+r', dh: 'ð' }, show = id => SHOW[id] || id;
  const label = pattern => pattern.contrasts.length ? `${show(pattern.contrasts[0][0])}→${show(pattern.contrasts[0][1])}` : pattern.deletion === 'last' ? 'bus → bu' : 'bus → us';
  const sounds = A.PATTERNS.map(pattern => ({ id: pattern.id, letter: label(pattern), name: pattern.name, pattern, words: Object.fromEntries(positions.map(p => [p.id, Array(SIZES[p.id]).fill(null)])) }));
  return { title: 'Approaches', positions, sounds, soundById: id => sounds.find(entry => entry.id === id), positionName: id => positions.find(entry => entry.id === id)?.name || id };
})();
