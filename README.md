# Speech Sounds

English (General American) articulation practice for children aged 3 to 6, by Ahmad Ghanem (speech and language pathology), from assessment to treatment. Built from the Arabic articulation app (`speech-sound-arctic-`) and linked to the clinic reports page like the other speech apps.

- **Speech sound test** (`test/`): every consonant in the places it occurs (beginning, middle, end), s-, l- and r-blends, and connected-speech sentences. Scored right, another sound, left out or distorted; the results show the sounds by place, the error patterns (velar fronting, stopping, gliding, cluster reduction, final consonant deletion…), the sounds expected by the child's age (Crowe & McLeod, 2020) and connected speech, and make the therapy plan in one tap. An informal screener, not a standardized test.
- **Therapy plan** (`plan/`) and the intervention plan window (goals with 20/40/60/80%, ready plans, PDF): one plan, made from the test, followed by every part. Each sound climbs syllables → words → phrases → sentences → stories; patterns get minimal pairs, multiple oppositions or cycles.
- **Parts**: syllables (`syllable/`, the syllable train: CV, VC, VCV with ah, ee, oo), words (`words/`, the word island game: 24 consonants and three blend groups), phrases, sentences, stories, approaches.
- **Reports** (`reports/`), the sticker album (`stickers/`), today's sessions on the home page.

Audio: until recordings are added, the device's English voice (speech synthesis) says every word, syllable, phrase, sentence and story page. The recording list with file names is `docs/recordings.pdf` (`node scripts/recordings.cjs --pdf`).

Everything runs in the browser; child progress stays on the device and reaches the clinic reports page through the shared clinic files. Published with GitHub Pages by `.github/workflows/pages.yml`.

Builds and checks:
- `node scripts/english-layer.cjs`: English copies (`assets/*.en.js`) of the five shared clinic files, which stay identical to the other apps' copies.
- `node scripts/build-offline.cjs` and `node words/scripts/build-pwa.cjs`: the offline lists, after changing files.
- `node tests/browser.cjs` (Playwright; set `APP_PLAYWRIGHT` to its folder): opens every page and plays the test and each part in Chromium.
