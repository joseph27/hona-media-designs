# HONA Media — Design Option 3: Minimal Luxury

Deep black, hairlines, Montserrat Light with wide tracking, slow fades. Crimson is used only for the logo mark and the single contact CTA. Feels like a film studio or fashion house.

Static site: open `index.html` directly in a browser, or serve the folder with any static server. No build step.

```
index.html          page
css/styles.css      all styles (design tokens at the top of the file)
js/main.js          nav, scroll reveals, work preview, BTS filters, showreel + lightbox
assets/img/         hero.jpg, about.jpg, og.jpg (social share image)
assets/img/bts/     13 behind-the-scenes photos, resized to 1400px
assets/brand/       identity sheet, icon, and the brand-identity HTML (tokens reference)
```

## Placeholders to replace

| What | Where | Notes |
|---|---|---|
| YouTube showreel | `index.html` → `<iframe data-src="...embed/VIDEO_ID...">` | Replace `VIDEO_ID` with the real video id. Loads only when "Watch the showreel" is clicked. |
| WhatsApp number | `index.html` → `<a class="cta" href="https://wa.me/10000000000...">` | Use full international number without `+`. |
| Email | `index.html` → `mailto:hello@honamedia.com` (contact list) | Also in `assets/brand/` reference. |
| Instagram / YouTube / LinkedIn | `index.html` → `.contact__links` and the JSON-LD `sameAs` array | All currently `honamedia` handles. |
| Domain / canonical / OG URLs | `index.html` `<head>` | Currently `https://honamedia.com/`. Update `og:image` to the live absolute URL. |
| Selected Work entries | `index.html` → `#worklist` | Titles, client/city/year metas and `data-img` previews are inferred from the BTS photos. Links are `href="#"` placeholders until case-study pages exist. |
| BTS captions | `index.html` → `#gallery` each `<figcaption>` | `cap__city` (filter label) and `cap__note` (short note). Change `data-city` on the `<li>` to move a photo between filters; add a matching `.filter` button for a new city. The `gallery__item--feature` class makes one frame a 2×2 feature. |
| About copy and facts | `index.html` → `#about` | "Founded 2016", "Base Toronto · Paris", "Languages EN · FR · AR" are assumptions — confirm with Belal. |
| Hero / about photos | `assets/img/hero.jpg`, `assets/img/about.jpg` | Hero currently uses the Paris theatre photo (Belal with the Ronin), desaturated in CSS. |
| Favicon | inline SVG data URI in `<head>` | Swap for a PNG/ICO set if needed. |

## Photo → city mapping (from the WhatsApp thread)

- `paris-studio.jpg` — Paris, France (Royal Commission for Riyadh City interview set)
- `paris-event-01..04.jpg` — Paris, event (Riyadh Expo 2030 Symposium)
- `paris-street.jpg` — Paris, France
- `paris-hangar.jpg` — Paris, France (Hangar Y)
- `nyc.jpg` — NYC, United States (COP16 council meeting)
- `london.jpg` — London, UK
- `barcelona.jpg` — Barcelona, Spain (Smart City Expo)
- `osaka.jpg` — Osaka, Japan (Expo 2025 IPM)
- `toronto.jpg` — Toronto, Canada
- `toronto-ceremony.jpg` — assigned to Toronto as a guess; recaption if wrong

## Notes

- Fonts load from Google Fonts (Montserrat 200/300/400/700/900). For a fully offline build, self-host the woff2 files and update the `@font-face` / `<link>`.
- The YouTube embed uses `youtube-nocookie.com`.
- All motion respects `prefers-reduced-motion`.
- Tested layout targets: 375px (no horizontal scroll), 768px, 1280px+.
