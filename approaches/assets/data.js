/* The data behind the approaches part: contrast approaches for English (General American) error patterns.
   Draft for the therapist's approval.
   - CONSONANTS: the features of each sound (place, manner, voicing), to measure how different two sounds are.
   - PATTERNS: the error patterns (same ids and names as assets/therapy.js), each with its contrasts [target, what the
     child says instead].
   - FAMILIES: real English words that rhyme and differ in one consonant (or a blend against one consonant: tree / tea).
     Any two words in a family are a minimal pair when their sounds differ; one family with several targets is a
     multiple-opposition set; two sounds that differ in many features make a maximal-opposition pair.
     Each word: [word, drawing key, the sound(s) it stands for in the family]. All are picturable for a 3–6 year old.
   - Cycles take their listening list and practice words from the words part (../words/assets/data.js), by sound id.
   - Where a contrast has fewer than 5 real pairs, made-up words fill it: a real word from the words part with the
     child's sound in place of the target (cat → tat), or, for the deletion patterns, the word without its last or first
     consonant (boat → boa, boat → oat). They are marked nonword; the game shows a funny 'silly' picture for them. */
window.ApproachData = (() => {
  /* place: lab labdent dent alv post pal vel glot; manner: stop fric aff nas lat rhot appr; voiced. Blends: their own place. */
  const CONSONANTS = {
    p: ['lab', 'stop', 0], b: ['lab', 'stop', 1], t: ['alv', 'stop', 0], d: ['alv', 'stop', 1], k: ['vel', 'stop', 0], g: ['vel', 'stop', 1],
    m: ['lab', 'nas', 1], n: ['alv', 'nas', 1], ng: ['vel', 'nas', 1], f: ['labdent', 'fric', 0], v: ['labdent', 'fric', 1], th: ['dent', 'fric', 0], dh: ['dent', 'fric', 1],
    s: ['alv', 'fric', 0], z: ['alv', 'fric', 1], sh: ['post', 'fric', 0], zh: ['post', 'fric', 1], ch: ['post', 'aff', 0], j: ['post', 'aff', 1], h: ['glot', 'fric', 0],
    w: ['lab', 'appr', 1], y: ['pal', 'appr', 1], l: ['alv', 'lat', 1], r: ['post', 'rhot', 1],
    sblends: ['cluster', 'cluster', 0], lblends: ['cluster', 'cluster', 1], rblends: ['cluster', 'cluster', 1],
  };
  /* How many of the three features differ (0-3); maximal oppositions use pairs at 2 or more with a different manner. */
  const distance = (a, b) => CONSONANTS[a] && CONSONANTS[b] ? CONSONANTS[a].reduce((n, value, i) => n + (value !== CONSONANTS[b][i]), 0) : 0;

  const PATTERNS = [
    { id: 'fronting', name: 'Velar fronting', contrasts: [['k', 't'], ['g', 'd'], ['ng', 'n']] },
    { id: 'palatal', name: 'Palatal fronting', contrasts: [['sh', 's'], ['ch', 'ts'], ['zh', 'z']] },
    { id: 'backing', name: 'Backing', contrasts: [['t', 'k'], ['d', 'g']] },
    { id: 'stopping', name: 'Stopping', contrasts: [['s', 't'], ['f', 'p'], ['sh', 't'], ['z', 'd'], ['v', 'b'], ['th', 't'], ['dh', 'd'], ['ch', 't'], ['j', 'd']] },
    { id: 'gliding', name: 'Gliding of liquids', contrasts: [['r', 'w'], ['l', 'w'], ['l', 'y']] },
    { id: 'thfronting', name: 'TH fronting', contrasts: [['th', 'f'], ['dh', 'v']] },
    { id: 'deaffrication', name: 'Deaffrication', contrasts: [['ch', 'sh'], ['j', 'zh']] },
    { id: 'affrication', name: 'Affrication', contrasts: [['sh', 'ch'], ['s', 'ch']] },
    { id: 'voicing', name: 'Voicing', contrasts: [['p', 'b'], ['t', 'd'], ['k', 'g']] },
    { id: 'devoicing', name: 'Devoicing', contrasts: [['b', 'p'], ['d', 't'], ['g', 'k'], ['z', 's'], ['v', 'f']] },
    { id: 'clusters', name: 'Cluster reduction', contrasts: [['sblends', 'n'], ['sblends', 'k'], ['sblends', 'p'], ['rblends', 't'], ['rblends', 'b'], ['rblends', 'f'], ['rblends', 'k'], ['lblends', 'b'], ['lblends', 'p']] },
    { id: 'final', name: 'Final consonant deletion', contrasts: [], deletion: 'last' },
    { id: 'initial', name: 'Initial consonant deletion', contrasts: [], deletion: 'first' },
  ];

  /* Each family: its rhyme and its words [word, drawing key, sound ids]. */
  const FAMILIES = [
    ['-ee', [['key', 'key', 'k'], ['tea', 'tea', 't'], ['bee', 'bee', 'b'], ['pea', 'pea', 'p'], ['knee', 'knee', 'n'], ['sea', 'sea', 's'], ['tree', 'bigtree', 'rblends t'], ['three', 'three', 'th']]],
    ['-in', [['pin', 'pin', 'p'], ['bin', 'bin', 'b'], ['fin', 'fin', 'f'], ['tin', 'tin', 't'], ['thin', 'thin', 'th'], ['chin', 'chin', 'ch']]],
    ['-ip', [['ship', 'ship', 'sh'], ['chip', 'chip', 'ch'], ['sip', 'sip', 's'], ['zip', 'zipper', 'z'], ['lip', 'lips', 'l'], ['whip', 'whip', 'w'], ['hip', 'hip', 'h']]],
    ['-ug', [['bug', 'bug', 'b'], ['mug', 'mug', 'm'], ['rug', 'rug', 'r'], ['jug', 'jug', 'j'], ['hug', 'hug', 'h']]],
    ['-at', [['cat', 'cat', 'k'], ['hat', 'hat', 'h'], ['bat', 'bat', 'b'], ['vat', 'vat', 'v'], ['mat', 'mat', 'm'], ['rat', 'rat', 'r']]],
    ['-an', [['fan', 'fan', 'f'], ['van', 'van', 'v'], ['pan', 'pan', 'p'], ['man', 'man', 'm']]],
    ['-ig', [['pig', 'pig', 'p'], ['fig', 'figs', 'f'], ['dig', 'dig', 'd'], ['jig', 'jig', 'j'], ['wig', 'wig', 'w']]],
    ['-og', [['dog', 'dog', 'd'], ['jog', 'jog', 'j'], ['fog', 'fog', 'f'], ['frog', 'frog', 'rblends']]],
    ['-oat', [['coat', 'coat', 'k'], ['goat', 'goat', 'g'], ['boat', 'boatword', 'b'], ['vote', 'vote', 'v']]],
    ['-oe', [['toe', 'toe', 't'], ['doe', 'doe', 'd'], ['hoe', 'hoe', 'h'], ['bow', 'ribbon', 'b']]],
    ['-ear', [['deer', 'deer', 'd'], ['tear', 'tear', 't'], ['gear', 'gear', 'g']]],
    ['-ine', [['pine', 'pine', 'p'], ['vine', 'vine', 'v'], ['nine', 'nine', 'n']]],
    ['-ime', [['dime', 'dime', 'd'], ['lime', 'lime', 'l']]],
    ['-ot', [['cot', 'cot', 'k'], ['pot', 'pot', 'p'], ['knot', 'knot', 'n']]],
    ['-ill', [['pill', 'pill', 'p'], ['hill', 'hill', 'h']]],
    ['-un', [['bun', 'bun', 'b'], ['sun', 'sun', 's']]],
    ['-eep', [['sheep', 'sheep', 'sh'], ['jeep', 'jeep', 'j']]],
    ['-awn', [['lawn', 'lawn', 'l'], ['yawn', 'yawn', 'y']]],
    ['-am', [['jam', 'jam', 'j'], ['ram', 'ram', 'r'], ['lamb', 'lamb', 'l'], ['yam', 'yam', 'y']]],
    ['-ake', [['cake', 'cake', 'k'], ['rake', 'rake', 'r'], ['lake', 'lake', 'l'], ['snake', 'snake', 'sblends']]],
    ['-ar', [['car', 'car', 'k'], ['jar', 'jar', 'j'], ['star', 'starword', 'sblends']]],
    ['-ing', [['king', 'king', 'k'], ['ring', 'ring', 'r'], ['wing', 'wing', 'w'], ['swing', 'swingword', 'sblends']]],
    ['-all', [['ball', 'ball', 'b'], ['wall', 'wall', 'w'], ['doll', 'doll', 'd']]],
    ['-ell', [['bell', 'bell', 'b'], ['well', 'well', 'w']]],
    ['-ail', [['nail', 'nail', 'n'], ['snail', 'snail', 'sblends'], ['tail', 'tail', 't'], ['sail', 'sail', 's'], ['whale', 'whale', 'w'], ['pail', 'pail', 'p']]],
    ['-oon', [['moon', 'moon', 'm'], ['spoon', 'spoon', 'sblends']]],
    ['-ed', [['bed', 'bed', 'b'], ['bread', 'loafbread', 'rblends'], ['sled', 'sled', 'sblends'], ['head', 'head', 'h']]],
    ['-ock', [['sock', 'socks', 's'], ['clock', 'clock', 'lblends'], ['rock', 'boulder', 'r'], ['lock', 'lock', 'l'], ['wok', 'wok', 'w']]],
    ['-ish', [['fish', 'fish', 'f'], ['dish', 'dish', 'd']]],
    ['-ain', [['rain', 'rainfall', 'r'], ['train', 'train', 'rblends'], ['plane', 'plane', 'lblends'], ['cane', 'cane', 'k']]],
    ['-ie', [['pie', 'pie', 'p'], ['fly', 'fly', 'lblends'], ['sky', 'sky', 'sblends']]],
    ['-ose', [['nose', 'nose', 'n'], ['rose', 'rose', 'r']]],
    ['-en', [['ten', 'ten', 't'], ['hen', 'chicken', 'h']]],
    ['-oal', [['bowl', 'bowl', 'b'], ['coal', 'coal', 'k']]],
    ['-oo', [['shoe', 'shoe', 'sh'], ['two', 'two', 't'], ['glue', 'glue', 'lblends'], ['zoo', 'zebra', 'z']]],
    ['-eg', [['leg', 'leg', 'l'], ['peg', 'peg', 'p']]],
    ['-aw', [['saw', 'saw', 's'], ['claw', 'claw', 'lblends']]],
    ['-ub', [['cub', 'cub', 'k'], ['tub', 'bathtub', 't']]],
    ['ba-', [['back', 'backbody', 'k'], ['bat', 'bat', 't'], ['bag', 'sack', 'g']]],
    ['ne-', [['neck', 'neck', 'k'], ['net', 'net', 't']]],
    ['bee-', [['bees', 'bee', 'z'], ['beads', 'bead', 'd']]],
    ['ro-', [['rose', 'rose', 'z'], ['road', 'road', 'd']]],
    ['-air', [['pear', 'pear', 'p'], ['bear', 'bear', 'b'], ['chair', 'armchair', 'ch']]],
    ['-old', [['gold', 'gold', 'g'], ['cold', 'snowfall', 'k']]],
    ['-uck', [['duck', 'duck', 'd'], ['truck', 'truck', 'rblends']]],
    ['-um', [['thumb', 'thumb', 'th'], ['drum', 'drum', 'rblends']]],
    ['-ox', [['box', 'emptybox', 'b'], ['blocks', 'blocks', 'lblends'], ['fox', 'fox', 'f']]],
    ['-ow', [['crow', 'crow', 'rblends'], ['cow', 'cow', 'k']]],
    ['-orn', [['corn', 'corn', 'k'], ['thorn', 'thorns', 'th']]],
    ['-ouse', [['mouse', 'mouse', 's'], ['mouth', 'mouth', 'th']]],
    ['-atch', [['watch', 'watch', 'ch'], ['wash', 'washer', 'sh']]],
    ['-ope', [['rope', 'rope', 'r'], ['soap', 'soap', 's']]],
    ['-est', [['vest', 'vest', 'v'], ['nest', 'nest', 'n']]],
  ];

  const families = FAMILIES.map(([frame, words]) => ({ frame, words: words.filter(([, key]) => window.ArticulationKit?.words?.[key] || !window.ArticulationKit).map(([word, meaning, letters]) => ({ word, meaning, picturable: true, letters: letters.split(' ').filter(Boolean), letter: letters.split(' ')[0] })) }));
  const is = (word, letter) => word.letters.includes(letter);

  /* Minimal pairs for one contrast: every family with a word on each side. */
  function pairsFor(target, error) {
    const pairs = [];
    for (const family of families) {
      const a = family.words.find(w => is(w, target)), b = family.words.find(w => w !== a && is(w, error));
      if (a && b) pairs.push({ frame: family.frame, target: { ...a, letter: target }, error: { ...b, letter: error }, strong: true });
    }
    return pairs;
  }
  /* Multiple oppositions: families where the child's one error sound stands against several of the targets it replaces. */
  function multipleFor(error, targets) {
    return families.map(family => ({ frame: family.frame, error: family.words.find(w => is(w, error)), targets: family.words.filter(w => targets.some(t => is(w, t)) && !is(w, error)) }))
      .filter(set => set.error && set.targets.length >= 2);
  }
  /* Maximal oppositions: the target against a sound that differs in 2 or 3 features. */
  function maximalFor(target) {
    const sets = [];
    for (const family of families) {
      const a = family.words.find(w => is(w, target));
      if (a) for (const b of family.words) if (b !== a && distance(target, b.letter) >= 2) sets.push({ frame: family.frame, target: a, other: b, distance: distance(target, b.letter), strong: true });
    }
    return sets.sort((x, y) => y.distance - x.distance);
  }

  /* ---------- Made-up words ---------- */
  /* How each sound is spelled at the start of a word (for swapping it), and what the blends keep when reduced. */
  const SPELL = { p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', m: 'm', n: 'n', f: 'f', v: 'v', th: 'th', dh: 'th', s: 's', z: 'z', sh: 'sh', zh: 'zh', ch: 'ch', j: 'j', h: 'h', w: 'w', y: 'y', l: 'l', r: 'r', ts: 'ts' };
  const ONSET = { k: /^(c(?![eiy])|k|ck)/, g: /^g(?![eiy])/, j: /^(j|g(?=[eiy]))/, f: /^(f|ph)/, s: /^(s(?!h)|c(?=[eiy]))/, sh: /^sh/, ch: /^ch/, th: /^th/, dh: /^th/, w: /^(wh|w)/, z: /^(z|x)/ };
  const onsetOf = letter => ONSET[letter] || new RegExp(`^${SPELL[letter] || letter}`);
  const REAL = new Set(['tea', 'bat', 'cat', 'hat', 'rat', 'top', 'tip', 'tan', 'ten', 'tin', 'toe', 'two', 'do', 'day', 'dog', 'den', 'bun', 'sun', 'pan', 'pin', 'pig', 'big', 'tub', 'tail', 'tall', 'wall', 'ball', 'bell', 'well', 'way', 'wet', 'red', 'bed', 'sea', 'see', 'say', 'wing', 'king', 'ring', 'at', 'it', 'an', 'in', 'on', 'up', 'us', 'go', 'no', 'so', 'tie', 'die', 'pie', 'by', 'my', 'shoe', 'sue', 'chew', 'too', 'wipe', 'white', 'wake', 'lake', 'take', 'make', 'bake', 'cake']);
  const known = words => new Set([...REAL, ...families.flatMap(f => f.words.map(w => w.word)), ...words.map(w => w.word.toLowerCase())]);
  /* Words from the words part that start with the target sound and are not already in a real pair. */
  function nonwordsFor(target, error, words, count, everyWord = words) {
    const used = new Set(pairsFor(target, error).map(p => p.target.word)), real = known(everyWord), out = [];
    if (CONSONANTS[target]?.[0] === 'cluster') return out;
    for (const w of words) {
      if (out.length >= count) break;
      if (used.has(w.word) || w.zone !== 'first' || !onsetOf(target).test(w.word)) continue;
      const made = w.word.replace(onsetOf(target), SPELL[error] || error);
      if (real.has(made) || made === w.word) continue;
      out.push({ frame: 'made-up', target: { word: w.word, meaning: w.art, picturable: true, letter: target }, error: { word: made, meaning: 'made-up word', picturable: false, nonword: true, letter: error }, strong: true, nonword: true });
    }
    return out;
  }
  /* Deletion patterns: the word, and the same word without its last (or first) consonant sound. */
  function deletionPairs(zone, words, count, everyWord = words) {
    const real = known(everyWord);
    return words.filter(w => /^[a-z]+$/.test(w.word) && w.word.length >= 3).map(w => {
      const made = zone === 'last' ? w.word.replace(/e$/, '').replace(/(ck|ch|sh|th|ng|[^aeiouy])+$/, '') : w.word.replace(/^(ch|sh|th|wh|[^aeiou])+/, '');
      return { frame: 'made-up', target: { word: w.word, meaning: w.art, picturable: true }, error: { word: made, meaning: 'made-up word', picturable: false, nonword: true }, strong: true, nonword: true };
    }).filter(pair => pair.error.word.length >= 1 && pair.error.word !== pair.target.word && !real.has(pair.error.word)).slice(0, count);
  }
  /* All the pairs for a contrast: the real ones, then made-up ones until there are enough. */
  function allPairs(target, error, words, needed = 5, everyWord = words) {
    const real = pairsFor(target, error);
    return [...real, ...nonwordsFor(target, error, words, Math.max(0, needed - real.length), everyWord)];
  }
  return { CONSONANTS, PATTERNS, families, distance, pairsFor, multipleFor, maximalFor, nonwordsFor, deletionPairs, allPairs, NEEDED: 5 };
})();
