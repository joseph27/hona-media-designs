/* HONA Media — Option 3: Minimal Luxury
   Plain JS, no dependencies. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var navList = document.getElementById('nav-list');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navList.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }
  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });
  navList.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navList.classList.contains('is-open')) setNav(false);
  });

  /* ---------- scroll reveals ---------- */
  var fades = document.querySelectorAll('.fade, .section-head');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    fades.forEach(function (el) { io.observe(el); });
  } else {
    fades.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- work list: cursor-following preview (desktop only) ---------- */
  var preview = document.querySelector('.work__preview');
  var previewImg = document.getElementById('work-preview-img');
  var worklist = document.getElementById('worklist');
  if (preview && worklist && window.matchMedia('(hover: hover) and (min-width: 1000px)').matches) {
    var px = 0, py = 0, tx = 0, ty = 0, raf = null;
    function tick() {
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      preview.style.transform = 'translate(' + (px - preview.offsetWidth / 2) + 'px,' + (py - preview.offsetHeight / 2) + 'px)' +
        (preview.classList.contains('is-visible') ? ' scale(1)' : ' scale(0.96)');
      raf = requestAnimationFrame(tick);
    }
    worklist.addEventListener('mousemove', function (e) {
      tx = e.clientX + 40; ty = e.clientY;
      if (!raf) { px = tx; py = ty; tick(); }
    });
    worklist.addEventListener('mouseover', function (e) {
      var item = e.target.closest('.worklist__item');
      if (!item) return;
      var src = item.getAttribute('data-img');
      if (src && previewImg.getAttribute('src') !== src) previewImg.setAttribute('src', src);
      preview.classList.add('is-visible');
    });
    worklist.addEventListener('mouseleave', function () {
      preview.classList.remove('is-visible');
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    });
  }
  // Placeholder project links: prevent jumping to top.
  document.querySelectorAll('a[data-placeholder="project"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ---------- BTS filters ---------- */
  var filters = document.querySelectorAll('.filter');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var city = btn.getAttribute('data-city');
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      items.forEach(function (item) {
        var show = city === 'all' || item.getAttribute('data-city') === city;
        item.classList.toggle('is-hidden', !show);
        if (show) item.classList.add('is-in');
      });
    });
  });

  /* ---------- dialogs (showreel + lightbox) ---------- */
  var lastFocus = null;
  function openDialog(dialog) {
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add('dialog-open');
    var close = dialog.querySelector('.dialog__close');
    if (close) close.focus();
  }
  function closeDialog(dialog) {
    dialog.hidden = true;
    document.body.classList.remove('dialog-open');
    var iframe = dialog.querySelector('iframe');
    if (iframe && iframe.src) iframe.removeAttribute('src'); // stop playback
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('.dialog').forEach(function (dialog) {
    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeDialog(dialog);
    });
    // Simple focus trap
    dialog.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusables = dialog.querySelectorAll('button, [href], iframe, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.dialog:not([hidden])').forEach(closeDialog);
  });

  // Showreel
  var showreel = document.getElementById('showreel');
  var playBtn = document.getElementById('play-showreel');
  if (playBtn && showreel) {
    playBtn.addEventListener('click', function () {
      var iframe = showreel.querySelector('iframe');
      iframe.src = iframe.getAttribute('data-src');
      openDialog(showreel);
    });
  }

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCap = document.getElementById('lightbox-cap');
  var current = 0;
  function visibleItems() {
    return items.filter(function (i) { return !i.classList.contains('is-hidden'); });
  }
  function showPhoto(index) {
    var list = visibleItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    var item = list[current];
    var img = item.querySelector('img');
    var cap = item.querySelector('figcaption');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap
      ? Array.prototype.map.call(cap.children, function (c) { return c.textContent.trim(); }).filter(Boolean).join(' — ')
      : '';
  }
  items.forEach(function (item) {
    item.querySelector('.gallery__btn').addEventListener('click', function () {
      showPhoto(visibleItems().indexOf(item));
      openDialog(lightbox);
    });
  });
  lightbox.querySelectorAll('.dialog__nav').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showPhoto(current + Number(btn.getAttribute('data-dir')));
    });
  });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'ArrowRight') showPhoto(current + 1);
    if (e.key === 'ArrowLeft') showPhoto(current - 1);
  });

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
