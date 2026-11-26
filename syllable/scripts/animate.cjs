// Makes the front and side mouth videos for the English syllables (General American), from the same drawings and face
// as the Arabic app, timed to a recording of each syllable. Until the therapist's recordings exist, the Mac's American
// voice (Samantha) says each syllable and its timing drives the mouth; run again after adding recordings to sounds/.
// Usage: node syllable/scripts/animate.cjs <sound id> <1-15>   e.g. p 1 for "pah"
//        node syllable/scripts/animate.cjs all                 every syllable that has no video yet
//        node syllable/scripts/animate.cjs library             only rewrites animations/library.js
//   1-3 CV (pah pee poo), 4-6 VC (op eep oop), 7-15 VCV (first vowel ah, ee, oo; second vowel ah, ee, oo), as in data.js.
// Needs ffmpeg, macOS `say`, and Playwright (APP_PLAYWRIGHT=<its folder>, or npm i playwright).
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), vm = require('node:vm'), { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'animations');
const sandbox = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/data.js'), 'utf8'), sandbox);
const Data = sandbox.window.ArticulationData;
function writeLibrary() {
  const ready = [...new Set(fs.readdirSync(out).map(name => /^([a-z]+-\d+)-front\.mp4$/.exec(name)?.[1]).filter(found => found && fs.existsSync(path.join(out, `${found}-side.mp4`))))];
  const order = Data.sounds.map(s => s.id);
  ready.sort((a, b) => { const [la, sa] = a.split('-'), [lb, sb] = b.split('-'); return order.indexOf(la) - order.indexOf(lb) || sa - sb; });
  fs.writeFileSync(path.join(out, 'library.js'), `// Written by scripts/animate.cjs: syllables that have front and side videos in this folder.\nexport const READY = ${JSON.stringify(ready)};\n`);
  return ready.length;
}
if (process.argv[2] === 'library') { console.log(`library.js: ${writeLibrary()} syllables`); process.exit(0); }
const { chromium } = require(process.env.APP_PLAYWRIGHT || 'playwright');
/* The face's mouth hold for each English sound (scripts/animation.html, CONS). */
const RIG = { p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', m: 'm', n: 'n', ng: 'ng', f: 'f', v: 'v', th: 'th', dh: 'dh', s: 's', z: 'z', sh: 'sh', zh: 'zh', ch: 'ch', j: 'j', h: 'hh', w: 'w', y: 'y', l: 'l', r: 'rE' };
const SONORANT = new Set(['m', 'n', 'ng', 'l', 'rE', 'w', 'y']);
/* The face's vowels: a (open), i (spread), u (round) = ah, ee, oo. */
const V = ['a', 'i', 'u'], FPS = 30;
/* The Mac voice: VOICE="Ava (Premium)" (System Settings → Accessibility → Read & Speak → Manage Voices); Samantha otherwise. */
const VOICE = process.env.VOICE || 'Samantha';
const items = Data.sounds.flatMap(sound => Object.values(sound.words).flat().map(item => ({ sound: sound.id, item })));

async function make(browser, soundId, n) {
  const entry = items.find(e => e.sound === soundId && e.item.number === n); if (!entry) throw Error(`No syllable ${soundId} ${n}`);
  const { item } = entry, kind = n <= 3 ? 'cv' : n <= 6 ? 'vc' : 'vcv', first = kind === 'cv' ? V[n - 1] : kind === 'vc' ? V[n - 4] : V[Math.floor((n - 7) / 3)], second = kind === 'vcv' ? V[(n - 7) % 3] : first;
  const id = item.id, own = path.join(root, item.audio), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'en-syllable-'));
  /* The recording: the therapist's when there is one, else the Mac's American voice saying the spelling. */
  let wav = path.join(tmp, 'say.wav');
  if (fs.existsSync(own)) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', own, wav]);
  else { const aiff = path.join(tmp, 'say.aiff'); execFileSync('say', ['-v', VOICE, '-r', '150', '-o', aiff, item.spoken]); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, '-ac', '1', '-ar', '44100', wav]); }
  /* Loudness and hiss in 10 ms steps. */
  const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '16000', '-f', 's16le', '-']);
  const env = [], hiss = [];
  for (let i = 0; i + 160 <= raw.length / 2; i += 160) { let sum = 0, cross = 0, last = 0; for (let j = 0; j < 160; j++) { const v = raw.readInt16LE((i + j) * 2) / 32768; sum += v * v; if (j && Math.sign(v) !== Math.sign(last)) cross++; last = v; } env.push(Math.sqrt(sum / 160)); hiss.push(cross / 160); }
  const peak = Math.max(...env) || 1, level = env.map(v => +(v / peak).toFixed(3)), sonorant = SONORANT.has(RIG[soundId]);
  const smooth = level.map((v, i) => hiss[i] < .2 ? v : 0), vowelPeak = Math.max(...smooth) || 1, loudAt = sonorant ? .65 : .5;
  let vowelAt = smooth.findIndex((v, i) => v > loudAt * vowelPeak && (smooth[i + 2] || 0) > loudAt * vowelPeak); if (vowelAt < 0) vowelAt = level.findIndex(v => v > .35);
  const onset = Math.max(0, level.findIndex(v => v > .06)) / 100, end = (level.length - 1 - [...level].reverse().findIndex(v => v > .06)) / 100, release = vowelAt / 100;
  let params, A, C;
  if (kind === 'cv') { const R = 1.3; A = R - release; C = A + end + .02; params = { r: R, f: A + onset }; }
  else {
    /* Vowel first: the consonant sits in the quietest stretch between the voiced parts, else at fixed shares of the voice. */
    const N = smooth.length, last = Math.round(end * 100), s = smooth.map((_, i) => { let sum = 0, k = 0; for (let j = i - 2; j <= i + 2; j++) if (j >= 0 && j < N) { sum += smooth[j]; k++; } return sum / k; });
    let o = smooth.findIndex((v, i) => v > .15 * vowelPeak && (smooth[i + 1] || 0) > .15 * vowelPeak); if (o < 0) o = Math.round(onset * 100);
    const span = last - o, max = (a, b) => Math.max(...s.slice(a, b + 1));
    let c = -1, r = -1, depth = 0;
    if (kind === 'vcv' || sonorant) {
      let m = -1, best = 0; for (let i = o + 6; i <= last - 6; i++) { const d = Math.min(max(o, i), max(i, last)) - s[i]; if (d > best) { best = d; m = i; } }
      if (m >= 0) { const before = max(o, m), after = max(m, last), left = s[m] + (max(Math.max(o, m - 25), m) - s[m]) / 2, right = s[m] + (Math.min(before, after) - s[m]) / 2; c = m; r = m; while (c > o && s[c - 1] < left) c--; while (r < last && s[r + 1] < right) r++; r++; depth = best / Math.max(before, after); }
    } else { let top = o, pk = 0; for (let i = o; i <= o + Math.round(span * .6); i++) if (s[i] > pk) { pk = s[i]; top = i; } c = top + 2; while (c < last && !(s[c] < .5 * pk && s[c + 1] < .5 * pk)) c++; depth = 1; }
    const bad = kind === 'vc' ? !(depth > .15 && c - o >= 6 && last - c >= 4) : !(depth > .15 && c - o >= 5 && r - c >= 3 && last - r >= 8);
    if (bad) { c = o + Math.round(span * (kind === 'vc' ? .55 : .38)); r = o + Math.round(span * .58); }
    A = Math.max(.15, .55 - o / 100); C = A + end + .02;
    params = { o: A + o / 100, n: A + c / 100, ...(kind === 'vcv' ? { r: A + r / 100 } : {}) };
  }
  const seconds = Math.ceil((C + 1.25) * 10) / 10, page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const view of ['front', 'side']) {
    const frames = fs.mkdtempSync(path.join(tmp, view));
    const query = new URLSearchParams({ mode: view, kind, cons: RIG[soundId], v: first, v2: second, a: A, c: C, ...params, env: JSON.stringify(level) });
    await page.goto('file://' + path.join(__dirname, 'animation.html') + '?' + query);
    await page.evaluate(() => window.ready);
    for (let i = 0; i < seconds * FPS; i++) { await page.evaluate(t => frame(t), i / FPS); await page.locator('svg').first().screenshot({ path: path.join(frames, `${String(i).padStart(4, '0')}.png`) }); }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%04d.png'), '-i', wav, '-filter_complex', `[0:v]scale=720:720[v];[1:a]aresample=44100,adelay=${Math.round(A * 1000)}:all=1,apad,atrim=0:${seconds}[a]`, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '30', '-preset', 'veryfast', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '64k', '-shortest', path.join(out, `${id}-${view}.mp4`)]);
  }
  await page.close(); fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`${id} ${kind} "${item.spoken}" ${seconds}s`);
}
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const todo = process.argv[2] === 'all'
    ? items.filter(({ item }) => !fs.existsSync(path.join(out, `${item.id}-side.mp4`))).map(e => [e.sound, e.item.number])
    : [[process.argv[2], Number(process.argv[3])]];
  for (const [s, n] of todo) { try { await make(browser, s, n); } catch (error) { console.error(`${s}-${n}: ${error.message}`); } }
  await browser.close();
  console.log(`library.js: ${writeLibrary()} syllables`);
})().catch(error => { console.error(error); process.exit(1); });
