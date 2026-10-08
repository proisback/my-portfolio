// Notify-me signup: 3-layer email validation, Supabase REST insert (no SDK),
// fail-open success, and a returning-subscriber state. Also owns the small
// reveal observer and Mumbai clock for the closing sections.
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_TABLE } from './config.js';

const STORAGE_KEY = 'portfolio_notify_subscribed';
const SAVE_TIMEOUT_MS = 3500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MSG_INVALID = 'Please enter a valid email address.';
const MSG_BLOCKED = 'That looks like a placeholder domain. A real email, please?';

const BLOCKED_DOMAINS = new Set([
  'test.com', 'test.test', 'example.com', 'example.org', 'example.net',
  'mailinator.com', 'tempmail.com', 'temp-mail.org', '10minutemail.com',
  'guerrillamail.com', 'trashmail.com', 'yopmail.com', 'throwaway.email',
  'sharklasers.com', 'maildrop.cc', 'getnada.com', 'dispostable.com',
  'fakeinbox.com',
]);

const TYPO_FIX = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com', 'gmali.com': 'gmail.com', 'gmail.con': 'gmail.com',
  'gmal.com': 'gmail.com', 'gmeil.com': 'gmail.com', 'gmail.co': 'gmail.com',
  'yahho.com': 'yahoo.com', 'yaoo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'yaho.com': 'yahoo.com', 'yahoo.co': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotmail.co': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com', 'outloook.com': 'outlook.com',
  'iclod.com': 'icloud.com', 'iclould.com': 'icloud.com', 'icoud.com': 'icloud.com',
  'icloud.con': 'icloud.com',
  'protomail.com': 'protonmail.com', 'protonmai.com': 'protonmail.com',
  'liv.com': 'live.com', 'live.con': 'live.com',
};

const domainOf = (email) => {
  const at = email.lastIndexOf('@');
  return at >= 0 ? email.slice(at + 1).toLowerCase() : '';
};
const localOf = (email) => {
  const at = email.lastIndexOf('@');
  return at >= 0 ? email.slice(0, at) : email;
};
const suggestTypoFix = (email) => {
  const fixed = TYPO_FIX[domainOf(email)];
  return fixed ? `${localOf(email)}@${fixed}` : null;
};
const isPlaceholderConfig = () =>
  String(SUPABASE_URL).startsWith('YOUR_') || String(SUPABASE_ANON_KEY).startsWith('YOUR_');

const debug = (...args) => {
  try {
    console.debug('[notify]', ...args);
  } catch {
    /* no console */
  }
};

// POST the email to Supabase's REST endpoint. Never throws; resolves with
// { ok: true[, duplicate] } or { ok: false, reason }. Neither blocks the UI.
async function saveEmail(email) {
  if (isPlaceholderConfig()) return { ok: false, reason: 'no-config' };

  const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => {
      ctrl?.abort();
      resolve({ ok: false, reason: 'timeout' });
    }, SAVE_TIMEOUT_MS);
  });

  const request = (async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ email }),
        signal: ctrl?.signal,
      });
      if (res.status === 201 || res.status === 204) return { ok: true };
      if (res.status === 409) return { ok: true, duplicate: true };
      let body = null;
      try {
        body = await res.json();
      } catch {
        /* empty or non-JSON body */
      }
      if (body && (body.code === '23505' || /duplicate|unique/i.test(body.message || ''))) {
        return { ok: true, duplicate: true };
      }
      return { ok: false, reason: `http-${res.status}`, error: body };
    } catch (err) {
      return { ok: false, reason: err?.name === 'AbortError' ? 'timeout' : 'network', error: err };
    }
  })();

  try {
    return await Promise.race([request, timeout]);
  } catch (err) {
    return { ok: false, reason: 'unexpected', error: err };
  } finally {
    clearTimeout(timer);
  }
}

