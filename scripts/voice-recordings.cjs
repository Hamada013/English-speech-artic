#!/usr/bin/env node
/* Makes every recording the app plays with the Mac's American voice, so all devices hear the same clear voice, offline
   too: words, syllables, phrases, sentences and story pages, at the file names in docs/recordings.pdf.
     VOICE="Ava (Premium)" node scripts/voice-recordings.cjs          makes the files that are missing
     VOICE="Ava (Premium)" node scripts/voice-recordings.cjs --all    makes them all again
   A file the therapist recorded is kept: list it in sounds/OWN.txt (one file name per line) and it is never replaced.
   Then run node scripts/build-offline.cjs, node words/scripts/build-pwa.cjs and node scripts/recordings.cjs. */
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), vm = require('node:vm'), { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..'), VOICE = process.env.VOICE || 'Ava (Premium)', ALL = process.argv.includes('--all'), ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7);
const load = file => { const sandbox = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox); return sandbox.window.ArticulationData; };
const jobs = []; // [folder, file, text, rate]
{ const data = load('words/assets/data.js'), seen = new Set(); for (const s of data.sounds) for (const list of Object.values(s.words)) for (const w of list) if (!seen.has(w.n)) { seen.add(w.n); jobs.push(['words/sounds', `${w.n}.m4a`, w.word, 150]); } }
{ const data = load('syllable/assets/data.js'); for (const s of data.sounds) for (const item of Object.values(s.words).flat()) jobs.push(['syllable', item.audio, item.spoken, 135]); }
for (const part of ['phrases', 'sentences', 'stories']) for (const s of load(`${part}/assets/data.js`).sounds) for (const p of s.phrases) jobs.push([`${part}/sounds`, `${p.n}.m4a`, p.text, part === 'phrases' ? 150 : 160]);
const own = dir => { try { return new Set(fs.readFileSync(path.join(root, dir.split('/')[0], 'sounds', 'OWN.txt'), 'utf8').split('\n').map(l => l.trim()).filter(Boolean)); } catch { return new Set(); } };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'voice-')); let made = 0, kept = 0;
for (const [dir, file, text, rate] of jobs) {
  if (ONLY && !dir.startsWith(ONLY)) continue;
  const target = path.join(root, dir, file);
  if (own(dir).has(path.basename(file)) || (!ALL && fs.existsSync(target))) { kept++; continue; }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const aiff = path.join(tmp, 'say.aiff');
  execFileSync('say', ['-v', VOICE, '-r', String(rate), '-o', aiff, text]);
  // Trim the silence at both ends, keep a short pause, mono AAC.
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,adelay=120:all=1,apad=pad_dur=0.15', '-ac', '1', '-ar', '44100', '-c:a', 'aac', '-b:a', '64k', target]);
  if (++made % 100 === 0) console.log(`${made} made…`);
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${made} recordings made with ${VOICE}, ${kept} kept.`);
