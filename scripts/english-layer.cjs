#!/usr/bin/env node
/* Writes the English copies of the shared clinic files: assets/<name>.en.js from assets/<name>.js, with the
   replacements in scripts/english-strings.cjs. Run after copying a newer shared file from another app:
     node scripts/english-layer.cjs
   It stops with an error when Arabic is left outside comments and name-matching rules, so a new message in a
   shared file is never shown in Arabic by accident. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { STRINGS, CODE, KEEP } = require('./english-strings.cjs');
const ROOT = path.join(__dirname, '..'), FILES = ['accounts.js', 'intervention.js', 'child-file.js', 'speech-sync.js', 'speech-entry.js'];
const pairs = [...STRINGS].sort((a, b) => b[0].length - a[0].length);
let failed = false;
for (const name of FILES) {
  let text = fs.readFileSync(path.join(ROOT, 'assets', name), 'utf8');
  for (const [from, to] of pairs) text = text.split(from).join(to);
  for (const [from, to] of CODE) text = typeof from === 'string' ? text.split(from).join(to) : text.replace(from, to);
  const header = `/* English copy of assets/${name}, written by scripts/english-layer.cjs. Do not edit: change the shared file or scripts/english-strings.cjs. */\n`;
  const out = path.join(ROOT, 'assets', name.replace(/\.js$/, '.en.js'));
  fs.writeFileSync(out, header + text);
  let left = text; for (const rule of KEEP) left = left.replace(rule, '');
  const lines = left.split('\n').filter(line => /[؀-ۿ]/.test(line));
  if (lines.length) { failed = true; console.error(`${name}: Arabic left on ${lines.length} line(s):`); lines.slice(0, 20).forEach(line => console.error('  ' + line.trim().slice(0, 200))); }
  try { execFileSync(process.execPath, ['--check', out]); } catch { failed = true; console.error(`${name}: the English copy does not parse`); }
}
if (failed) process.exit(1);
console.log(`English copies written: ${FILES.map(name => name.replace(/\.js$/, '.en.js')).join(', ')}`);
