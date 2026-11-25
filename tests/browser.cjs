#!/usr/bin/env node
/* Opens every page of Speech Sounds in Chromium and checks: no script errors, no missing files (recordings aside), no
   Arabic on screen; then scores a short speech sound test (k→t, g→d, r→w and a left-out final s), checks the patterns
   it finds, makes the therapy plan and opens it, and plays one round in words, phrases, stories, syllables and approaches.
   Run from the repository: node tests/browser.cjs   (Playwright: APP_PLAYWRIGHT=<its folder> or npm i playwright) */
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
let pw; try { pw = require(process.env.APP_PLAYWRIGHT || 'playwright'); } catch { console.error('Playwright not found: set APP_PLAYWRIGHT to its folder.'); process.exit(1); }
const root = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
let failed = 0;
const check = (ok, what) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${what}`); if (!ok) failed++; };
server.listen(0, async () => {
  const base = `http://localhost:${server.address().port}/`;
  const browser = await pw.chromium.launch(), page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400 && !/sounds\/.+\.m4a$/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
  await page.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1');
    localStorage.clear();
    localStorage.setItem('speech-entry-v1', JSON.stringify({ therapist: true, at: Date.now() }));
    localStorage.setItem('english-artic-children-v1', JSON.stringify({ schema: 1, active: 'c1', children: [{ id: 'c1', name: 'Adam', created: '2026-11-20T10:00:00Z', character: 'boy' }], deletedChildren: {} }));
    localStorage.setItem('english-artic-therapist', 'on');
  });
  const arabic = () => page.evaluate(() => (document.body.innerText.match(/[؀-ۿ][^\n]{0,30}/g) || []).slice(0, 3));
  const open = async (url, wait = 1200) => { errors.length = 0; await page.goto(base + url); await page.waitForTimeout(wait); };

  for (const url of ['index.html', 'test/index.html', 'plan/index.html', 'reports/index.html', 'stickers/index.html', 'words/index.html', 'phrases/index.html', 'sentences/index.html', 'stories/index.html', 'syllable/syllable.html', 'approaches/index.html']) {
    await open(url);
    const left = await arabic();
    check(!errors.length && !left.length, `${url} opens in English${errors.length ? `: ${errors[0]}` : left.length ? `: ${left[0]}` : ''}`);
  }

  // The test: score every word (a few errors), skip the sentences, see the results, make the plan.
  await open('test/index.html');
  await page.fill('#f-birth', '2021-05-10');
  await page.click('#begin');
  const wrong = { 'k-first': 't', 'k-middle': 't', 'g-first': 'd', 'g-last': 'd', 'r-first': 'w', 'r-middle': 'w' };
  for (let n = 0; n < 90 && await page.isVisible('#scores'); n++) {
    const id = await page.evaluate(() => { const { items } = window.SoundTestItems, i = Number(document.getElementById('progress-text').textContent.split(' / ')[0]) - 1; return items[i]?.id; });
    if (wrong[id]) { await page.click('[data-status=substitution]'); await page.click(`#pick-sound button[aria-label^="Said ${wrong[id]} "]`); }
    else if (id === 's-last') await page.click('[data-status=omission]');
    else await page.click('[data-status=correct]');
    await page.waitForTimeout(320);
  }
  await page.click('#finish'); await page.waitForTimeout(400);
  const patterns = await page.$$eval('.pattern b', nodes => nodes.map(n => n.textContent));
  check(patterns.includes('Velar fronting') && patterns.includes('Gliding of liquids') && !patterns.includes('Final consonant deletion'), `test finds velar fronting (k→t, g→d) and gliding (r→w twice), not final deletion from one left-out s: ${patterns.join(', ')}`);
  await page.click('#make-plan'); await page.waitForTimeout(1200);
  check(page.url().endsWith('plan/index.html') && (await page.textContent('#stat-letters')).includes('k'), 'the plan is made from the test and opens');

  // One round in each part.
  for (const part of ['words', 'phrases', 'stories', 'approaches']) {
    await open(`${part}/index.html`);
    await page.click('#play').catch(() => {}); await page.waitForTimeout(800);
    const tile = await page.$('.letter-tile, .pattern-tile'); if (tile) { await tile.click(); await page.waitForTimeout(2500); }
    check(!errors.length, `${part} plays${errors.length ? `: ${errors[0]}` : ''}`);
  }
  await open('syllable/syllable.html'); await page.click('#play').catch(() => {}); await page.waitForTimeout(800);
  const syl = await page.$('.letter-tile'); if (syl) { await syl.click(); await page.waitForTimeout(2500); }
  check(!errors.length && await page.$$eval('.car', cars => cars.length) >= 3, 'syllables: the train has its cars');

  await browser.close(); server.close();
  console.log(failed ? `${failed} check(s) failed` : 'All checks passed');
  process.exit(failed ? 1 : 0);
});
