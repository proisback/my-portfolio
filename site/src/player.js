// Styled controls for the podcast page. The HTML ships a native
// <audio controls>, so the episode plays without this module; here the native
// bar is swapped for a play button, scrubber, clock and speed toggle.
const RATES = [1, 1.25, 1.5];

const clock = (sec) => {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

for (const root of document.querySelectorAll('.pod-player')) {
  const $ = (sel) => root.querySelector(sel);
  const audio = $('.pod-audio');
  const controls = $('.pod-controls');
  const play = $('.pod-play');
  const seek = $('.pod-seek');
  const now = $('.pod-now');
  // The total is the measured length printed in the HTML; browsers estimate
  // MP3 durations slightly differently, so it is never overwritten.
  const total = $('.pod-total').textContent;
  const speed = $('.pod-speed');
  const rate = $('.pod-rate');
  const error = $('.pod-error');
  let dragging = false;

  audio.controls = false;
  controls.hidden = false;

  function paint() {
    const t = audio.currentTime;
    if (!dragging) seek.value = String(Math.floor(t));
    now.textContent = clock(t);
    seek.setAttribute('aria-valuetext', `${clock(t)} of ${total}`);
  }

  function state() {
    const on = !audio.paused && !audio.ended;
    play.setAttribute('aria-label', on ? 'Pause' : 'Play');
    root.classList.toggle('is-playing', on);
    if (!on) root.classList.remove('is-loading');
  }

  function fail(e) {
    // A pause that lands before a pending play() settles rejects it: not an error.
    if (e?.name === 'AbortError') return;
    controls.hidden = true;
    error.hidden = false;
    root.classList.remove('is-playing', 'is-loading');
  }

  play.addEventListener('click', () => {
    if (!audio.paused) return audio.pause();
    if (audio.readyState < 3) root.classList.add('is-loading');
    audio.play().catch(fail);
  });

  seek.addEventListener('input', () => {
    dragging = true;
    now.textContent = clock(seek.value);
  });
  seek.addEventListener('change', () => {
    dragging = false;
    audio.currentTime = Number(seek.value);
    paint();
  });

  speed.addEventListener('click', () => {
    const next = RATES[(RATES.indexOf(audio.playbackRate) + 1) % RATES.length] || 1;
    // Both, so the rate survives the first load (which resets playbackRate).
    audio.defaultPlaybackRate = next;
    audio.playbackRate = next;
    rate.textContent = `${next}×`;
  });

  for (const ev of ['play', 'pause', 'ended']) audio.addEventListener(ev, state);
  audio.addEventListener('timeupdate', paint);
  audio.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(audio.duration)) seek.max = String(Math.ceil(audio.duration));
    paint();
  });
  audio.addEventListener('waiting', () => root.classList.add('is-loading'));
  audio.addEventListener('playing', () => root.classList.remove('is-loading'));
  audio.addEventListener('error', () => fail(audio.error));
}
