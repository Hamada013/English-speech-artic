/* The English speech sound test (General American): what is tested, in this order.
   - Words: every consonant in the places it occurs (beginning, middle, end), one picture each, named by the child
     (or said after the model when the child cannot name it).
   - Blends: five s-blends, five l-blends and five r-blends at the beginning of words.
   - Connected speech: six short sentences said after the model; the therapist marks the target sounds in error.
   Ages of mastery (90% of children): Crowe, K., & McLeod, S. (2020). Children's English consonant acquisition in the
   United States: A review. American Journal of Speech-Language Pathology, 29(4), 2155–2169. The value is the age (in
   years) by which the sound is usually mastered: a sound acquired in 2;0–2;11 is listed as 3. Blends have no age in
   that review; 6 is used as a general guide and marked as such.
   This is an informal, criterion-referenced screener, not a standardized test. */
window.SoundTestItems = (() => {
  // [sound id, beginning word, middle word, end word]; '' where English has no such word or none is tested.
  const WORDS = [
    ['p', 'pig', 'apple', 'cup'], ['b', 'ball', 'rabbit', 'web'], ['t', 'tiger', 'cactus', 'hat'], ['d', 'dog', 'ladder', 'bed'],
    ['k', 'key', 'monkey', 'book'], ['g', 'goat', 'tiger', 'pig'], ['m', 'moon', 'hammer', 'drum'], ['n', 'nose', 'banana', 'sun'],
    ['ng', '', 'finger', 'ring'], ['f', 'fish', 'elephant', 'leaf'], ['v', 'van', 'oven', 'five'], ['th', 'thumb', 'toothbrush', 'teeth'],
    ['dh', '', 'feather', ''], ['s', 'sun', 'pencil', 'house'], ['z', 'zebra', 'scissors', 'nose'], ['sh', 'shoe', 'cushion', 'fish'],
    ['zh', '', 'treasure', ''], ['ch', 'cheese', 'teacher', 'peach'], ['j', 'jar', 'pajamas', 'bridge'], ['h', 'hat', '', ''],
    ['w', 'whale', '', ''], ['y', 'yoyo', 'onion', ''], ['l', 'lion', 'balloon', 'ball'], ['r', 'rabbit', 'carrots', 'car'],
  ];
  const BLENDS = { sblends: ['spoon', 'star', 'snake', 'sled', 'sky'], lblends: ['plane', 'flag', 'clock', 'glasses', 'blocks'], rblends: ['tree', 'train', 'bread', 'frog', 'grapes'] };
  // Drawing keys where they differ from the word (words/assets/data.js uses the same).
  const ART = { cactus: 'cactusword', leaf: 'leafword', yoyo: 'yoyo', star: 'starword', tree: 'bigtree', bread: 'loafbread', balloon: 'toyballoon', cushion: 'cushion', cup: 'coffeecup' };
  const SPOKEN = { yoyo: 'yo-yo' };
  const SENTENCES = [
    { id: 'c1', text: 'The red rabbit runs to the car.', targets: ['r'] },
    { id: 'c2', text: 'Sam sees six socks in the sun.', targets: ['s'] },
    { id: 'c3', text: 'Kate can kick the big green ball.', targets: ['k', 'g', 'rblends'] },
    { id: 'c4', text: 'She wishes for a fish and chips.', targets: ['sh', 'ch', 'f'] },
    { id: 'c5', text: 'Lucy likes yellow lemons.', targets: ['l', 'y'] },
    { id: 'c6', text: 'Thank you for the three thick books.', targets: ['th', 'dh', 'rblends'] },
  ];
  const AGE = { p: 3, b: 3, m: 3, n: 3, h: 3, w: 3, d: 3, g: 4, k: 4, f: 4, t: 4, ng: 4, y: 4, v: 5, j: 5, s: 5, ch: 5, l: 5, sh: 5, z: 5, r: 6, dh: 6, zh: 6, th: 7, sblends: 6, lblends: 6, rblends: 6 };
  const AGE_GUIDE = new Set(['sblends', 'lblends', 'rblends']);
  // Sounds children often say instead (a starting list for the substitution picker; any sound can be chosen).
  const LIKELY = {
    p: ['b', 'f'], b: ['p', 'm'], t: ['d', 'k'], d: ['t', 'g'], k: ['t', 'g'], g: ['d', 'k'], m: ['b', 'n'], n: ['m', 'd'], ng: ['n'],
    f: ['p', 'th', 'b'], v: ['b', 'f'], th: ['f', 't', 's'], dh: ['d', 'v', 'z'], s: ['th', 't', 'sh'], z: ['dh', 'd', 's'], sh: ['s', 'ch', 't'], zh: ['z', 'j', 'sh'],
    ch: ['t', 'sh', 's'], j: ['d', 'zh', 'z'], h: [''], w: [''], y: ['l', 'w'], l: ['w', 'y'], r: ['w', 'l'],
  };
  const items = [];
  for (const [sound, ...places] of WORDS) ['first', 'middle', 'last'].forEach((zone, i) => {
    const word = places[i];
    if (word) items.push({ id: `${sound}-${zone}`, kind: 'word', sound, zone, word, spoken: SPOKEN[word] || word, art: ART[word] || word });
  });
  for (const [group, list] of Object.entries(BLENDS)) list.forEach(word => items.push({ id: `${group}-${word}`, kind: 'blend', sound: group, zone: 'first', word, spoken: word, art: ART[word] || word }));
  return { items, SENTENCES, AGE, AGE_GUIDE, LIKELY, BLENDS };
})();
