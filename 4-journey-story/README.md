# HONA Media — Option 4: "Journey Storytelling"

An immersive scroll story that travels city by city (Paris → New York → London → Barcelona → Osaka → Toronto), built like a film's opening sequence: letterbox bars open, full-bleed BTS stills, city names as chapter titles, a crimson route line that draws itself as you scroll, and services + contact as the end credits.

Static HTML/CSS/JS, no build step. Open `index.html` directly or serve the folder with any static server.

## Files

- `index.html` — the whole site (hero, journey, works, crew credits, about, end credits, footer)
- `css/style.css` — brand tokens as CSS variables, layout, motion (all animation inside `prefers-reduced-motion: no-preference`)
- `js/main.js` — route line drawing, chapter lighting, parallax, chapter index, showreel embed
- `assets/brand/` — `logo-mark.svg` (recreated H + play mark), `icon.jpg`, `identity-sheet.jpg`, `brand-identity-reference.html`
- `assets/bts/` — 13 behind-the-scenes photos renamed by city
- `assets/hero-poster.jpg` — showreel poster (Toronto gimbal shot)

## Placeholders to replace

| Where | What |
|---|---|
| `js/main.js` → `YOUTUBE_ID` | Showreel YouTube video id (currently a dummy id) |
| `index.html` → `#contact` | WhatsApp number in `https://wa.me/10000000000` |
| `index.html` → `#contact` | Email `hello@honamedia.com` |
| `index.html` → `.socials` | Instagram / YouTube / TikTok / LinkedIn URLs |
| `index.html` → `.works__grid` | 6 portfolio tiles: titles, cities, years and the `href` to each film (currently BTS stills reused as thumbnails) |
| `index.html` → `.chapter__caption` | Per-city captions (marked "editable caption") |
| `index.html` → `.chapter__meta` | Coordinates are real city centres; swap for venue coordinates if wanted |
| `index.html` → `.about__facts` | 6 cities / 120+ events / 48h — placeholder figures |
| `index.html` → `<head>` | Canonical / OG URL (`https://www.honamedia.com/`), OG image |
| `assets/bts/*.jpg` | City-to-photo mapping is a best guess from the chat; `alt` text and chapter order can be reshuffled freely |

## Photo mapping (best guess from the chat)

- Paris: `paris-01` (street steadicam), `paris-02` (Riyadh Expo 2030 boardroom), `paris-03` (symposium stage)
- New York: `nyc-01` (COP16 council meeting interview), `nyc-02` (editor at gala)
- London: `london-01` (three-crew selfie), `london-02` (expo-floor selfie)
- Barcelona: `barcelona-01` (Smart City Expo LED wall), `barcelona-02` (stage camera)
- Osaka: `osaka-01` (Expo 2025 International Participants Meeting)
- Toronto: `toronto-01` (gimbal in auditorium), `toronto-02` (editing team), `toronto-03` (convocation)

## Notes

- Mobile-first; no horizontal scroll at 375px (`overflow-x: clip` on body, fluid type via `clamp()`).
- Reduced motion: letterbox, hero stagger, Ken Burns, route drawing, parallax and credits roll are all disabled; the route renders fully drawn and chapters are lit.
- Fonts: Montserrat 300/400/700/900 from Google Fonts (swap for self-hosted files if preferred).
- SEO: title, description, canonical, Open Graph and Twitter card meta, semantic landmarks, alt text on every photo.
