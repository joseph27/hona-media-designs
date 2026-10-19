# HONA Media website, design 1: Cinematic dark

Draft website for HONA Media Network (formerly Ultinity Film), the video production company of Belal Elhusseiny. Tagline: Be Seen. Be Here.

Direction: dark, cinematic, video first. Inspired by dnastudio.sa (viewfinder frame, scene numbers, timecode, ticker) but built from the HONA brand sheet: Montserrat, Deep Crimson #A50F15, Bright Crimson #C41E3A, Jet Black #1a1a1a, Charcoal #36454F, Off White #f5f5f3.

This is a local draft. Nothing is published, deployed or registered.

## What is in this folder

- `index.html`: the whole site, one page with anchors (Work, Services, Behind the Scenes, About, Contact).
- `css/style.css`: all styles. Mobile first. Tested at 375, 768 and 1440 px wide.
- `js/config.js`: the only file Belal or Joseph must edit for links. Showreel id, WhatsApp, email, booking link, socials, domain.
- `js/main.js`: menu, scroll reveal, hero still rotation, timecode, video modal, gallery filter, lightbox. No dependencies.
- `images/logo.svg`: a clean SVG redraw of the H play mark. `images/favicon.svg`: same mark on crimson.
- `images/brand/`: Belal's identity sheets, icon and the office wall mockup (used in About and as the OG image).
- `images/bts/`: the 11 behind the scenes photos from Belal, resized to 1800 px max.
- `robots.txt` and `sitemap.xml`: basic SEO. Both contain `[DOMAIN]`.

No build step. Open `index.html` in a browser, or run any static server.

## Placeholders

Every placeholder is in square brackets. Search the folder for `[` to find them all.

In `js/config.js`:
- `[SHOWREEL_YOUTUBE_ID]`: the YouTube id of the showreel. Until it is set, the hero button opens a notice.
- `[WHATSAPP_NUMBER]`: digits with country code, no plus sign.
- `[EMAIL]`, `[BOOKING_LINK]`.
- `[INSTAGRAM_URL]`, `[YOUTUBE_CHANNEL_URL]`, `[LINKEDIN_URL]`, `[TIKTOK_URL]`, `[FACEBOOK_URL]`.
- `[DOMAIN]`: also appears in `index.html` (canonical, OG tags, JSON-LD), `robots.txt` and `sitemap.xml`.

In `index.html`:
- Selected work: 8 real videos pulled from the old ultinityfilm.com (5 YouTube, 3 Vimeo). Titles were cleaned up by hand. Marked `[Replace with the projects Belal wants to feature.]`. Thumbnails load from YouTube and Vimeo; for a fully self hosted site, save them into `images/work/`.
- Services: 5 proposed services, marked `[Confirm the service list and wording with Belal.]`.
- Behind the scenes: every caption ends with `[edit caption]`. City mapping is my best guess from the photo content and Belal's chat list (Paris, NYC, London, Barcelona, Osaka, Toronto, Paris event). The NYC photo shows a COP16 Riyadh backdrop and the London photo a trade show; please confirm.
- About: paragraph marked `[Edit this paragraph with Belal.]`, stats `[12+]` and `[200+]`, client list `[confirm list and add logos]`. The client names come from the old site (Google MENA, RiseUp, testimonials from MAC and Penny Appeal Canada) and from the photos (ICAO, Riyadh Expo 2030).
- Testimonial: `[Client testimonial...]`, `[Name], [Role], [Company]`.
- Contact: `[reply time]`, `[confirm city]`. The old site lists Oakville, Ontario and a phone number; I did not copy the number into the page.
- JSON-LD: `[CITY]`, `[PHONE]`, `[EMAIL]` and the social URLs.

Links that are still placeholders fall back to `#contact` and show a tooltip, so nothing is broken in the draft.

## Questions for Belal

1. Domain: is it honamedia.com (as on the brand sheet) or another name? Who owns it?
2. Hosting: GitHub Pages, Firebase Hosting, or keep the current host of ultinityfilm.com? Should ultinityfilm.com redirect to the new domain?
3. Showreel: the YouTube link. Is it public or unlisted?
4. Services: are the 5 proposed services right? Anything to add (photography, drone, real estate, weddings, halal weddings and GCC services were on the old site)?
5. Portfolio: which 6 to 9 projects to feature, with client name, city and year. Any client logos we may show?
6. Behind the scenes: confirm each city and event name, and send more photos if wanted (landscape works best).
7. About: short bio, team size, founding year (2013 as on the old site?), and how to describe the Ultinity Film to HONA change.
8. Contact: WhatsApp number, email, booking link, social profiles, city.
9. Stats: real numbers for cities, projects, years.
10. Arabic: do we want an Arabic version? The switch exists but is hidden until a dictionary is written (see the end of `js/main.js`). It is cheap to add once the English copy is final.
11. Legal: company name for the footer and any registration details.

## How to host for free

GitHub Pages:
1. Create a repository and push this folder's contents to its root.
2. Settings, Pages, deploy from branch `main`, folder `/`.
3. Add the custom domain in the same screen and point the domain's DNS at GitHub Pages.

Firebase Hosting:
1. Install the Firebase CLI and run `firebase init hosting` in this folder. Public directory: `.` (this folder). Single page app: no.
2. Run `firebase deploy --only hosting`.
3. Add the custom domain under Hosting in the Firebase console.

After choosing the domain, replace every `[DOMAIN]` and check the OG image loads at the public URL.

## Checks done

- HTML validated with `tidy` (no errors).
- No horizontal scroll at 375 px, 768 px and 1440 px.
- Keyboard: skip link, menu button, cards, filter chips, modals (Escape closes, focus returns).
- Motion respects `prefers-reduced-motion`.
