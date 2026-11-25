/* Every part's results for one child, read from each part's own store, in one shape, for the reports page (reports/).
   Each part gives its levels and, per sound (or pattern), each level's latest score, whether it reached the goal (80% in
   the last two whole sessions, the parts' own rule) and the dated scores of all its sessions. The articulation test gives
   each assessment's right and wrong items by sound and word position. Sounds are keyed by the sound id (p, th, sblends…).
   Needs assets/therapy.js (store keys, ids, sizes) and assets/children.js. */
window.ArticulationResults = (() => {
  const T = window.ArticulationTherapy, Children = window.ArticulationChildren;
  const COLORS = { test: '#0f9fb5', syllables: '#6250d6', words: '#2a78d6', phrases: '#eb6834', sentences: '#1baf7a', stories: '#b8860b', approaches: '#b5487a' };
  const LEVELS = {
    test: [['first', 'Beginning'], ['middle', 'Middle'], ['last', 'End']],
    syllables: [['cv', 'Sound + vowel'], ['vc', 'Vowel + sound'], ['vcv', 'Vowel + sound + vowel']],
    words: [['first', 'Beginning'], ['middle', 'Middle'], ['last', 'End']],
    phrases: [['say', 'Phrases']], sentences: [['say', 'Sentences']], stories: [['pages', 'Story pages'], ['retell', 'Retelling']],
    approaches: [['pairs', 'Minimal pairs'], ['oppositions', 'Multiple oppositions'], ['cycles', 'Cycles']],
  };
  const NAMES = { test: 'Speech sound test', syllables: 'Syllables', words: 'Words', phrases: 'Phrases', sentences: 'Sentences', stories: 'Stories', approaches: 'Approaches' };
  const ORDER = T.SOUND_IDS;
  const invert = map => Object.fromEntries(Object.entries(map).map(([letter, id]) => [String(id), letter]));
  const BY_ID = { syllables: invert(T.SYLLABLE_IDS), words: invert(T.WORD_IDS), phrases: invert(T.WORD_IDS), sentences: invert(T.WORD_IDS), stories: invert(T.WORD_IDS) };
  const read = key => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
  const day = iso => T.today(new Date(iso));
  const mean = list => list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;

  /* A game part: each sound's levels with the latest score, the goal, and every session. */
  function game(part, childId) {
    const attempts = T.recordIn(part, childId)?.progress?.attempts || [], record = { progress: { attempts } };
    const keys = [...new Set(attempts.map(a => String(a.sound)))];
    const sounds = keys.map(id => {
      const pattern = part === 'approaches' ? T.PATTERNS.find(p => p.id === id) : null, letter = pattern ? null : BY_ID[part][id];
      if (!pattern && !letter) return null;
      const levels = Object.fromEntries(LEVELS[part].map(([zone]) => {
        const list = attempts.filter(a => String(a.sound) === id && a.zone === zone);
        if (!list.length) return [zone, null];
        const state = T.zoneState(record, part, id, zone);
        return [zone, { percent: state.last, reached: state.reached, sessions: list.length }];
      }));
      return { key: letter || id, letter, name: pattern?.name || letter, levels, sessions: attempts.filter(a => String(a.sound) === id).map(a => ({ date: a.date, zone: a.zone, percent: T.percentOf(a) })) };
    }).filter(Boolean).sort((a, b) => part === 'approaches' ? T.PATTERNS.findIndex(p => p.id === a.key) - T.PATTERNS.findIndex(p => p.id === b.key) : ORDER.indexOf(a.letter) - ORDER.indexOf(b.letter));
    return wrap(part, sounds, attempts.map(a => ({ date: a.date, percent: T.percentOf(a) })));
  }

  /* The speech sound test (test/): the child's tests by shared id in english-artic-tests-v1, oldest first. Item ids are
     <sound>-<zone> for words and <blend group>-<word> for blends; right counts 1, any error 0, "not tested" is left out. */
  function testOf(childId) {
    const tests = read('english-artic-tests-v1')?.children?.[childId];
    if (!Array.isArray(tests) || !tests.length) return null;
    const ZONES = ['first', 'middle', 'last'];
    const assessments = tests.map(test => {
      const items = {}, blends = {};
      for (const [id, entry] of Object.entries(test.items || {})) {
        if (!entry || entry.status === 'skip') continue;
        const score = entry.status === 'correct' ? 1 : 0, [sound, rest] = [id.slice(0, id.lastIndexOf('-')), id.slice(id.lastIndexOf('-') + 1)];
        if (T.BLENDS.includes(sound)) (blends[sound] ||= []).push(score);
        else if (ZONES.includes(rest)) (items[sound] ||= {})[rest] = score;
      }
      for (const [sound, list] of Object.entries(blends)) items[sound] = { first: mean(list) };
      return { id: test.id, date: test.date || day(test.created), items };
    }).filter(a => Object.keys(a.items).length).sort((a, b) => a.date.localeCompare(b.date));
    if (!assessments.length) return null;
    const latest = assessments.at(-1);
    const sounds = ORDER.filter(letter => latest.items[letter]).map(letter => ({
      key: letter, letter, name: T.display(letter),
      levels: Object.fromEntries(ZONES.map(zone => [zone, latest.items[letter][zone] === undefined ? null : { percent: Math.round(latest.items[letter][zone] * 100), reached: latest.items[letter][zone] === 1, sessions: 1 }])),
      sessions: assessments.filter(a => a.items[letter]).map(a => ({ date: a.date, percent: Math.round(mean(Object.values(a.items[letter])) * 100) })),
    }));
    const result = wrap('test', sounds, assessments.map(a => ({ date: a.date, percent: Math.round(mean(Object.values(a.items).flatMap(Object.values)) * 100) })));
    result.assessments = assessments;
    return result;
  }

  function wrap(part, sounds, sessions) {
    const latest = sounds.flatMap(s => Object.values(s.levels).filter(Boolean).map(l => l.percent));
    return { part, name: NAMES[part], color: COLORS[part], levels: LEVELS[part].map(([id, name]) => ({ id, name })), sounds, sessions, percent: latest.length ? Math.round(mean(latest)) : null, count: sessions.length };
  }
  /* All parts for a child, in the app's order; parts without results are left out. */
  function all(childId) {
    const parts = [testOf(childId), ...['syllables', 'words', 'phrases', 'sentences', 'stories', 'approaches'].map(part => game(part, childId))];
    return parts.filter(p => p && p.sounds.length);
  }
  return { COLORS, NAMES, LEVELS, ORDER, all, game, testOf, mean, day };
})();
