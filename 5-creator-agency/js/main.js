(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-nav');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      menu.classList.toggle('is-open', !open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      });
    });
  }

  /* Showreel: only reveal the iframe once a real video ID is set */
  var reel = document.querySelector('.reel');
  var iframe = reel && reel.querySelector('iframe');
  if (iframe && iframe.src.indexOf('VIDEO_ID') === -1) {
    reel.classList.add('has-video');
  }

  /* Count-up stats */
  var stats = document.querySelectorAll('.stat__n');
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Reveal on scroll */
  var revealables = document.querySelectorAll('.svc__item, .tile, .shot, .about__block, .about__copy, .clink, .stat');
  revealables.forEach(function (el) { el.classList.add('inview'); });

  if ('IntersectionObserver' in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        var n = e.target.querySelector('.stat__n');
        if (n && !seen.has(n)) { seen.add(n); runCount(n); }
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
    stats.forEach(runCount);
  }

  /* Work grid: touch devices get a preview on tap-hold / focus */
  document.querySelectorAll('.tile a').forEach(function (a) {
    var tile = a.parentElement;
    a.addEventListener('focus', function () { tile.classList.add('is-previewing'); });
    a.addEventListener('blur', function () { tile.classList.remove('is-previewing'); });
    a.addEventListener('touchstart', function () { tile.classList.add('is-previewing'); }, { passive: true });
    a.addEventListener('touchend', function () {
      setTimeout(function () { tile.classList.remove('is-previewing'); }, 900);
    }, { passive: true });
  });

  /* BTS strip arrows */
  var strip = document.getElementById('strip');
  document.querySelectorAll('.arrow').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!strip) return;
      var dir = parseInt(btn.getAttribute('data-dir'), 10);
      strip.scrollBy({ left: dir * Math.round(strip.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* Footer year */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
