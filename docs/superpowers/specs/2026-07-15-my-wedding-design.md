# /my-wedding — Design Spec

**Date:** 2026-07-15
**Status:** Approved design, pending spec review
**Route:** `/my-wedding`

## 1. Purpose & Scope

A **portfolio showcase piece**: a faithful clone of the "Song Hỷ Xanh" (green
double-happiness) online wedding invitation from
`chungdoi.com/vi/mau-thiep/song-hy-xanh/demo`, rebuilt in this Next.js App Router
portfolio to demonstrate front-end craft (immersive reveal, motion, responsive
editorial layout).

- **Content language:** Vietnamese (faithful to the reference).
- **Content data:** uses the couple photos already placed in `/public/wedding/`;
  names/dates/copy are placeholder wedding-invitation content stored in `data.ts`.
- **No real backend.** RSVP + guestbook are self-contained (seeded + in-memory).
- **Design fidelity:** clone the design *language* (layout, palette, type, motifs).
  Placeholder photos are the user's own; no proprietary assets copied from the
  reference. Fonts use free Google fonts (Cormorant Garamond, which the reference
  also uses).

### Non-goals (YAGNI)
- No database persistence, no API routes, no Payload collections.
- No auth, no admin editing UI.
- No i18n framework (Vietnamese only, hard-coded in `data.ts`).
- No background music, no multi-template system.

## 2. Architecture — Self-contained route module

```
app/(app)/my-wedding/
├── layout.tsx          # immersive shell: Cormorant Garamond font var, cream bg,
│                       # NO portfolio navbar/footer/theme chrome; scoped tokens
├── page.tsx            # server component — reads weddingData, composes sections
├── data.ts             # single typed source of truth (server-safe, static)
├── types.ts            # WeddingData, Wish, Rsvp, TimelineItem, GalleryPhoto…
├── wedding.css         # route-scoped CSS custom properties + keyframes
└── _components/
    ├── cover-gate.tsx        # (client) dark-green cover + 囍 field + "Mở thiệp" reveal
    ├── hy-pattern.tsx        # scattered 囍 background motif (CSS/text)
    ├── hero.tsx              # arch-framed photo, "WELCOME TO OUR WEDDING", "LOVE NEVER FAILS"
    ├── section-heading.tsx   # shared green banner heading (small-caps, tracked)
    ├── ceremony-info.tsx     # parents, groom & bride, ceremony date/venue
    ├── gallery.tsx           # (client) photo grid + lightbox
    ├── reception-info.tsx    # reception time + countdown + calendar widget + RSVP trigger
    ├── countdown.tsx         # (client) live ticking timer
    ├── calendar-widget.tsx   # month grid highlighting the wedding day + add-to-calendar link
    ├── venue.tsx             # reception address + lazy Google Maps iframe
    ├── dress-code.tsx        # color swatches
    ├── timeline.tsx          # wedding-day schedule (vertical)
    ├── guestbook.tsx         # (client) submit form + wishes list (seeded + in-memory)
    ├── rsvp-modal.tsx        # (client) RSVP form, success toast
    └── gift-box.tsx          # lì-xì / red-envelope section (SVG/CSS)
```

**Why a self-contained module (Approach A):** the feature is a one-off showcase
that will never share components with the portfolio. Isolating it keeps each
section small (<200 lines, repo rule), lets the card own its immersive layout
(no shared navbar/footer), and prevents leaking wedding-only tokens into the
portfolio design system.

### Server vs client boundary
Server components by default. Client islands only where interactivity requires:
`cover-gate`, `countdown`, `gallery` (lightbox), `guestbook`, `rsvp-modal`.
`page.tsx` stays a server component and passes typed data slices to each section.

## 3. Sections (top → bottom, matches reference)

1. **Cover gate** — deep-green full screen, scattered 囍, couple names (Cormorant
   Garamond), date "30 tháng 7, 2026", "Thân Mời", **Mở thiệp** button. Body scroll
   locked until opened.
2. **Hero** — arch-framed hero photo on cream, "WELCOME TO OUR WEDDING", groom/bride
   labels (Trưởng Nam / Cô Út), "LOVE NEVER FAILS".
3. **Thông tin lễ cưới** — parents' names (both sides), "Trân trọng báo tin…",
   groom `Võ Hải Nam` & bride `Huỳnh Khánh Linh`, ceremony venue (Tư Gia) + date block.
4. **Album ảnh cưới** — 6-photo grid + lightbox.
5. **Thông tin tiệc cưới** — reception time (18:00), **live countdown**, calendar
   widget (July 2026, day highlighted), add-to-calendar link, **Xác nhận tham dự** (RSVP).
