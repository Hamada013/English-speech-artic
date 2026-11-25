/* The English syllables of every consonant (General American), for the syllable train. A "sound" is a consonant (the long
   goal); its "positions" are the syllable types CV, VC and VCV (the short goals), with three vowels: ah /ɑ/, ee /i/ and
   oo /u/. Each syllable is written the way an English reader says it (pah, eep, ah-poo); until it is recorded, the
   device voice says that spelling. English has no syllable starting with NG, and none ending with H, W or Y. */
window.ArticulationData = (() => {
  const VOWELS = [{ id: 'ah', cv: 'ah', vc: 'o' }, { id: 'ee', cv: 'ee', vc: 'ee' }, { id: 'oo', cv: 'oo', vc: 'oo' }];
  // [id, name, onset spelling, coda spelling after ah, coda spelling after ee/oo]
  const CONSONANTS = [
    ['p', 'The P sound', 'p', 'p', 'p'], ['b', 'The B sound', 'b', 'b', 'b'], ['t', 'The T sound', 't', 't', 't'], ['d', 'The D sound', 'd', 'd', 'd'],
    ['k', 'The K sound', 'k', 'ck', 'k'], ['g', 'The G sound', 'g', 'g', 'g'], ['m', 'The M sound', 'm', 'm', 'm'], ['n', 'The N sound', 'n', 'n', 'n'],
    ['ng', 'The NG sound', '', 'ng', 'ng'], ['f', 'The F sound', 'f', 'ff', 'f'], ['v', 'The V sound', 'v', 'v', 'v'], ['th', 'The TH sound (thumb)', 'th', 'th', 'th'],
    ['dh', 'The TH sound (feather)', 'th', 'the', 'the'], ['s', 'The S sound', 's', 'ss', 'ss'], ['z', 'The Z sound', 'z', 'z', 'z'], ['sh', 'The SH sound', 'sh', 'sh', 'sh'],
    ['zh', 'The ZH sound (treasure)', 'zh', 'zh', 'zh'], ['ch', 'The CH sound', 'ch', 'tch', 'ch'], ['j', 'The J sound', 'j', 'dge', 'dge'], ['h', 'The H sound', 'h', '', ''],
    ['w', 'The W sound', 'w', '', ''], ['y', 'The Y sound', 'y', '', ''], ['l', 'The L sound', 'l', 'll', 'l'], ['r', 'The R sound', 'r', 'r', 'r'],
  ];
  const positions = [
    { id: 'cv', name: 'Sound + vowel', example: 'pah' },
    { id: 'vc', name: 'Vowel + sound', example: 'op' },
    { id: 'vcv', name: 'Vowel + sound + vowel', example: 'ah-pah' },
  ];
  const ONSET_FIX = { 'g-ee': 'ghee', 'y-oo': 'you', 'dh-ee': 'thee', 'th-ee': 'thee' };
  const cv = (c, v) => ONSET_FIX[`${c[0]}-${v.id}`] || `${c[2]}${v.cv}`;
  const vc = (c, v) => `${v.vc}${v.id === 'ah' ? c[3] : c[4]}`;
  const sounds = CONSONANTS.map((c, s) => {
    const [id, name] = c, item = (n, parts, word) => ({ id: `${id}-${n}`, art: `${id}-${n}`, letter: id, number: n, parts, word, spoken: word.replace(/-/g, ' '), audio: `sounds/${s + 1}/${n}.m4a` });
    const words = {
      cv: c[2] ? VOWELS.map((v, i) => item(i + 1, [id, v.id], cv(c, v))) : [],
      vc: c[3] ? VOWELS.map((v, i) => item(i + 4, [v.id, id], vc(c, v))) : [],
      vcv: VOWELS.flatMap((a, i) => VOWELS.map((b, j) => item(7 + i * 3 + j, [a.id, id, b.id], `${a.cv}-${c[2] ? cv(c, b) : `ng${b.cv}`}`))),
    };
    return { id, letter: id === 'dh' ? 'th' : id, name, words, zones: positions.map(p => p.id).filter(type => words[type].length) };
  });
  /* Each station's train has three cars. CV and VC are one station each; VCV is three, one for each first vowel. */
  const stationsOf = (sound, types) => types.filter(type => sound.words[type].length).flatMap(type => type === 'vcv' ? [0, 1, 2].map(k => ({ type, items: sound.words.vcv.slice(k * 3, k * 3 + 3) })) : [{ type, items: sound.words[type] }]);
  const positionsOf = sound => positions.filter(entry => (typeof sound === 'string' ? sounds.find(s => s.id === sound) : sound).zones.includes(entry.id));
  return { positions, positionsOf, sounds, stationsOf, VOWELS, soundById: id => sounds.find(entry => entry.id === String(id)), positionName: id => positions.find(entry => entry.id === id).name };
})();
