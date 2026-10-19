/* HONA Media — design 1. Plain JS, no dependencies. */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isSet(value) {
    return typeof value === "string" && value.trim() !== "" && value.indexOf("[") === -1;
  }

  /* ---------- header: scroll state, mobile menu ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = !header.classList.contains("is-open");
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-list a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- hero: still rotation + timecode ---------- */
  var stills = document.querySelectorAll(".hero-still");
  if (stills.length > 1 && !reduceMotion) {
    var current = 0;
    setInterval(function () {
      stills[current].classList.remove("is-active");
      current = (current + 1) % stills.length;
      stills[current].classList.add("is-active");
    }, 6500);
  }

  var tc = document.getElementById("timecode");
  if (tc && !reduceMotion) {
    var start = Date.now();
    var fps = 24;
    setInterval(function () {
      var elapsed = (Date.now() - start) / 1000;
      var h = Math.floor(elapsed / 3600);
      var m = Math.floor((elapsed % 3600) / 60);
      var s = Math.floor(elapsed % 60);
      var f = Math.floor((elapsed % 1) * fps);
      tc.textContent = [h, m, s, f].map(function (n) { return (n < 10 ? "0" : "") + n; }).join(":");
    }, 1000 / fps);
  }

  /* ---------- links from config ---------- */
  var linkMap = {
    whatsapp: isSet(cfg.whatsappNumber) ? "https://wa.me/" + cfg.whatsappNumber.replace(/\D/g, "") : null,
    email: isSet(cfg.email) ? "mailto:" + cfg.email : null,
    booking: isSet(cfg.bookingUrl) ? cfg.bookingUrl : null,
    instagram: isSet(cfg.instagram) ? cfg.instagram : null,
    youtube: isSet(cfg.youtube) ? cfg.youtube : null,
    linkedin: isSet(cfg.linkedin) ? cfg.linkedin : null,
    tiktok: isSet(cfg.tiktok) ? cfg.tiktok : null,
    facebook: isSet(cfg.facebook) ? cfg.facebook : null
  };
  var textMap = {
    whatsapp: isSet(cfg.whatsappNumber) ? "+" + cfg.whatsappNumber.replace(/\D/g, "") : null,
    email: isSet(cfg.email) ? cfg.email : null,
    booking: isSet(cfg.bookingUrl) ? cfg.bookingUrl.replace(/^https?:\/\//, "") : null
  };

  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    var url = linkMap[key];
    if (url) {
      el.setAttribute("href", url);
      if (url.indexOf("http") === 0) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    } else {
      // Placeholder: keep the in-page fallback and explain on hover.
      el.setAttribute("title", "Link not set yet (see js/config.js)");
    }
    var textKey = el.getAttribute("data-text");
    if (textKey && textMap[textKey]) el.textContent = textMap[textKey];
  });

  /* ---------- modal helpers ---------- */
  var lastFocus = null;
  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("is-locked");
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal(modal) {
    modal.hidden = true;
    document.body.classList.remove("is-locked");
    var player = modal.querySelector(".modal-player");
    if (player) player.innerHTML = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.querySelectorAll("[data-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { closeModal(modal); });
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal:not([hidden])").forEach(closeModal);
    if (header.classList.contains("is-open")) closeMenu();
  });

  /* ---------- video modal (YouTube / Vimeo) ---------- */
  var videoModal = document.getElementById("video-modal");
  var playerHost = document.getElementById("modal-player");
  var modalNote = document.getElementById("modal-note");

  function embedUrl(provider, id) {
    if (provider === "vimeo") return "https://player.vimeo.com/video/" + id + "?autoplay=1&dnt=1";
    return "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
  }

  document.querySelectorAll("[data-video]").forEach(function (btn) {
    // Add a hover play glyph to work cards.
    if (btn.classList.contains("work-card")) {
      var play = document.createElement("span");
      play.className = "play";
      play.setAttribute("aria-hidden", "true");
      play.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
      btn.appendChild(play);
    }
    btn.addEventListener("click", function () {
      var provider = btn.getAttribute("data-provider") || "youtube";
      var id = btn.getAttribute("data-video-id");
      if (btn.getAttribute("data-video") === "showreel" && isSet(cfg.showreelYoutubeId)) {
        id = cfg.showreelYoutubeId;
        provider = "youtube";
      }
      openModal(videoModal);
      if (!isSet(id)) {
        playerHost.innerHTML = "";
        modalNote.hidden = false;
        return;
      }
      modalNote.hidden = true;
      var iframe = document.createElement("iframe");
      iframe.src = embedUrl(provider, id);
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.setAttribute("allowfullscreen", "");
      iframe.title = btn.getAttribute("aria-label") || "Video";
      playerHost.innerHTML = "";
      playerHost.appendChild(iframe);
    });
  });

  /* ---------- gallery filter + lightbox ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var shots = document.querySelectorAll(".shot");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      shots.forEach(function (shot) {
        var show = filter === "all" || shot.getAttribute("data-city") === filter;
        shot.classList.toggle("is-hidden", !show);
        if (show) shot.classList.add("is-visible");
      });
    });
  });

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
    var img = btn.querySelector("img");
    var figcaption = btn.parentElement.querySelector("figcaption");
    btn.setAttribute("aria-label", "Open photo: " + (img.alt || "behind the scenes"));
    btn.addEventListener("click", function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = figcaption ? figcaption.textContent.replace(/\s+/g, " ").trim() : "";
      openModal(lightbox);
    });
  });

  /* ---------- language switch (dormant) ----------
     The switch is hidden until window.I18N_AR exists. To add Arabic:
     1. create js/i18n-ar.js with window.I18N_AR = { "selector-or-key": "Arabic text", ... }
     2. add data-i18n="key" attributes to the elements you want translated
     3. remove the `hidden` attribute from .lang-switch in index.html             */
  var langSwitch = document.querySelector(".lang-switch");
  if (langSwitch && window.I18N_AR) {
    langSwitch.hidden = false;
    var original = {};
    langSwitch.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        langSwitch.querySelectorAll(".lang-btn").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
          var key = el.getAttribute("data-i18n");
          if (!(key in original)) original[key] = el.innerHTML;
          el.innerHTML = lang === "ar" && window.I18N_AR[key] ? window.I18N_AR[key] : original[key];
        });
      });
    });
  }
})();
