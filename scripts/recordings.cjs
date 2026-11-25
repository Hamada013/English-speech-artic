#!/usr/bin/env node
/* The recording list: every word, syllable, phrase, sentence and story page the app says, with the file each recording
   should be saved as. Until a file is there, the device's English voice says it; once added (and the offline lists
   rebuilt), the recording plays instead.
     node scripts/recordings.cjs          writes docs/recordings.html and each part's sounds/README.txt
     node scripts/recordings.cjs --pdf    also prints docs/recordings.pdf (needs Playwright: APP_PLAYWRIGHT=<path> or npm i playwright)
   Record in a quiet room, one clear General American model per file, about half a second of silence before and after;
   save as .m4a (AAC) with the exact file name shown. A tick (✓) marks files already in place. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const load = file => { const sandbox = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox); return sandbox.window.ArticulationData; };
const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const has = file => fs.existsSync(path.join(root, file));

const parts = [];
// Words: one file per word, shared when a word is in two sounds.
{
  const data = load('words/assets/data.js'), seen = new Set(), groups = [];
  for (const sound of data.sounds) {
    const rows = [];
    for (const position of data.positions) for (const word of sound.words[position.id] || []) {
      if (seen.has(word.n)) continue; seen.add(word.n);
      rows.push({ file: `${word.n}.m4a`, text: word.word, note: position.name.replace(' of the word', ''), done: has(`words/sounds/${word.n}.m4a`) });
    }
    groups.push({ title: `${sound.name} (${sound.ipa ? `/${sound.ipa}/` : sound.letter})`, rows });
  }
  parts.push({ id: 'words', title: 'Words', folder: 'words/sounds/', groups });
}
// Syllables: a folder per consonant.
{
  const data = load('syllable/assets/data.js');
  parts.push({ id: 'syllable', title: 'Syllables', folder: 'syllable/sounds/<consonant number>/', note: 'Say each syllable as written: ah as in father, ee as in see, oo as in moon. Hyphens are a tiny pause.',
    groups: data.sounds.map((sound, s) => ({ title: `${s + 1}: ${sound.name}`, rows: Object.values(sound.words).flat().map(item => ({ file: `${s + 1}/${item.number}.m4a`, text: item.word, note: item.number <= 3 ? 'CV' : item.number <= 6 ? 'VC' : 'VCV', done: has(`syllable/${item.audio}`) })) })) });
}
// Phrases, sentences, stories: numbered in order.
for (const [id, title] of [['phrases', 'Phrases'], ['sentences', 'Sentences'], ['stories', 'Stories']]) {
  const data = load(`${id}/assets/data.js`);
  parts.push({ id, title, folder: `${id}/sounds/`, groups: data.sounds.map(sound => ({ title: `${sound.name}${sound.story ? `: ${sound.story}` : ''}`, rows: sound.phrases.map(p => ({ file: `${p.n}.m4a`, text: p.text, note: '', done: has(`${id}/sounds/${p.n}.m4a`) })) })) });
}
const total = parts.reduce((n, part) => n + part.groups.reduce((m, g) => m + g.rows.length, 0), 0);
const done = parts.reduce((n, part) => n + part.groups.reduce((m, g) => m + g.rows.filter(r => r.done).length, 0), 0);

// Each part's sounds/README.txt (plain text, for the folder itself).
for (const part of parts) {
  const dir = path.join(root, part.id === 'syllable' ? 'syllable' : part.id, 'sounds'); fs.mkdirSync(dir, { recursive: true });
  const lines = [`${part.title} recordings (General American English)`, `Save each recording in ${part.folder} under the file name shown (m4a).`, 'Until a file is there, the device voice says it. Then run: node scripts/build-offline.cjs' + (part.id === 'words' ? ' and node words/scripts/build-pwa.cjs' : '')];
  if (part.note) lines.push(part.note);
  for (const group of part.groups) { lines.push('', `=== ${group.title} ===`); for (const row of group.rows) lines.push(`${row.file} = ${row.text}${row.note ? `   (${row.note})` : ''}${row.done ? '  ✓' : ''}`); }
  fs.writeFileSync(path.join(dir, 'README.txt'), lines.join('\n') + '\n');
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Speech Sounds: recording list</title><style>
@page{size:A4;margin:14mm 12mm 16mm}
*{box-sizing:border-box}body{margin:0;font:11pt/1.35 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:#22445a}
h1{margin:0 0 4px;font-size:22pt}h2{margin:0 0 6px;font-size:16pt;color:#0284c7;break-before:page}h2.first{break-before:auto}h3{margin:12px 0 4px;font-size:11.5pt;break-after:avoid}
.lead{margin:0 0 10px;color:#5c7285}.box{padding:10px 12px;border:1px solid #dceaf4;border-radius:10px;background:#f6fafc;margin:8px 0 14px}.box p{margin:3px 0}
table{width:100%;border-collapse:collapse;font-size:10.5pt;break-inside:auto}tr{break-inside:avoid}
td,th{padding:3px 6px;border-bottom:1px solid #e6eef4;text-align:left;vertical-align:top}th{font-size:9pt;color:#5c7285;font-weight:700}
td.file{width:24mm;font-family:ui-monospace,Menlo,monospace;font-size:9.5pt;color:#0b6f80}td.say{font-weight:700;font-size:12pt}td.note{width:24mm;color:#5c7285;font-size:9pt}td.tick{width:9mm;text-align:center}
.check{display:inline-block;width:11px;height:11px;border:1.5px solid #8aa0b6;border-radius:3px}.done{color:#2f7d57;font-weight:800}
.summary{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:8px 0}.summary div{padding:6px;border-radius:8px;background:#eef6fb;text-align:center}.summary b{display:block;font-size:14pt}
</style></head><body>
<h1>Speech Sounds: recording list</h1>
<p class="lead">Every word, syllable, phrase, sentence and story page the app says, ${total} recordings in all${done ? ` (${done} done)` : ''}.</p>
<div class="box"><p><b>How to record.</b> A quiet room; one clear, natural General American model per file, at a child-friendly pace; about half a second of silence before and after.</p>
<p><b>Files.</b> Save each as .m4a (AAC) with the exact file name in the left column, in the folder named at the top of its part. Tick the box when done.</p>
<p><b>After adding files.</b> Run <code>node scripts/build-offline.cjs</code> (and <code>node words/scripts/build-pwa.cjs</code> for words). Until a file is there, the device voice says it.</p></div>
<div class="summary">${parts.map(part => `<div><b>${part.groups.reduce((m, g) => m + g.rows.length, 0)}</b>${part.title}</div>`).join('')}</div>
${parts.map((part, i) => `<h2${i ? '' : ' class="first"'}>${part.title}</h2><p class="lead">Folder: <code>${esc(part.folder)}</code>${part.note ? ` · ${esc(part.note)}` : ''}</p>
${part.groups.map(group => `<h3>${esc(group.title)}</h3><table><thead><tr><th>File</th><th>Say</th><th>${part.id === 'words' ? 'Place' : part.id === 'syllable' ? 'Type' : ''}</th><th></th></tr></thead><tbody>${group.rows.map(row => `<tr><td class="file">${esc(row.file)}</td><td class="say">${esc(row.text)}</td><td class="note">${esc(row.note)}</td><td class="tick">${row.done ? '<span class="done">✓</span>' : '<span class="check"></span>'}</td></tr>`).join('')}</tbody></table>`).join('')}`).join('\n')}
</body></html>`;
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/recordings.html'), html);
console.log(`docs/recordings.html: ${total} recordings (${done} done); sounds/README.txt in each part.`);

if (process.argv.includes('--pdf')) (async () => {
  let pw; try { pw = require(process.env.APP_PLAYWRIGHT || 'playwright'); } catch { console.error('Playwright not found: set APP_PLAYWRIGHT to its folder.'); process.exit(1); }
  const browser = await pw.chromium.launch(), page = await browser.newPage();
  await page.goto('file://' + path.join(root, 'docs/recordings.html'));
  await page.pdf({ path: path.join(root, 'docs/recordings.pdf'), format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font:8px system-ui,sans-serif;color:#8aa0b6;text-align:center">Speech Sounds · recording list · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>', margin: { top: '14mm', bottom: '16mm', left: '12mm', right: '12mm' } });
  await browser.close();
  console.log('docs/recordings.pdf written.');
})();
