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
