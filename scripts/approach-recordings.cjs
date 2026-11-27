#!/usr/bin/env node
/* Recordings for the approaches part: every word it can show that the words part has no recording for, real family
   words (tea, knee, cub…) and the made-up words (tat for cat, boa for boat…), said by the Mac's American voice.
   Writes approaches/sounds/<n>.m4a and approaches/assets/recordings.js (word → number; * marks a made-up word).
     VOICE="Ava (Premium)" node scripts/approach-recordings.cjs        (--all to make them all again) */
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), vm = require('node:vm'), { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..'), VOICE = process.env.VOICE || 'Ava (Premium)', ALL = process.argv.includes('--all');
const sandbox = { window: {} }; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'words/assets/data.js'), 'utf8'), sandbox);
const W = sandbox.window.ArticulationData;
vm.runInContext(fs.readFileSync(path.join(root, 'approaches/assets/data.js'), 'utf8'), sandbox);
const A = sandbox.window.ApproachData;
const bare = word => String(word).normalize('NFKC').toLowerCase();
const everyWord = W.sounds.flatMap(s => [...s.words.first, ...s.words.middle, ...s.words.last]), inWords = new Set(everyWord.map(w => bare(w.word)));
const wordsOf = id => { const s = W.sounds.find(x => x.id === id); return s ? [...s.words.first, ...s.words.middle, ...s.words.last] : []; };
const wanted = new Map(); // key → text
const add = w => { const key = bare(w.word) + (w.nonword ? '*' : ''); if (!w.nonword && inWords.has(bare(w.word))) return; wanted.set(key, w.word); };
for (const family of A.families) family.words.forEach(add);
for (const pattern of A.PATTERNS) {
  for (const [target, error] of pattern.contrasts) for (const p of A.allPairs(target, error, wordsOf(target), 5, everyWord)) { add(p.target); add(p.error); }
  if (pattern.deletion) { const words = ['b', 't', 'd', 'k', 'm', 'n', 'l', 'p', 'g'].flatMap(l => (W.sounds.find(s => s.id === l)?.words[pattern.deletion] || []).slice(0, 4)); for (const p of A.deletionPairs(pattern.deletion, words, 12, everyWord)) { add(p.target); add(p.error); } }
}
const out = path.join(root, 'approaches/sounds'); fs.mkdirSync(out, { recursive: true });
const map = {}, tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ap-')); let n = 0, made = 0;
for (const [key, text] of [...wanted].sort()) {
  const file = path.join(out, `${++n}.m4a`); map[key] = n;
  if (!ALL && fs.existsSync(file)) continue;
  const aiff = path.join(tmp, 'say.aiff');
  execFileSync('say', ['-v', VOICE, '-r', '145', '-o', aiff, text]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,adelay=120:all=1,apad=pad_dur=0.15', '-ac', '1', '-ar', '44100', '-c:a', 'aac', '-b:a', '64k', file]);
  made++;
}
fs.rmSync(tmp, { recursive: true, force: true });
fs.writeFileSync(path.join(root, 'approaches/assets/recordings.js'), `// Written by scripts/approach-recordings.cjs: each approaches word without a words-part recording (* marks a made-up word) and its recording number in sounds/.\nwindow.ApproachRecordings = ${JSON.stringify(map)};\n`);
console.log(`${Object.keys(map).length} approach words (${Object.keys(map).filter(k => k.endsWith('*')).length} made-up), ${made} recorded with ${VOICE}.`);
