/* HONA Media — Option 4 "Journey Storytelling"
   Vanilla JS: route line drawn by scroll, chapter lighting, parallax,
   chapter index, showreel embed. Everything respects prefers-reduced-motion. */
(function () {
  'use strict';

  // PLACEHOLDER: replace with the real showreel YouTube video id
  var YOUTUBE_ID = 'dQw4w9WgXcQ';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var journey = document.getElementById('journey');
  var routeSvg = document.getElementById('route');
  var routeLine = document.getElementById('routeLine');
  var routeTrack = document.getElementById('routeTrack');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter'));
  var indexLinks = Array.prototype.slice.call(document.querySelectorAll('#chapterIndex a'));
  var chapterNav = document.querySelector('.chapters');
  var progressBar = document.getElementById('progressBar');
  var routeLength = 0;
  var pins = []; // { el, y }
  var ticking = false;

  document.getElementById('year').textContent = String(new Date().getFullYear());

  /* ---------- route path ---------- */
  function buildRoute() {
    if (!journey || !routeSvg) return;
    var jRect = journey.getBoundingClientRect();
    var W = journey.offsetWidth;
    var H = journey.offsetHeight;
    routeSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    routeSvg.setAttribute('width', W);
    routeSvg.setAttribute('height', H);

    pins = chapters.map(function (ch) {
      var pin = ch.querySelector('.chapter__pin');
      var r = pin.getBoundingClientRect();
      return {
        chapter: ch,
        x: r.left - jRect.left + r.width / 2,
        y: r.top - jRect.top + r.height / 2
      };
    });

    var intro = journey.querySelector('.journey__intro');
    var startX = pins.length ? pins[0].x : 40;
    var start = { x: startX, y: 0 };
    var outro = journey.querySelector('.journey__outro');
    var endY = outro ? outro.offsetTop + outro.offsetHeight * 0.35 : H;
    var end = { x: startX, y: endY };

    var points = [start].concat(pins, [end]);
    var d = 'M ' + points[0].x + ' ' + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var p0 = points[i - 1], p1 = points[i];
      var dy = (p1.y - p0.y) * 0.5;
      d += ' C ' + p0.x + ' ' + (p0.y + dy) + ', ' + p1.x + ' ' + (p1.y - dy) + ', ' + p1.x + ' ' + p1.y;
    }
    routeTrack.setAttribute('d', d);
    routeLine.setAttribute('d', d);
    routeLength = routeLine.getTotalLength();
    routeLine.style.strokeDasharray = routeLength;
    routeLine.style.strokeDashoffset = reduceMotion ? 0 : routeLength;
    if (intro) intro.setAttribute('data-ready', 'true');
    update();
  }

  /* ---------- scroll update ---------- */
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var docH = document.documentElement.scrollHeight - vh;
    if (progressBar) progressBar.style.width = (docH > 0 ? (scrollY / docH) * 100 : 0) + '%';

    if (!journey) return;
    var jTop = journey.offsetTop;
    var jH = journey.offsetHeight;
    var head = scrollY + vh * 0.62 - jTop;        // where the "pen" of the route is
    var progress = Math.min(1, Math.max(0, head / jH));

    if (!reduceMotion && routeLength) {
      routeLine.style.strokeDashoffset = routeLength * (1 - progress);
    }

    // light chapters whose pin the route has reached
    var activeIndex = -1;
    pins.forEach(function (p, i) {
      var lit = reduceMotion ? true : head >= p.y - 40;
      p.chapter.classList.toggle('is-lit', lit);
      if (head >= p.y - vh * 0.5) activeIndex = i;
    });

    // chapter index state
    var inJourney = scrollY + vh * 0.5 > jTop && scrollY + vh * 0.5 < jTop + jH;
    if (chapterNav) chapterNav.classList.toggle('is-visible', inJourney);
    indexLinks.forEach(function (a, i) {
      a.classList.toggle('is-active', i === activeIndex);
      a.classList.toggle('is-passed', i < activeIndex);
    });

    // gentle parallax on sticky stills
    if (!reduceMotion) {
      chapters.forEach(function (ch) {
        var r = ch.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var t = (vh - r.top) / (r.height + vh); // 0..1 through the viewport
        var img = ch.querySelector('.chapter__media img');
        if (img) img.style.transform = 'scale(1.08) translateY(' + ((t - 0.5) * -6) + '%)';
      });
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  /* ---------- section fades ---------- */
  var fadeTargets = document.querySelectorAll('.section__head, .credits__row, .work, .about__media, .about__body, .credits-roll__contact, .journey__intro, .journey__outro');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    fadeTargets.forEach(function (el, i) {
      el.classList.add('fade');
      el.style.transitionDelay = (i % 3) * 0.08 + 's';
      io.observe(el);
    });
  }

  /* ---------- showreel ---------- */
  var playBtn = document.getElementById('playBtn');
  var hero = document.querySelector('.hero');
  var frame = document.getElementById('heroFrame');
  if (playBtn && frame) {
    playBtn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + YOUTUBE_ID + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      iframe.title = 'HONA Media showreel';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.setAttribute('allowfullscreen', '');
      frame.innerHTML = '';
      frame.appendChild(iframe);
      frame.hidden = false;
      hero.classList.add('is-playing');
    });
  }

  /* ---------- boot ---------- */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildRoute, 120);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', buildRoute);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildRoute);
  buildRoute();
})();
