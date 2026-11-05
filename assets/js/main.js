/* nooriazad.ir — small, dependency-free behaviors */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme ---------- */
  var THEME_KEY = 'hn-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f7fb' : '#07090e');
  }

  var stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

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
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeDrawer();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector('.header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
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

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
