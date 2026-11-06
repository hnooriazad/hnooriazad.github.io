/* animations.js — GSAP ScrollTrigger scenes for the showcase page.
   Everything degrades to "just visible" if GSAP fails to load or
   prefers-reduced-motion is set. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* watchdog: if anything fails, make every animated element visible */
  function failSafe() {
    document.querySelectorAll('[data-anim], .tl-item, .hcard, .panel__inner .lead, .big-title').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
  if (!hasST || reduced) { failSafe(); return; }

  /* ---------- progress bar ---------- */
  var fill = document.getElementById('pbarFill');
  if (fill) {
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        fill.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')';
      }
    });
  }

  /* ---------- hero: title drifts up + fades as you leave ---------- */
  gsap.to('#heroPanel .panel__inner', {
    yPercent: -22, opacity: 0.15, ease: 'none',
    scrollTrigger: { trigger: '#heroPanel', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });

  /* ---------- stat cards pop ---------- */
  gsap.utils.toArray('#panelStats .statcard').forEach(function (card, i) {
    gsap.from(card, {
      y: 44, opacity: 0, scale: 0.92,
      duration: 0.7, delay: i * 0.09, ease: 'power3.out',
      scrollTrigger: { trigger: '#panelStats', start: 'top 70%' }
    });
  });

  /* ---------- timeline: step-by-step build-up, page pinned while the list plays ---------- */
  var tlItems = gsap.utils.toArray('#panelTimeline [data-step]');
  if (tlItems.length) {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#panelTimeline',
        start: 'top top',
        end: '+=' + (tlItems.length * 55) + '%',
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
      }
    });
    tlItems.forEach(function (item) {
      tl.from(item, { opacity: 0, y: 40, duration: 0.35, ease: 'power2.out' })
        .to(item, { opacity: 1, duration: 0.05 });
    });
  }

  /* ---------- horizontal project track (classic x-scrub) ---------- */
  var track = document.getElementById('htrack');
  if (track) {
    var getX = function () {
      return -(track.scrollWidth - document.documentElement.clientWidth + 24);
    };
    gsap.to(track, {
      x: getX, ease: 'none',
      scrollTrigger: {
        trigger: '#panelWork',
        start: 'top top',
        end: function () { return '+=' + (track.scrollWidth - window.innerWidth + 200); },
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }
    });
    gsap.utils.toArray('.hcard').forEach(function (c, i) {
      gsap.from(c, {
        y: 60, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '#panelWork', start: 'top 60%' }
      });
    });
  }

  /* ---------- outro ---------- */
  gsap.from('#panelOut .panel__inner', {
    y: 60, opacity: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '#panelOut', start: 'top 65%' }
  });

  /* refresh after fonts settle */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
