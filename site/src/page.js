// Entry for the generated pages (work/<slug>/, read/, comic/).
// The boarding pass entrance is pure CSS (work.css) so it plays before this
// module loads; this file only adds reveal-on-scroll.
import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/work.css';
import './styles/read.css';

const root = document.documentElement;
const items = [...document.querySelectorAll('.reveal')];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window);

// Anything already on screen (or scrolled past via a deep link) shows at once,
// so nothing visible blinks out when the `js` class lands.
for (const el of items) if (still || el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in');
root.classList.add('js');

if (!still) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  for (const el of items) if (!el.classList.contains('is-in')) io.observe(el);
}
