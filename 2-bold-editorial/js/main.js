/* HONA Media Network — Option 2 Bold Editorial
   Plain JS, no dependencies. */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__list a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Current-section highlight in nav ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav__list a[href^='#']"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) =>
            a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".section__head, .index__row, .case, .spread, .shot, .about__portrait, .about__copy, .channel, .cta-block"
  );
  revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Showreel: lazy YouTube embed ---------- */
  const frame = document.querySelector(".reel__frame");
  const play = document.querySelector(".reel__play");
  if (frame && play) {
    play.addEventListener("click", () => {
      const id = frame.dataset.videoId;
      if (!id || id === "VIDEO_ID_PLACEHOLDER") {
        play.setAttribute("aria-label", "Showreel coming soon");
        play.classList.add("is-pending");
        const note = document.querySelector(".reel__caption-note");
        if (note) note.textContent = "Add YouTube ID in index.html";
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = "HONA Media showreel";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
  }

  /* ---------- Case list: floating preview on hover (desktop) ---------- */
  const preview = document.querySelector(".cases__preview");
  const previewImg = preview && preview.querySelector("img");
  const caseLinks = document.querySelectorAll(".case[data-preview]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (preview && previewImg && finePointer && !reduceMotion) {
    let raf = 0;
    let x = 0, y = 0;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          preview.style.left = `${Math.min(x + 28, window.innerWidth - 290)}px`;
          preview.style.top = `${Math.min(y - 120, window.innerHeight - 360)}px`;
          raf = 0;
        });
      }
    };
    caseLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        previewImg.src = link.dataset.preview;
        preview.classList.add("is-visible");
      });
      link.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));
      link.addEventListener("mousemove", move);
    });
  }

  /* ---------- BTS gallery filter ---------- */
  const filters = document.querySelectorAll(".filter");
  const shots = document.querySelectorAll(".shot");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const city = btn.dataset.city;
      filters.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      shots.forEach((shot, i) => {
        const show = city === "all" || shot.dataset.city === city;
        shot.classList.toggle("is-hidden", !show);
        if (show && !reduceMotion) {
          shot.classList.remove("is-in");
          shot.style.transitionDelay = `${(i % 6) * 50}ms`;
          requestAnimationFrame(() => requestAnimationFrame(() => shot.classList.add("is-in")));
        }
      });
    });
  });

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
