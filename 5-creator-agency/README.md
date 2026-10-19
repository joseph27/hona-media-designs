# HONA Media — Design option 5: Energetic Creator Agency

Bold, kinetic, dark. Crimson blocks, scrolling marquees of services and cities, big count-up stats, a video thumbnail grid with hover previews, and a BTS filmstrip by city. Aimed at brands and creators who want social content.

Open `index.html` directly in a browser. Static HTML/CSS/JS, no build step. Only external dependency is Google Fonts (Montserrat 300/400/700/900).

## Files

- `index.html` — the whole site (one page, anchored sections)
- `css/style.css` — styles, brand tokens in `:root`
- `js/main.js` — mobile menu, count-up stats, scroll reveals, thumbnail previews, BTS strip arrows
- `assets/favicon.svg` — red block H with play triangle
- `assets/img/bts-*.jpg` — 13 behind-the-scenes photos (resized to 1400px)
- `assets/brand/` — identity sheet, icon and the original brand identity HTML (reference only, not linked)

## Placeholders to replace

| Where | What |
|---|---|
| `index.html` hero `<iframe>` | `VIDEO_ID` → YouTube ID of the showreel. The poster image and play badge stay visible until a real ID is set (JS checks for `VIDEO_ID`). |
| `index.html` work grid (`#work-grid`) | `VIDEO_ID_1` … `VIDEO_ID_6` in both `data-video` and the `href`. Project titles, durations and thumbnails (currently BTS photos; each tile has two frames `tile__a` / `tile__b` for the hover preview). |
| `index.html` stats | `data-count` and `data-suffix` on each `.stat__n` (cities filmed, projects, views, turnaround). Numbers are invented. |
| `index.html` marquees | Service list and city list (Riyadh and Cairo were added to the six photographed cities; remove if wrong). |
| `index.html` BTS strip (`#strip`) | Captions: `<b>` city, `<small>` one-line description. City-to-photo assignment was a best guess from the chat; London/Barcelona/Osaka/NYC photos are interchangeable. `alt` text on each image. |
| `index.html` about | Founder bio copy and format chips. |
| `index.html` contact | WhatsApp number (`wa.me/10000000000`), email `hello@honamedia.com`, Instagram/TikTok/YouTube handles `@honamedia`. |
| `index.html` `<head>` | `canonical`, `og:url`, `og:image` (use an absolute URL once hosted). |
| Logo | Inline SVG symbol `#hona-mark` is a reconstruction of the red block H with white play triangle. Swap for the official vector when available. |

## Notes

- Mobile-first; verified no horizontal scroll at 375px.
- All animation (marquee, count-up, reveals, hover scrub) is disabled under `prefers-reduced-motion: reduce`.
- The marquee pauses on hover. Thumbnails preview on hover, keyboard focus and touch-hold.
- Images are lazy-loaded except the hero poster.