export function initForm() {
  try {
    initReveals();
  } catch (err) {
    // Never leave closing sections hidden behind .js .reveal.
    document.querySelectorAll('.reveal, [data-reveal]').forEach((el) => el.classList.add('is-in'));
    debug('reveal observer skipped:', err);
  }
  try {
    initClock();
  } catch {
    /* clock is decorative */
  }

  const form = document.getElementById('notify-form');
  const input = document.getElementById('notify-email');
  const errorEl = document.getElementById('notify-error');
  const submit = document.getElementById('notify-submit');
  const success = document.getElementById('notify-success');
  const already = document.getElementById('notify-already');
  if (!form || !input || !submit || !errorEl) return;

  // Returning subscriber? Hide the form, show the thank-you state.
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      form.hidden = true;
      if (already) already.hidden = false;
      return;
    }
  } catch {
    /* storage blocked: show the form, that's fine */
  }

  const setInvalid = (on) => {
    input.classList.toggle('is-error', on);
    input.setAttribute('aria-invalid', on ? 'true' : 'false');
  };
  const showError = (msg) => {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    setInvalid(true);
  };
  const clearError = () => {
    errorEl.textContent = '';
    errorEl.hidden = true;
    setInvalid(false);
  };

  // Clickable correction built from DOM nodes (never innerHTML), so a
  // malicious local part can't inject markup.
  const showTypoSuggestion = (corrected) => {
    errorEl.textContent = 'Did you mean ';
    const fix = document.createElement('a');
    fix.href = '#';
    fix.className = 'notify-typo-link';
    fix.textContent = corrected;
    fix.addEventListener('click', (e) => {
      e.preventDefault();
      input.value = corrected;
      clearError();
      input.focus();
    });
    errorEl.append(fix, document.createTextNode('?'));
    errorEl.hidden = false;
    setInvalid(true);
  };

  const markSubscribed = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const showSuccess = () => {
    form.hidden = true;
    if (!success) return;
    success.classList.add('is-visible');
    success.setAttribute('aria-hidden', 'false');
    // The focused button just disappeared; move focus so screen readers hear it.
    success.focus({ preventScroll: true });
  };

  input.addEventListener('input', () => {
    if (!errorEl.hidden) clearError();
  });

  // The last email we warned about, so a deliberate resubmit of the same
  // typo respects the visitor's choice.
  let lastWarnedEmail = '';
  let busy = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    const email = (input.value || '').trim();

    if (!EMAIL_RE.test(email)) {
      showError(MSG_INVALID);
      input.focus();
      return;
    }
    if (BLOCKED_DOMAINS.has(domainOf(email))) {
      showError(MSG_BLOCKED);
      input.focus();
      return;
    }
    const suggestion = suggestTypoFix(email);
    if (suggestion && email !== lastWarnedEmail) {
      lastWarnedEmail = email;
      showTypoSuggestion(suggestion);
      input.focus();
      return;
    }

    clearError();
    busy = true;
    submit.disabled = true;
    submit.textContent = submit.dataset.busy || 'Adding you…';
    form.setAttribute('aria-busy', 'true');

    const result = await saveEmail(email);
    if (!result.ok) debug('email not stored:', result.reason || 'unknown');
    else if (result.duplicate) debug('already subscribed');
    markSubscribed();
    form.removeAttribute('aria-busy');
    showSuccess();
  });
}

// Adds .is-in to .reveal / [data-reveal] elements in the closing sections as
// they scroll into view. Harmless if main.js adds .is-in as well.
function initReveals() {
  const els = document.querySelectorAll(
    ['#principles', '#sites', '#contact', '.footer']
      .map((s) => `${s} .reveal, ${s} [data-reveal]`)
      .join(', ')
  );
  if (!els.length) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' }
  );
  els.forEach((el) => io.observe(el));
}

// Live Mumbai time on the Arrivals header. The HTML says "IST, UTC+5:30".
function initClock() {
  const el = document.getElementById('contact-clock');
  if (!el) return;
  let fmt;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return;
  }
  const tick = () => {
    el.textContent = `${fmt.format(new Date())} IST`;
  };
  tick();
  setInterval(tick, 20000);
}