6. **Tiệc cưới sẽ tổ chức tại** — venue address + lazy map iframe.
7. **Dress code** — "Trang phục dự tiệc" + 3 swatches (green / white / beige).
8. **Lịch trình ngày cưới** — timeline: 17:30 Đón khách · 18:30 Khai tiệc ·
   18:45 Rót rượu, cắt bánh · 19:00 Phục vụ món chính · 21:00 Kết thúc tiệc.
9. **Sổ lưu bút** — guestbook: submit form (name + message + avatar) → prepends to
   seeded wishes list.
10. **Hộp quà mừng** — lì-xì red-envelope graphic + closing line.
11. **Footer** — minimal (couple + date), no portfolio footer.

## 4. Data flow & state

- `data.ts` exports one typed `weddingData` object; imported by `page.tsx`.
- **Cover reveal:** `cover-gate` holds `opened` state; Framer Motion (already in
  repo) animates cover out / card in. Locks `document.body` scroll until opened;
  restores on cleanup.
- **Countdown:** `useEffect` + `setInterval(1000)`. Renders nothing until mounted
  (avoids SSR hydration mismatch), clears interval on unmount. Target from
  `weddingData.event.datetime`. If past → "Đã diễn ra".
- **RSVP:** `rsvp-modal` local `useState` form → validate → success toast (repo
  toaster) → close. Not persisted.
- **Guestbook:** seeds list from `weddingData.wishes`; submit **prepends** a new
  `Wish` immutably (`[newWish, ...prev]`). Resets on reload (expected).

## 5. Design tokens (route-scoped in `wedding.css`)

```
--wed-green:       #1F3A25   /* deep green banners/cover */
--wed-green-deep:  #142A1B   /* cover gradient base */
--wed-cream:       #F7EFE0   /* card canvas */
--wed-cream-text:  #E8F0E4   /* text on green */
--wed-ink:         #1F3A25   /* text on cream */
--wed-red:         #B91C1C   /* 囍 + lì-xì accent */
--wed-gold:        #C9A227   /* gilt detail */
```
- **Fonts:** Cormorant Garamond (display, `next/font/google`, scoped var
  `--font-cormorant`) + existing Inter for small-caps tracked labels.
- **Motion:** compositor-friendly only (`transform`/`opacity`); all reveal/scroll
  motion respects `prefers-reduced-motion` (falls back to no animation).

## 6. Assets & image optimization

Source files in `/public/wedding/` are 10–22 MB (4000×6000 / 6000×4000), ~120 MB total.

**Pre-optimization step (part of implementation):**
- Generate web derivatives (max ~2400px long edge, ~82% quality, EXIF stripped)
  via `sips` (or `sharp`) written back into `/public/wedding/`.
- Move originals to `/public/wedding/_originals/` and git-ignore that folder so the
  build/repo doesn't ship 120 MB.
- `next/image` serves responsive AVIF/WebP from the optimized files.

**Mapping (configurable in `data.ts`):**
- Hero: `N2552166.JPG` (couple in floral arch — best tall crop).
- Gallery 1–6: all six `N25…JPG` (landscape `N2551429` as a wide tile).
- Ceremony portraits: `groom.JPG`, `bride.JPG`.
- Map: Google Maps iframe (no file).

All `next/image` usages get explicit `width`/`height` (or `fill` + sized parent),
`sizes`, hero `priority`, below-fold `loading="lazy"`.

## 7. Error handling & edge cases

- Guestbook/RSVP: required-field validation (trim, min length, max length),
  inline errors, submit disabled while invalid.
- Countdown past-date guard → "Đã diễn ra".
- Map iframe lazy + `loading="lazy"`; graceful if blocked (address text always shown).
- Reduced-motion users get static layout.

## 8. Testing

- **Unit:** `getTimeLeft` countdown math (incl. past-date); guestbook append is
  immutable; `data.ts` shape sanity.
- **Component (Vitest + jsdom):** cover reveal toggles + scroll-lock; RSVP blocks
  empty submit + toast on valid; guestbook renders seeded + prepends new wish.
- **Visual/E2E (optional, Playwright):** card opens; sections render at 375 & 1440.

## 9. Accessibility

- Semantic landmarks (`main`, `section` + `aria-labelledby` per section heading).
- "Mở thiệp" is a real `<button>`; RSVP modal focus-trapped + Esc-closable
  (Radix Dialog, already in repo).
- Alt text on all photos; color-contrast checked on green-on-cream / cream-on-green.
- Keyboard-navigable gallery lightbox and forms.

## 10. Open items / follow-ups (out of scope for v1)
- Swap placeholder copy (names, parents, addresses) for real values later — all in `data.ts`.
- Optional background music toggle.
- Optional real persistence (Payload) if it ever becomes a live card.
