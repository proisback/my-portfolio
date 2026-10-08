import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/flight.css';
import './styles/board.css';
import './styles/sections.css';

import { initBoard } from './board.js';
import { initForm } from './form.js';
import { initJourney } from './journey.js';
import { detectTier } from './tier.js';

const root = document.documentElement;
root.classList.add('js');
const tier = detectTier();
root.dataset.tier = tier;

initJourney();
initBoard();
initForm();

const stage = document.getElementById('stage');
const journey = document.getElementById('journey');
const canvas = document.getElementById('scene');
const veil = stage?.querySelector('.stage-veil');

function startFallback(animate) {
  root.dataset.tier = animate ? 'lite' : 'static';
  import('./fallback2d.js')
    .then((m) => m.startFallback({ stage, journey, animate }))
    .catch((err) => console.debug('[fallback] failed to load', err));
}

// The 3D waits until the page has painted and the main thread is idle, so it
// never delays the first read.
function whenIdle(fn) {
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 250));
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
}

if (stage && journey && canvas) {
  if (tier === 'full' || tier === 'mobile') {
    whenIdle(() => {
      import('./flight/index.js')
        .then((m) => {
          window.__flight = m.startFlight({ tier, canvas, stage, journey, veil, onFail: () => startFallback(true) });
        })
        .catch((err) => {
          console.debug('[flight] failed to start', err);
          startFallback(true);
        });
    });
  } else {
    startFallback(tier === 'lite');
  }
}
