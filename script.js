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
    var openLabel = 'Hide additional builds';
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
  // 9-page origin comic, collapsed by default. iBooks-style interactive page
  // turn: the front image slot tracks the user's finger during a drag,
  // sliding + tilting slightly while the next page (loaded onto the back
  // slot) is revealed underneath. Releasing past ~30% of the track width
  // commits the turn; releasing earlier springs the page back to rest.
  // Buttons / dots / keyboard drive the same final commit animation.
  (function () {
    var toggle    = document.getElementById('comic-toggle');
    var reader    = document.getElementById('comic-reader');
    var track     = document.getElementById('comic-pages-track');
    var slotA     = document.getElementById('comic-page-a');
    var slotB     = document.getElementById('comic-page-b');
    var prevBtn   = document.getElementById('comic-prev');
    var nextBtn   = document.getElementById('comic-next');
    var counter   = document.getElementById('comic-counter');
    var endBlk    = document.getElementById('comic-end');
    var skipLink  = document.getElementById('comic-skip');
    var dots      = document.querySelectorAll('.comic-dot');
    if (!toggle || !reader || !track || !slotA || !slotB) return;

    var TOTAL          = 9;
    var COMMIT_MS      = 380;          // matches CSS transition on .comic-page
    var SNAPBACK_MS    = 320;
    var COMMIT_FRAC    = 0.30;         // drag past 30% of track width to commit
    var MAX_DRAG_TILT  = 22;           // max degrees of rotateY tilt during drag
    var current        = 1;
    var slots          = [slotA, slotB];
    var frontIdx       = 0;            // which slot is currently the front (visible)
    var isAnimating    = false;
    var preloaded      = {};
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mark the initial front/back roles via class.
    slotA.classList.add('is-front');
    slotB.classList.add('is-back');

    function front() { return slots[frontIdx]; }
    function back()  { return slots[1 - frontIdx]; }

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
      img.src = 'images/comic-story/' + page + '.png';
      preloaded[page] = true;
    }

    function loadInto(img, page) {
      var newSrc = 'images/comic-story/' + page + '.png';
      img.alt = ALT_TEXTS[page] || ('Comic page ' + page + ' of ' + TOTAL);
      if (img.getAttribute('src') !== newSrc) {
        img.classList.add('is-loading');
        img.src = newSrc;
        if (img.complete && img.naturalWidth > 0) {
          img.classList.remove('is-loading');
        }
      }
    }

    // Compute the off-screen "committed" transform for a given direction.
    // direction: +1 forward (front slides off to the left, lifts/tilts up),
    //            -1 backward (front slides off to the right).
    function offTransform(direction) {
      if (direction === 1) return 'translateX(-105%) rotateY(-' + MAX_DRAG_TILT + 'deg)';
      return 'translateX(105%) rotateY(' + MAX_DRAG_TILT + 'deg)';
    }

    // Mid-drag transform — translateX tracks finger directly; rotateY scales
    // with how far you've dragged (capped at MAX_DRAG_TILT).
    function dragTransform(dx, trackWidth, direction) {
      var clampedDx = direction === 1 ? Math.min(0, dx) : Math.max(0, dx);
      var tilt = Math.max(-MAX_DRAG_TILT,
                 Math.min(MAX_DRAG_TILT,
                          (-clampedDx / trackWidth) * MAX_DRAG_TILT * 2));
      return 'translateX(' + clampedDx + 'px) rotateY(' + tilt + 'deg)';
    }

    // Stage the back slot with the incoming page (used by both buttons and
    // the start of a drag).
    function stageBack(newPage) {
      var b = back();
      loadInto(b, newPage);
      b.removeAttribute('aria-hidden');
    }

    // Clear the back slot (after a snap-back or after the role-swap).
    function clearBack() {
      var b = back();
      b.removeAttribute('src');
      b.alt = '';
      b.setAttribute('aria-hidden', 'true');
    }

    // Swap which slot is "front" / "back" — used after a successful commit.
    function swapRoles() {
      var oldFront = slots[frontIdx];
      var newFront = slots[1 - frontIdx];
      oldFront.classList.remove('is-front'); oldFront.classList.add('is-back');
      newFront.classList.remove('is-back');  newFront.classList.add('is-front');
      frontIdx = 1 - frontIdx;
    }

    // commitTurn: animate the front page off in `direction` and complete the
    // role-swap. Used by buttons, keyboard, dot jumps, and end-of-drag-past-
    // threshold. Drag-end already has the front mid-flight, so this just
    // continues the animation to the off-state.
    function commitTurn(newPage, direction) {
      if (newPage < 1 || newPage > TOTAL || newPage === current || isAnimating) return;
      if (!direction) direction = newPage > current ? 1 : -1;

      if (prefersReducedMotion) {
        loadInto(front(), newPage);
        current = newPage;
        updateChrome(newPage);
        preload(newPage - 1);
        preload(newPage + 1);
        return;
      }

      isAnimating = true;
      stageBack(newPage);
      var f = front();

      // Re-enable transition (drag handlers may have disabled it).
      f.classList.remove('no-transition');
      // Force reflow so the transition kicks in cleanly from current position.
      void f.offsetWidth;
      f.style.transform = offTransform(direction);

      setTimeout(function () {
        // Role swap. The slot that just slid off becomes the new "back",
        // ready to receive future incoming pages. The slot that was back
        // (now showing the new page in its final position) becomes "front".
        var oldFront = front();
        swapRoles();
        var nowBack = oldFront; // the slot that slid off

        // Silently reset the slot that slid off: snap to no-transform, clear.
        nowBack.classList.add('no-transition');
        nowBack.style.transform = '';
        nowBack.removeAttribute('src');
        nowBack.alt = '';
        nowBack.setAttribute('aria-hidden', 'true');

        // The new front already shows the right image (from stageBack); just
        // ensure it has no transform applied.
        var newFront = front();
        newFront.classList.add('no-transition');
        newFront.style.transform = '';
        newFront.removeAttribute('aria-hidden');

        void newFront.offsetWidth;
        nowBack.classList.remove('no-transition');
        newFront.classList.remove('no-transition');

        current = newPage;
        isAnimating = false;
        updateChrome(newPage);
        preload(newPage - 1);
        preload(newPage + 1);
      }, COMMIT_MS);
    }

    // snapBack: animate the front page back to its rest position and clear
    // the staged back. Used when user releases mid-drag without crossing
    // the commit threshold.
    function snapBack() {
      isAnimating = true;
      var f = front();
      f.classList.remove('no-transition');
      void f.offsetWidth;
      f.style.transform = '';
      setTimeout(function () {
        clearBack();
        isAnimating = false;
      }, SNAPBACK_MS);
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

    // Loading-state cleanup for both image slots.
    slots.forEach(function (img) {
      img.addEventListener('load',  function () { img.classList.remove('is-loading'); });
      img.addEventListener('error', function () { img.classList.remove('is-loading'); });
    });

    prevBtn.addEventListener('click', function () { commitTurn(current - 1, -1); });
    nextBtn.addEventListener('click', function () { commitTurn(current + 1,  1); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var p = parseInt(dot.getAttribute('data-page'), 10);
        commitTurn(p, p > current ? 1 : -1);
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
        commitTurn(current - 1, -1); e.preventDefault();
      } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        commitTurn(current + 1, 1); e.preventDefault();
      }
    });

    // ===== Touch drag — iBooks-style interactive page turn =====
    // touchstart: capture origin; nothing visible changes until first move.
    // touchmove (first horizontal motion): determine direction, stage the
    //   incoming page on the back slot, disable transitions on front so it
    //   tracks the finger 1:1.
    // touchmove (subsequent): update front transform = translateX(dx) +
    //   slight rotateY proportional to drag fraction.
    // touchend: if |dx|/trackWidth > COMMIT_FRAC → commitTurn().
    //           else → snapBack() (page springs to rest, back slot cleared).
    var drag = {
      active: false,
      direction: 0,        // 0 = unknown, ±1 set on first horizontal move
      startX: 0, startY: 0,
      trackWidth: 0,
      lastDx: 0
    };

    track.addEventListener('touchstart', function (e) {
      if (isAnimating || e.touches.length !== 1) { drag.active = false; return; }
      drag.active = true;
      drag.direction = 0;
      drag.startX = e.touches[0].clientX;
      drag.startY = e.touches[0].clientY;
      drag.trackWidth = track.offsetWidth || 1;
      drag.lastDx = 0;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      if (!drag.active || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - drag.startX;
      var dy = e.touches[0].clientY - drag.startY;

      // Decide direction on first non-trivial movement.
      if (drag.direction === 0) {
        // Vertical-dominant motion → bail, let the page scroll.
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
          drag.active = false;
          return;
        }
        if (Math.abs(dx) < 6) return; // wait for clearer intent
        drag.direction = dx < 0 ? 1 : -1;
        // At edges, no page to reveal — bail.
        var nextPage = current + drag.direction;
        if (nextPage < 1 || nextPage > TOTAL) {
          drag.active = false;
          return;
        }
        stageBack(nextPage);
        // Pivot from the spine on the appropriate side.
        front().style.transformOrigin = drag.direction === 1 ? 'left center' : 'right center';
        front().classList.add('no-transition');
      }

      drag.lastDx = dx;
      front().style.transform = dragTransform(dx, drag.trackWidth, drag.direction);

      // Once we're horizontally dragging, suppress page scroll.
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    track.addEventListener('touchend', function (e) {
      if (!drag.active) return;
      drag.active = false;
      if (drag.direction === 0) return;

      var dx = (e.changedTouches[0] ? e.changedTouches[0].clientX : drag.startX) - drag.startX;
      var fraction = Math.abs(dx) / drag.trackWidth;

      // Pull the front out of "drag mode" so the next transform animates.
      front().classList.remove('no-transition');

      if (fraction > COMMIT_FRAC) {
        commitTurn(current + drag.direction, drag.direction);
      } else {
        snapBack();
      }
      drag.direction = 0;
    });

    track.addEventListener('touchcancel', function () {
      if (!drag.active) return;
      drag.active = false;
      front().classList.remove('no-transition');
      if (drag.direction !== 0) snapBack();
      drag.direction = 0;
    });
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
