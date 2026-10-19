# HONA Media Network — Design Option 2: Bold Editorial

A dark broadsheet. Jet-black "newsprint" with hairline rules, Montserrat Heavy headlines at poster scale, and crimson used like ink: folio numbers, stamps, one CTA block. Six numbered sections (01–06) read like a magazine issue; the portfolio is laid out as case files with a featured spread.

Open `index.html` directly in a browser — no build step, no dependencies.

## Files

```
index.html            page (SEO meta, Open Graph, JSON-LD)
css/styles.css        all styles, mobile-first, CSS variables for brand tokens
js/main.js            nav, scroll reveal, lazy YouTube embed, hover preview, city filter
assets/hero-poster.jpg        showreel poster (Toronto gimbal shot)
assets/bts/bts-01..13.jpg     13 behind-the-scenes photos, web-sized (max 1200px)
assets/brand/logo-mark.svg    H + play-triangle mark (crimson)
assets/brand/favicon.svg      favicon
assets/brand/icon.jpg         original icon from Belal
assets/brand/identity-sheet.jpg  original identity sheet from Belal
assets/brand/brand-identity-reference.html  token reference (colours, type)
```

## Placeholders to replace

| Where | What | Notes |
|---|---|---|
| `index.html` `.reel__frame` | `data-video-id="VIDEO_ID_PLACEHOLDER"` | Put the real YouTube video ID. Player loads `youtube-nocookie.com` on click. |
| `index.html` `.reel__caption` | `02:14`, `4K · Colour graded`, "YouTube placeholder" | Edit or delete the caption chips. |
| `index.html` `<head>` | `https://honamedia.com/` canonical, OG URL and OG image | Change to the real domain. |
| `index.html` JSON-LD | `sameAs` social URLs, `email` | Replace with real profiles. |
| Section 03 `.cases__list` | 6 case rows: titles, type / city / year, `data-preview` image | Rows link to `#case-01` etc. Only `#case-01` has a spread; add more `<article class="spread">` blocks or link rows to real case pages. |
| Section 03 `.spread` | Client name, role, deliverables, location, copy | "Client name placeholder" is literal. |
| Section 04 `.gallery` | Each `<figcaption class="shot__cap">` city + note, and `data-city` | Captions are guesses from the chat — Belal should confirm which photo is which city. Cities available in the filter: Paris, NYC, London, Barcelona, Osaka, Toronto. Photo count badge on the "All" button is hard-coded (13). |
| Section 05 `.about` | Bio copy, pull quote, the three facts (10+ / 7 / 24h) | Facts are illustrative, not verified. |
| Section 06 `.channels` | WhatsApp `https://wa.me/10000000000` and `+1 (000) 000-0000`, email, Instagram, YouTube, LinkedIn | WhatsApp number appears twice (list + red CTA block). |
| `.ticker` | City names in the marquee | Duplicated twice for the seamless loop; keep both copies identical. |
| Footer | © year is set by JS; "Formerly Ultinity Film" line | Delete if not wanted. |

## Brand tokens (in `:root` of `styles.css`)

- `--crimson` #A50F15 (Deep Crimson, ink / stamps)
- `--crimson-bright` #C41E3A (Bright Crimson, CTA and accents)
- `--jet` #1a1a1a (Jet Black, page)
- `--charcoal` #36454F (reserved)
- `--paper` #f5f5f3 (Off White, type)
- Font: Montserrat 300 / 400 / 700 / 900 via Google Fonts (falls back to Helvetica/Arial offline).

## Accessibility and performance notes

- Skip link, semantic landmarks, `aria-pressed` filters, `aria-expanded` menu, visible focus rings, 44px tap targets.
- All motion is wrapped in `prefers-reduced-motion: no-preference`.
- Images have width/height attributes and `loading="lazy"` except the hero poster.
- No horizontal scroll at 375px (ticker overflow is clipped).
- YouTube iframe is injected only on click, so nothing from YouTube loads on first paint.
