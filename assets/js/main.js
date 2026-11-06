/* nooriazad.ir — small, dependency-free behaviors */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  var THEME_KEY = 'hn-theme';
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f7fb' : '#07090e');
  }
  var stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (stored === 'light' || stored === 'dark') applyTheme(stored);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) applyTheme('light');

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });

  /* ---------- Mobile drawer ---------- */
  var drawer = document.getElementById('drawer');
  var menuBtn = document.getElementById('menuBtn');
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    var first = drawer.querySelector('a, button');
    if (first) first.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (drawer) drawer.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeDrawer();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* ---------- Header stuck state ---------- */
  var header = document.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('is-stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Active nav link ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  if (sections.length && links.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Count-up stats (verbatim glyphs preserved) ---------- */
  function parseNum(s) {
    // accept both Persian and ASCII digits
    var fa = '۰۱۲۳۴۵۶۷۸۹';
    var clean = s.replace(/[۰-۹]/g, function (d) { return fa.indexOf(d); });
    var m = clean.match(/^(\d+)(.*)$/);
    return m ? { n: parseInt(m[1], 10), suffix: m[2], plain: s } : null;
  }
  var nums = document.querySelectorAll('.stat__num');
  if (nums.length && 'IntersectionObserver' in window && !reduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        var el = entry.target;
        var parsed = parseNum(el.textContent.trim());
        if (!parsed) return;
        var t0 = null, DUR = 1100;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / DUR);
          var eased = 1 - Math.pow(1 - p, 3);
          el.innerHTML = '<span class="statDigits">' + Math.round(parsed.n * eased) + '</span>' + parsed.suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Pointer tilt on cards (rAF, no libs) ---------- */
  if (!reduced && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    var cards = document.querySelectorAll('.skillcard, .project');
    var ticking = false;
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--tiltx', (-y * 6).toFixed(2) + 'deg');
          card.style.setProperty('--tilty', (x * 8).toFixed(2) + 'deg');
          ticking = false;
        });
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tiltx', '0deg');
        card.style.setProperty('--tilty', '0deg');
      });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
