/* The app's voice until real recordings are added: the device's own General American English speech synthesis.
   Every part asks for a word, phrase, sentence or story line by its text; a slower, clear rate suits young children.
   say() resolves when speaking ends (or at once when the device has no English voice). */
window.ArticulationVoice = (() => {
  const synth = window.speechSynthesis;
  const LIKED = ['Samantha', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Allison', 'Ava', 'Alex'];
  let voice = null;
  function pick() {
    const all = synth?.getVoices?.() || [];
    const us = all.filter(entry => /^en[-_]US/i.test(entry.lang));
    voice = LIKED.map(name => us.find(entry => entry.name.includes(name))).find(Boolean) || us.find(entry => entry.localService) || us[0]
      || all.find(entry => /^en/i.test(entry.lang)) || null;
    return voice;
  }
  if (synth) { pick(); synth.addEventListener?.('voiceschanged', pick); }
  const ready = () => !!synth;
  function stop() { try { synth?.cancel(); } catch {} }
  function say(text, { rate = 0.82, pitch = 1.05 } = {}) {
    if (!synth || !text) return Promise.resolve();
    stop();
    return new Promise(resolve => {
      const line = new SpeechSynthesisUtterance(String(text));
      line.lang = 'en-US'; line.rate = rate; line.pitch = pitch;
      if (voice || pick()) line.voice = voice;
      let done = false; const finish = () => { if (!done) { done = true; clearTimeout(guard); resolve(); } };
      // Some browsers never fire 'end'; a guard based on the text length lets the game go on.
      const guard = setTimeout(finish, 1500 + String(text).length * 140);
      line.onend = finish; line.onerror = finish;
      synth.speak(line);
    });
  }
  return { ready, say, stop, voice: () => voice || pick() };
})();
