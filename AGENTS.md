# Speech Sounds (English articulation)

This repository holds the English (General American) articulation app by Ahmad Ghanem. It must never link to or depend on the main speech website; the tools site and the speech website link here, and links only go one way.

- The home page `index.html` is one app; its tiles are its parts. Every page reads left to right in English.
- `assets/`: what every part shares: the child list (`children.js`), the plan engine (`therapy.js`: sound ids, features, error patterns, mastery order, daily sessions), the clinic link (`clinic.js`), today's session (`today.js`), the side bar (`nav.js`), results for the reports page (`results.js`), the goals bank (`intervention-goals.js`) and the device voice (`voice.js`).
- Shared clinic files (`accounts.js`, `intervention.js`, `child-file.js`, `speech-sync.js`, `speech-entry.js`) are byte-identical copies of the other speech apps' files. Do not edit them here; pages load their English copies `*.en.js`, written by `node scripts/english-layer.cjs` from `scripts/english-strings.cjs`. The script fails when a shared file gains Arabic it has no English for.
- Sound ids everywhere: p b t d k g m n ng f v th dh s z sh zh ch j h w y l r, and sblends lblends rblends. `therapy.js` `WORD_ZONES` / `SYLLABLE_ZONES` say where each is practised (no NG at the start of a word, and so on).
- `test/`: the English speech sound test (`items.js` what is tested, `test.js` the screen and results). Tests are kept in `english-artic-tests-v1` by shared child id.
- `words/`: the word game; `words/assets/data.js` the word lists; drawings in `words/assets/art-*.js`, the English-only ones in `art-words-en.js`. Look at every new drawing in a browser before using it.
- `phrases/`, `sentences/`, `stories/`: content in each `assets/data.js` with a picture spec per line (composed by `phrases/assets/pictures.js`, mirrored for left-to-right reading).
- `syllable/`: the syllable train (`assets/data.js` English CV/VC/VCV); no mouth animations yet (`animations/library.js` is empty).
- `approaches/`: minimal pairs, multiple oppositions and cycles; English rhyme families in `assets/data.js`.

Audio falls back to the device voice until recordings exist; `node scripts/recordings.cjs --pdf` writes the recording list. After adding or changing files run `node scripts/build-offline.cjs` (and `node words/scripts/build-pwa.cjs` for words).

After a change, check only what changed; run the full play-through only when asked. Commit or push only when asked. No emoji anywhere. Child data stays on the device; use demo names only.
