/* The English speech sound test: one child, one picture at a time, scored by the therapist; the results page shows the
   sounds by place in the word, the error patterns (assets/therapy.js patternsOf), the sounds expected by the child's
   age, connected speech, and makes the therapy plan (ArticulationTherapy.create → plan/).
   Tests are kept per shared child id in english-artic-tests-v1:
   { schema: 1, children: { [childId]: [{ id, created, date, birth, examiner, at, items: { [itemId]: { status, said?, mode } },
     sentences: { [id]: { errors: [soundId], done: true } } }] } }
   status: correct | substitution (said: sound id) | omission | distortion | skip. assets/results.js reads the same store. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const Children = window.ArticulationChildren, T = window.ArticulationTherapy, Art = window.ArticulationArt, Voice = window.ArticulationVoice;
  const { items, SENTENCES, AGE, AGE_GUIDE, LIKELY } = window.SoundTestItems;
  const KEY = 'english-artic-tests-v1';
  const steps = [...items.map(item => ({ type: item.kind, item })), ...SENTENCES.map(sentence => ({ type: 'sentence', sentence }))];
  const ZONE = { first: 'Beginning', middle: 'Middle', last: 'End' };
  const read = () => { try { const data = JSON.parse(localStorage.getItem(KEY)); if (data?.schema === 1 && data.children) return data; } catch {} return { schema: 1, children: {} }; };
  const write = data => { try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { toast('Could not save on this device.'); return false; } };
  const today = () => T.today();
  const ipa = id => `/${T.IPA[id]}/`;
  const label = id => T.BLENDS.includes(id) ? T.NAMES[id] : `${T.display(id)} ${ipa(id)}`;
  let toastTimer = 0;
  function toast(text) { const box = $('toast'); box.textContent = text; box.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { box.hidden = true; }, 2600); }

  /* ---------- The child and their tests ---------- */
  const child = () => Children.active();
  const testsOf = id => read().children[id] || [];
  function saveTest(test) {
    const data = read(), list = data.children[test.child] ||= [], i = list.findIndex(entry => entry.id === test.id);
    test.at = new Date().toISOString();
    if (i < 0) list.push(test); else list[i] = test;
    write(data);
    try { window.ArticulationClinic?.summarize?.(test.child); } catch {}
  }
  let current = null, index = 0;

  function drawStart() {
    const kid = child();
    $('child-name').textContent = kid ? kid.name : 'No child chosen';
    $('choose-child').textContent = kid ? 'Change child' : 'Choose a child';
    $('begin').disabled = !kid;
    $('f-date').value ||= today();
    const last = kid ? testsOf(kid.id).at(-1) : null;
    if (last && !$('f-birth').value) $('f-birth').value = last.birth || '';
    if (last && !$('f-examiner').value) $('f-examiner').value = last.examiner || '';
    $('count-words').textContent = items.filter(i => i.kind === 'word').length;
    $('count-blends').textContent = items.filter(i => i.kind === 'blend').length;
    $('count-sentences').textContent = SENTENCES.length;
    const list = kid ? testsOf(kid.id).slice().reverse() : [];
    $('history-card').hidden = !list.length;
    $('history').replaceChildren(...list.map(test => {
      const li = document.createElement('li'), scored = Object.values(test.items).filter(v => v.status !== 'skip').length;
      li.innerHTML = `<b>${formatDate(test.date)}</b><span class="muted small">${scored} of ${items.length} scored</span>`;
      const open = Object.assign(document.createElement('button'), { type: 'button', className: 'secondary', textContent: 'Results' });
      open.onclick = () => { current = test; showReport(); };
      const go = Object.assign(document.createElement('button'), { type: 'button', className: 'secondary', textContent: 'Continue' });
      go.onclick = () => { current = test; index = firstOpen(test); showRun(); };
      li.append(go, open); return li;
    }));
    show('start');
  }
  const formatDate = iso => { try { return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${iso}T12:00:00`)); } catch { return iso; } };
  function show(id) { for (const page of ['start', 'run', 'report']) $(page).hidden = page !== id; window.scrollTo(0, 0); }

  /* ---------- Accounts (the standard window; assets/clinic.js fills its markup) ---------- */
  function drawList() {
    $('child-name').value = '';
    window.SuiteAccounts.render($('account-list'), Children.list(), kid => {
      const select = document.createElement('button'); select.type = 'button'; select.onclick = () => { Children.choose(kid.id); $('accounts').close(); current = null; drawStart(); };
      return window.SuiteAccounts.row(kid, select);
    });
  }
  async function openAccounts() {
    if (child() && window.ChildAccountGate && !await window.ChildAccountGate.request()) return;
    drawList(); $('accounts').showModal();
  }
  $('account').onclick = () => void openAccounts();
  $('choose-child').onclick = () => void openAccounts();
  document.addEventListener('submit', event => {
    if (event.target.id !== 'account-form') return;
    event.preventDefault();
    const input = event.target.querySelector('#child-name'), name = input.value.trim(), error = $('account-error');
    if (!name) { if (error) { error.textContent = 'Type the child’s name first.'; error.hidden = false; } input.focus(); return; }
    Children.choose(Children.add(name).id); $('accounts').close(); current = null; drawStart();
  });
  document.addEventListener('click', event => { const close = event.target.closest('[data-close]'); if (close) close.closest('dialog')?.close(); });

  /* ---------- Running the test ---------- */
  $('new-test').addEventListener('submit', event => {
    event.preventDefault();
    const kid = child(); if (!kid) { void openAccounts(); return; }
    current = { id: Date.now().toString(36), child: kid.id, created: new Date().toISOString(), date: $('f-date').value || today(), birth: $('f-birth').value || '', examiner: $('f-examiner').value.trim(), items: {}, sentences: {} };
    saveTest(current); index = 0; showRun();
  });
  const firstOpen = test => { const i = steps.findIndex(step => step.type === 'sentence' ? !test.sentences[step.sentence.id]?.done : !test.items[step.item.id]); return i < 0 ? steps.length - 1 : i; };
  let mode = 'named';
  function showRun() { show('run'); drawStep(); }
  function drawStep() {
    const step = steps[index], sentence = step.type === 'sentence';
    $('word-card').hidden = sentence; $('sentence-card').hidden = !sentence; $('scores').hidden = sentence; $('skip').hidden = sentence;
    $('section-name').textContent = step.type === 'word' ? 'Words' : step.type === 'blend' ? 'Blends' : 'Sentences';
    $('progress-text').textContent = `${index + 1} / ${steps.length}`;
    $('progress-fill').style.width = `${(index + 1) / steps.length * 100}%`;
    $('prev').disabled = index === 0;
    $('next').querySelector('span').textContent = index === steps.length - 1 ? 'Done' : 'Next';
    if (sentence) {
      const s = step.sentence, saved = current.sentences[s.id] || { errors: [] };
      $('sentence').textContent = s.text;
      $('sentence-targets').replaceChildren(...s.targets.map(id => {
        const b = document.createElement('button'); b.type = 'button'; b.innerHTML = `${T.display(id)}<small>${T.BLENDS.includes(id) ? 'blends' : ipa(id)}</small>`;
        b.setAttribute('aria-pressed', String(saved.errors.includes(id))); b.setAttribute('aria-label', `${label(id)} in error`);
        b.onclick = () => { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); };
        return b;
      }));
      return;
    }
    const item = step.item, saved = current.items[item.id];
    $('target-sound').textContent = label(item.sound);
    $('target-place').textContent = step.type === 'blend' ? 'Blend' : ZONE[item.zone];
    $('picture').src = Art.objectURI(item.art); $('picture').alt = item.word;
    $('word').textContent = item.spoken;
    mode = saved?.mode || 'named';
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    document.querySelectorAll('.score').forEach(b => {
      const on = saved?.status === b.dataset.status; b.setAttribute('aria-pressed', String(on));
      const note = b.querySelector('small'); if (note) note.remove();
      if (on && saved.status === 'substitution' && saved.said) b.append(Object.assign(document.createElement('small'), { textContent: `said ${T.display(saved.said)}` }));
    });
  }
  function keepSentence() {
    const step = steps[index]; if (step.type !== 'sentence') return;
    const chips = [...$('sentence-targets').children], errors = step.sentence.targets.filter((id, i) => chips[i]?.getAttribute('aria-pressed') === 'true');
    current.sentences[step.sentence.id] = { errors, done: true };
    saveTest(current);
  }
  function go(delta) {
    keepSentence();
    if (index + delta >= steps.length) { showReport(); return; }
    index = Math.max(0, Math.min(steps.length - 1, index + delta)); drawStep();
  }
  function score(status, said) {
    const item = steps[index].item;
    current.items[item.id] = { status, ...(said ? { said } : {}), mode };
    saveTest(current);
    drawStep();
    setTimeout(() => go(1), 260);
  }
  document.querySelectorAll('.score').forEach(b => b.onclick = () => b.dataset.status === 'substitution' ? pickSound() : score(b.dataset.status));
  document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
    mode = b.dataset.mode; document.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const saved = current.items[steps[index].item.id]; if (saved) { saved.mode = mode; saveTest(current); }
  });
  $('skip').onclick = () => score('skip');
  $('prev').onclick = () => go(-1);
  $('next').onclick = () => go(1);
  $('finish').onclick = () => { keepSentence(); showReport(); };
  $('hear').onclick = () => { const item = steps[index].item; void Voice?.say(item.spoken); };
  $('hear-sentence').onclick = () => void Voice?.say(steps[index].sentence.text, { rate: 0.85 });

  /* The substitution picker: likely sounds first, then every consonant (blends: the single consonant said). */
  function pickSound() {
    const item = steps[index].item, consonants = T.SOUND_IDS.filter(id => !T.BLENDS.includes(id));
    const likely = item.kind === 'blend' ? [...new Set(item.word.slice(0, 2).split('').map(letter => ({ c: 'k', g: 'g', p: 'p', b: 'b', t: 't', d: 'd', f: 'f', s: 's' }[letter])).filter(Boolean))].concat(['w'])
      : (LIKELY[item.sound] || []).filter(Boolean);
    const chip = (id, big) => {
      const b = document.createElement('button'); b.type = 'button'; b.innerHTML = `${T.display(id)}<small>${ipa(id)}</small>`; b.setAttribute('aria-label', `Said ${label(id)}`);
      b.onclick = () => { $('pick-sound').close(); score('substitution', id); };
      return b;
    };
    $('pick-likely').replaceChildren(...likely.map(id => chip(id, true)));
    $('pick-all').replaceChildren(...consonants.filter(id => id !== item.sound && !likely.includes(id)).map(id => chip(id)));
    $('pick-sound').showModal();
  }

  /* ---------- Results ---------- */
  const ageOf = test => {
    if (!test.birth) return null;
    const b = new Date(`${test.birth}T12:00:00`), d = new Date(`${test.date}T12:00:00`);
    let months = (d.getFullYear() - b.getFullYear()) * 12 + d.getMonth() - b.getMonth(); if (d.getDate() < b.getDate()) months--;
    return months >= 0 ? months : null;
  };
  const ageText = months => `${Math.floor(months / 12)};${months % 12}`;
  const valueOf = entry => !entry || entry.status === 'skip' ? null : entry.status === 'correct' ? 'ok' : entry.status === 'omission' ? 'omitted' : entry.status === 'distortion' ? 'distorted' : entry.said || 'distorted';
  /* The hand-over shape for the plan engine: each sound with initial, medial and final. A blend group's value is its
     first error (or ok when every word was right). */
  function handover(test) {
    const sounds = {};
    for (const item of items) {
      const value = valueOf(test.items[item.id]); if (value === null) continue;
      const entry = sounds[item.sound] ||= { letter: item.sound, initial: null, medial: null, final: null }, key = { first: 'initial', middle: 'medial', last: 'final' }[item.zone];
      if (item.kind === 'blend') { if (entry.initial === null || entry.initial === 'ok') entry.initial = value; }
      else entry[key] = value;
    }
    return { v: 1, date: test.date, assessment: test.id, source: 'test', child: { name: child()?.name || '' }, sounds: Object.values(sounds) };
  }
  function showReport() {
    const test = current, kid = Children.list().find(c => c.id === test.child), hand = handover(test), months = ageOf(test);
    const scored = items.filter(item => valueOf(test.items[item.id]) !== null), right = scored.filter(item => test.items[item.id].status === 'correct');
    const errorSounds = hand.sounds.filter(s => ['initial', 'medial', 'final'].some(k => s[k] && s[k] !== 'ok'));
    const patterns = T.patternsOf(hand.sounds);
    const cell = (sound, value) => value == null ? '<span class="na">–</span>' : value === 'ok' ? '<span class="ok">✓</span>'
      : `<span class="err">${value === 'omitted' ? 'left out' : value === 'distorted' ? 'distorted' : `said ${T.display(value)}`}</span>`;
    const rows = T.SOUND_IDS.filter(id => hand.sounds.some(s => s.letter === id)).map(id => {
      const s = hand.sounds.find(x => x.letter === id);
      return `<tr><td>${label(id)}</td><td>${cell(id, s.initial)}</td><td>${T.BLENDS.includes(id) ? '' : cell(id, s.medial)}</td><td>${T.BLENDS.includes(id) ? '' : cell(id, s.final)}</td></tr>`;
    }).join('');
    const expected = [], developing = [];
    if (months != null) for (const s of errorSounds) (months >= AGE[s.letter] * 12 ? expected : developing).push(s.letter);
    const ageNote = id => `${label(id)} <span class="muted small">(by ${AGE[id]}${AGE_GUIDE.has(id) ? ', guide' : ''})</span>`;
    const sentenceRows = SENTENCES.filter(s => test.sentences[s.id]?.done).map(s => {
      const errors = test.sentences[s.id].errors;
      return `<li>${s.text} ${errors.length ? `<span class="err">· ${errors.map(id => T.display(id)).join(', ')} in error</span>` : '<span class="ok">· all target sounds right</span>'}</li>`;
    }).join('');
    const onlyInSpeech = [...new Set(SENTENCES.flatMap(s => test.sentences[s.id]?.errors || []))].filter(id => !errorSounds.some(e => e.letter === id));
    const imitated = scored.filter(item => test.items[item.id].mode === 'imitated').length;
    $('report-body').innerHTML = `
      <section class="card r-head"><div><p class="kicker">Speech sound test · General American English</p><h2>${escape(kid?.name || '')}</h2>
        <p>${formatDate(test.date)}${months != null ? ` · age ${ageText(months)}` : ''}${test.examiner ? ` · ${escape(test.examiner)}` : ''}</p></div></section>
      <section class="card"><div class="stats">
        <div class="stat"><b>${scored.length ? Math.round(right.length / scored.length * 100) : 0}%</b><span>Target sounds right (${right.length} of ${scored.length})</span></div>
        <div class="stat"><b>${errorSounds.length}</b><span>Sounds in error</span></div>
        <div class="stat"><b>${patterns.length}</b><span>Error patterns</span></div></div>
        ${imitated ? `<p class="r-note">${imitated} of ${scored.length} words were said after the model, not named.</p>` : ''}</section>
      <section class="card"><h2>Sounds in words</h2>
        <table class="matrix"><thead><tr><th>Sound</th><th>Beginning</th><th>Middle</th><th>End</th></tr></thead><tbody>${rows || '<tr><td colspan="4" class="muted">Nothing scored yet.</td></tr>'}</tbody></table></section>
      <section class="card"><h2>Error patterns</h2>${patterns.length ? patterns.map(p => `<div class="pattern"><b>${p.name}</b><small>${p.examples.join(' · ')}</small></div>`).join('') : '<p class="muted">No pattern is shared by two errors or more.</p>'}
        <p class="r-note">A pattern is listed when two errors or more share it (for example, k → t and g → d for velar fronting).</p></section>
      <section class="card"><h2>Sounds and age</h2>${months == null ? '<p class="muted">Add the date of birth on the test page to compare with age expectations.</p>' : errorSounds.length ? `<div class="age-list">
        <section><h3>Expected by ${ageText(months)}</h3><p>${expected.map(ageNote).join(', ') || 'None'}</p></section>
        <section><h3>Still developing at this age</h3><p>${developing.map(ageNote).join(', ') || 'None'}</p></section></div>` : '<p class="ok">Every tested sound was right.</p>'}
        <p class="r-note">Ages by which 90% of American English-speaking children say each consonant: Crowe &amp; McLeod (2020). Blends: a general guide only.</p></section>
      <section class="card"><h2>Connected speech</h2>${sentenceRows ? `<ul class="r-sentences">${sentenceRows}</ul>${onlyInSpeech.length ? `<p class="err">In sentences only: ${onlyInSpeech.map(id => T.display(id)).join(', ')} (right in single words).</p>` : ''}` : '<p class="muted">The sentences were not given.</p>'}</section>
      <p class="r-note">An informal, criterion-referenced screener; not a standardized score or a diagnosis.</p>`;
    $('make-plan').disabled = !errorSounds.length && !patterns.length;
    show('report');
  }
  const escape = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  $('back-start').onclick = () => drawStart();
  $('resume').onclick = () => { index = firstOpen(current); showRun(); };
  $('print').onclick = () => window.print();
  $('make-plan').onclick = () => {
    try { T.create(current.child, handover(current)); location.href = '../plan/index.html'; }
    catch (error) { console.error(error); toast('Could not make the plan.'); }
  };

  window.addEventListener('storage', event => { if (event.key === Children.KEY) { Children.reload(); if (!$('start').hidden) drawStart(); } });
  drawStart();
  if (!child()) void openAccounts();
})();
