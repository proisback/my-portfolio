document.addEventListener('DOMContentLoaded', function () {

  // ===== 1. Nav scroll — add background when scrolled =====

  var nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ===== 2. Mobile hamburger toggle =====

  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });

  // ===== 3. Expandable cards =====

  document.querySelectorAll('.expandable-card').forEach(function (card) {
    var header = card.querySelector('.card-header');
    var body = card.querySelector('.card-body');
    var toggleText = card.querySelector('.card-toggle-text');
    var closedLabel = toggleText.textContent;

    function toggle() {
      var isOpen = header.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        // Collapse: set explicit height first, then transition to 0
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(function () {
          body.style.maxHeight = '0';
        });
        header.setAttribute('aria-expanded', 'false');
        toggleText.textContent = closedLabel;
      } else {
        // Close sibling cards in the same section (accordion)
        var section = card.closest('.section-inner');
        if (section) {
          section.querySelectorAll('.expandable-card').forEach(function (sibling) {
            if (sibling !== card && sibling.querySelector('.card-header').getAttribute('aria-expanded') === 'true') {
              var sibBody = sibling.querySelector('.card-body');
              var sibToggle = sibling.querySelector('.card-toggle-text');
              sibBody.style.maxHeight = sibBody.scrollHeight + 'px';
              requestAnimationFrame(function () {
                sibBody.style.maxHeight = '0';
              });
              sibling.querySelector('.card-header').setAttribute('aria-expanded', 'false');
              sibToggle.textContent = sibToggle.dataset.closedLabel;
            }
          });
        }

        // Expand this card
        header.setAttribute('aria-expanded', 'true');
        toggleText.textContent = 'Collapse';
        body.style.maxHeight = body.scrollHeight + 'px';

        body.addEventListener('transitionend', function handler() {
          if (header.getAttribute('aria-expanded') === 'true') {
            body.style.maxHeight = 'none';
          }
          body.removeEventListener('transitionend', handler);
        });
      }
    }

    // Store closed label for accordion reset
    toggleText.dataset.closedLabel = closedLabel;

    header.addEventListener('click', function (e) {
      // Don't toggle card when clicking an external link inside the header
      if (e.target.closest('a')) return;
      toggle();
    });
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a')) return;
        e.preventDefault();
        toggle();
      }
    });
  });

  // ===== 3.5. "Show more builds" toggle in Projects =====

  var moreBuildsToggle = document.getElementById('more-builds-toggle');
  var moreBuildsRegion = document.getElementById('more-builds');

  if (moreBuildsToggle && moreBuildsRegion) {
    var labelEl = moreBuildsToggle.querySelector('.more-builds-toggle-text');
    var openLabel = 'Hide additional case studies';
    var closedLabel = labelEl.textContent;

    moreBuildsToggle.addEventListener('click', function () {
      var isOpen = moreBuildsToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        moreBuildsRegion.setAttribute('hidden', '');
        moreBuildsToggle.setAttribute('aria-expanded', 'false');
        labelEl.textContent = closedLabel;
      } else {
        moreBuildsRegion.removeAttribute('hidden');
        moreBuildsToggle.setAttribute('aria-expanded', 'true');
        labelEl.textContent = openLabel;
      }
    });
  }

  // ===== 4. Scroll reveal =====

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -60px 0px'
    });

    function mark(el, cls, stagger) {
      if (!el) return;
      el.classList.add(cls);
      if (stagger) el.classList.add('stagger-' + stagger);
      revealObserver.observe(el);
    }

    // Section headers: label slides from left, title fades up with delay
    document.querySelectorAll('.section-inner').forEach(function (inner) {
      mark(inner.querySelector('.section-label'), 'reveal-left');
      var title = inner.querySelector('.section-title');
      if (title) { mark(title, 'reveal', 1); }
    });

    // Cards: staggered fade up
    document.querySelectorAll('.section-inner').forEach(function (inner) {
      inner.querySelectorAll('.card').forEach(function (card, i) {
        mark(card, 'reveal', Math.min(i + 1, 5));
      });
    });

    // Principles: staggered fade up
    document.querySelectorAll('.principle').forEach(function (el, i) {
      mark(el, 'reveal', Math.min(i + 1, 5));
    });

    // Testimonials: scale-up variant, staggered
    document.querySelectorAll('.testimonial').forEach(function (el, i) {
      mark(el, 'reveal-scale', Math.min(i + 1, 4));
    });

    // Philosophy lead
    mark(document.querySelector('.philosophy-lead'), 'reveal', 2);

    // Story paragraphs: staggered
    document.querySelectorAll('.story-content p').forEach(function (el, i) {
      mark(el, 'reveal', Math.min(i + 1, 6));
    });

    // Looking-for paragraphs: staggered
    document.querySelectorAll('.looking-for-content p').forEach(function (el, i) {
      mark(el, 'reveal', Math.min(i + 1, 5));
    });

    // Contact items: staggered
    document.querySelectorAll('.contact-item').forEach(function (el, i) {
      mark(el, 'reveal', Math.min(i + 1, 4));
    });

    // Contact section header
    var contactInner = document.querySelector('#contact .section-inner');
    if (contactInner) {
      mark(contactInner.querySelector('.section-label'), 'reveal-left');
      mark(contactInner.querySelector('.section-title'), 'reveal', 1);
    }

    // Timeline items: slide-left reveal with stagger
    document.querySelectorAll('.timeline-item').forEach(function (el, i) {
      mark(el, 'reveal-left', Math.min(i + 1, 5));
    });

    // Timeline progress fill — marigold line that grows down the timeline as
    // each item enters the viewport. Reuses IntersectionObserver pattern.
    var timelineEl = document.querySelector('.timeline');
    var timelineProgress = timelineEl && timelineEl.querySelector('.timeline-progress');
    var timelineItems = timelineEl ? timelineEl.querySelectorAll('.timeline-item') : [];
    if (timelineEl && timelineProgress && timelineItems.length > 0) {
      var revealedCount = 0;
      var total = timelineItems.length;
      var timelineProgressObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealedCount++;
            timelineProgress.style.setProperty('--progress', (revealedCount / total).toFixed(3));
            timelineProgressObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4, rootMargin: '0px 0px -40px 0px' });
      timelineItems.forEach(function (item) { timelineProgressObserver.observe(item); });
    }
  }

  // ===== 4.5. Mailto click — copy email + toast =====
  // mailto: links silently fail on machines without a default mail client
  // (many Chromebooks / Windows machines where Gmail-web is the primary).
  // We still let mailto fire for people who DO have a client configured,
  // but we also copy the address to clipboard and show a toast so a click
  // is never a dead end.
  var toastEl = document.getElementById('toast');
  var toastTextEl = toastEl ? toastEl.querySelector('.toast-text') : null;
  var toastTimer;

  function showToast(msg) {
    if (!toastEl || !toastTextEl) return;
    toastTextEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2400);
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var href = link.getAttribute('href') || '';
      var email = href.replace(/^mailto:/i, '').split('?')[0];
      if (!email) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showToast('Email copied — ' + email);
        }).catch(function () {
          showToast(email);
        });
      } else {
        showToast(email);
      }
      // Don't preventDefault — mailto: still opens a client if one exists.
    });
  });

  // ===== 4.6. Comic Story Reader =====
  // 9-page origin comic, collapsed by default. Simple, mobile-safe version:
  // single image element swaps src on page change with a brief opacity fade.
  // Touch swipes (one-finger horizontal, >50px) trigger page changes.
  (function () {
    var toggle    = document.getElementById('comic-toggle');
    var reader    = document.getElementById('comic-reader');
    var track     = document.getElementById('comic-pages-track');
    var pageImg   = document.getElementById('comic-page');
    var prevBtn   = document.getElementById('comic-prev');
    var nextBtn   = document.getElementById('comic-next');
    var counter   = document.getElementById('comic-counter');
    var endBlk    = document.getElementById('comic-end');
    var skipLink  = document.getElementById('comic-skip');
    var dots      = document.querySelectorAll('.comic-dot');
    if (!toggle || !reader || !track || !pageImg) return;

    var TOTAL = 9;
    var SWIPE_MIN_PX = 50;
    var current = 1;
    var preloaded = {};

    // Per-page alt text — describes what's visible in each page (good for
    // screen readers and SEO crawlers).
    var ALT_TEXTS = [
      '',
      'Comic page 1 of 9: The City of Friction — Prateek walks through a city of broken systems where users struggle with endless form fields, forgotten passwords, 60-minute support queues, and managers drowning in five open spreadsheets.',
      'Comic page 2 of 9: The Notebook — Prateek catalogues recurring pain points across nine sticky notes, then discovers AI as a potential helper and decides the first step is to start with users.',
      'Comic page 3 of 9: First Rule — Prateek and his AI sidekick go out to listen, interviewing a delivery rider, an office manager, a shop owner, a student, and a parent, learning that people don’t need more features, they need less friction.',
      'Comic page 4 of 9: From Chaos to Clarity — Prateek maps a problem-to-solution-to-impact framework on a whiteboard, then works through journey mapping, ruthless prioritization, and persona-based design for three real users.',
      'Comic page 5 of 9: The Giant Knot — Prateek examines a tangled mass of forms, approvals, tickets, and data silos, then works through four steps: observe everything, question assumptions, find the leverage, and pull the one thread that unravels the rest.',
      'Comic page 6 of 9: First Product — Prateek picks one painful workflow, designs a simple solution, builds the minimum viable version, tests it with real users, iterates, and ships Version 0.1 — just enough to help.',
      'Comic page 7 of 9: Launch Day — Prateek ships quietly with no marketing, faces silence and zero sign-ups, then gets one user who says the tool saved her time — and treats that single win as enough reason to keep building.',
      'Comic page 8 of 9: Epilogue — Prateek looks out over a city where users save time, teams move faster, and businesses grow, with a reminder that small is not a limitation, it’s a starting point.',
      'Comic page 9 of 9: Final epilogue — Prateek works late into the night as the impact spreads, the team grows, the product evolves, and the mission stays constant: human purpose, AI leverage, and beginning again every time a new problem arrives.'
    ];

    function preload(page) {
      if (page < 1 || page > TOTAL || preloaded[page]) return;
      var img = new Image();
      img.src = 'images/comic-story/' + page + '.webp';
      preloaded[page] = true;
    }

    function render(page) {
      if (page < 1 || page > TOTAL || page === current) return;
      current = page;

      var newSrc = 'images/comic-story/' + page + '.webp';
      pageImg.alt = ALT_TEXTS[page] || ('Comic page ' + page + ' of ' + TOTAL);
      pageImg.classList.add('is-loading');
      pageImg.src = newSrc;
      // If already cached, image is `complete` synchronously — clear the fade.
      if (pageImg.complete && pageImg.naturalWidth > 0) {
        pageImg.classList.remove('is-loading');
      }

      updateChrome(page);
      preload(page - 1);
      preload(page + 1);
    }

    // Update everything that's not the comic image itself: counter, dots,
    // disabled state on prev/next, end-block visibility, skip-link visibility.
    function updateChrome(page) {
      counter.textContent = 'Page ' + page + ' of ' + TOTAL;
      prevBtn.disabled = (page === 1);
      nextBtn.disabled = (page === TOTAL);

      if (page === TOTAL) {
        endBlk.removeAttribute('hidden');
        if (skipLink) skipLink.setAttribute('hidden', '');
      } else {
        endBlk.setAttribute('hidden', '');
        if (skipLink) skipLink.removeAttribute('hidden');
      }

      dots.forEach(function (dot) {
        var p = parseInt(dot.getAttribute('data-page'), 10);
        var active = (p === page);
        dot.classList.toggle('is-active', active);
        if (active) dot.setAttribute('aria-current', 'page');
        else dot.removeAttribute('aria-current');
      });
    }

    // Loading-state cleanup.
    pageImg.addEventListener('load',  function () { pageImg.classList.remove('is-loading'); });
    pageImg.addEventListener('error', function () { pageImg.classList.remove('is-loading'); });

    prevBtn.addEventListener('click', function () { render(current - 1); });
    nextBtn.addEventListener('click', function () { render(current + 1); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        render(parseInt(dot.getAttribute('data-page'), 10));
      });
    });

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      var label = toggle.querySelector('.comic-toggle-text');
      if (isOpen) {
        reader.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'Read the story';
      } else {
        reader.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Hide the story';
        updateChrome(current);
        preload(current + 1);
      }
    });

    // Keyboard navigation when focus is inside the reader.
    reader.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        render(current - 1); e.preventDefault();
      } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        render(current + 1); e.preventDefault();
      }
    });

    // Simple swipe — one-finger horizontal swipe on the track turns the page.
    // No drag-tracking, no preventDefault — the browser handles all native
    // scroll/zoom behavior, which keeps mobile reliable.
    var touchStartX = 0, touchStartY = 0, touchActive = false;
    track.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { touchActive = false; return; }
      touchActive = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (!touchActive || e.changedTouches.length !== 1) return;
      touchActive = false;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0 && current < TOTAL) render(current + 1);
      else if (dx > 0 && current > 1) render(current - 1);
    }, { passive: true });
  })();

  // ===== 5. Active nav link on scroll =====

  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
});
