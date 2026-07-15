# /my-wedding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an immersive, faithful clone of the "Song Hỷ Xanh" Vietnamese online wedding invitation at route `/my-wedding` as a portfolio showcase.

**Architecture:** A self-contained route module under `app/(app)/my-wedding/` — a server-component `page.tsx` composes ~15 section components from a private `_components/` folder, all fed by one typed static `data.ts`. A nested `layout.tsx` supplies the Cormorant Garamond font and route-scoped design tokens (no portfolio navbar/footer to fight — they self-hide). Interactivity (open-card reveal, live countdown, RSVP modal, guestbook) lives in small client islands with in-memory/seeded state; no backend, no DB.

**Tech Stack:** Next.js App Router (React 19), TypeScript, Tailwind v4, framer-motion, Radix Dialog (`@/components/ui/dialog`), shadcn toast (`@/hooks/use-toast`), `next/image`, `next/font/google` (Cormorant Garamond), Vitest + jsdom + @testing-library/react.

## Context

`/my-wedding` is a **portfolio showcase piece** (design/front-end craft demo), not a live wedding card. It clones the *design language* of `chungdoi.com/vi/mau-thiep/song-hy-xanh/demo` — deep-green + cream palette, double-happiness (囍) motif, arch-framed hero, editorial serif type, section-by-section reveal — using the couple's own photos already dropped in `/public/wedding/`. Content is Vietnamese, stored as placeholder data in `data.ts`. RSVP and guestbook are self-contained (seeded + in-memory; reset on reload). Approved design spec: `docs/superpowers/specs/2026-07-15-my-wedding-design.md`.

## Global Constraints

- **Route:** `app/(app)/my-wedding/` (inside the `(app)` route group). Private components in `_components/` (underscore = non-route). Pure utils in `app/(app)/my-wedding/lib/`.
- **Language:** Vietnamese only, hard-coded in `data.ts`. No i18n framework.
- **No backend:** no API routes, no Payload collections, no DB, no persistence. Guestbook/RSVP are in-memory (`useState`), guestbook seeds from `data.ts`.
- **Colors (route-scoped CSS vars, never the portfolio's theme tokens):** `--wed-green:#1F3A25`, `--wed-green-deep:#142A1B`, `--wed-cream:#F7EFE0`, `--wed-cream-text:#E8F0E4`, `--wed-ink:#1F3A25`, `--wed-red:#B91C1C`, `--wed-gold:#C9A227`. Do NOT rely on `next-themes` (page must look identical in light/dark).
- **Fonts:** Cormorant Garamond (display/names/headings) via `next/font/google` → `--font-cormorant`; existing Inter for small-caps tracked labels/body.
- **Motion:** animate only `transform`/`opacity`; every reveal/scroll animation respects `prefers-reduced-motion` (via framer-motion `useReducedMotion`).
- **Imports:** `import { motion, useReducedMotion } from "framer-motion"` (NOT `"motion"`). `cn` from `@/lib/utils`. Toast: `import { useToast } from "@/hooks/use-toast"`.
- **Images:** every `next/image` gets explicit `width`/`height` (or `fill` + sized parent) + `sizes`; hero `priority`; below-fold `loading="lazy"`. Reference files by lowercase `.jpg` names.
- **Event date (countdown target):** `2026-07-30T18:00:00+07:00`.
- **Tests:** live under `tests/my-wedding/`. Add a local `window.matchMedia` mock in any test rendering a component that calls `useReducedMotion`. Wrap `vi.advanceTimersByTime` in `act()`. Run one file: `pnpm vitest run tests/my-wedding/<file>`.
- **Commit** after each task with Conventional Commit messages (`feat:` / `test:` / `chore:`). Branch: `feat/my-wedding`.

---

## Task 1: Optimize wedding images & normalize filenames

**Files:**
- Create: `scripts/optimize-wedding-images.sh`
- Modify: `.gitignore` (add `public/wedding/_originals/`)
- Assets: rewrite `/public/wedding/*.JPG` → optimized lowercase `.jpg`; originals moved to `/public/wedding/_originals/`

**Interfaces:**
- Produces: optimized files `public/wedding/{gallery-1..6,groom,bride}.jpg` (≤2400px long edge, ~q80, EXIF stripped). Filename→source mapping (sorted): `gallery-1`←N2551429 (landscape aerial), `gallery-2`←N2551503, `gallery-3`←N2552166 (**hero**), `gallery-4`←N2570313, `gallery-5`←N2570338, `gallery-6`←N2571105.

- [ ] **Step 1: Write the optimization script**

```bash
#!/usr/bin/env bash
# scripts/optimize-wedding-images.sh
# Resize + recompress the raw wedding photos for web delivery.
# Originals are preserved under public/wedding/_originals/ (git-ignored).
set -euo pipefail
DIR="public/wedding"
ORIG="$DIR/_originals"
mkdir -p "$ORIG"

# source .JPG -> semantic lowercase .jpg (sorted N-files -> gallery-1..6)
map=(
  "N2551429.JPG:gallery-1.jpg"
  "N2551503.JPG:gallery-2.jpg"
  "N2552166.JPG:gallery-3.jpg"
  "N2570313.JPG:gallery-4.jpg"
  "N2570338.JPG:gallery-5.jpg"
  "N2571105.JPG:gallery-6.jpg"
  "groom.JPG:groom.jpg"
  "bride.JPG:bride.jpg"
)
for pair in "${map[@]}"; do
  src="${pair%%:*}"; out="${pair##*:}"
  [ -f "$DIR/$src" ] || { echo "skip missing $src"; continue; }
  # produce optimized web copy (max 2400px long edge, quality 80)
  sips -Z 2400 -s format jpeg -s formatOptions 80 "$DIR/$src" --out "$DIR/$out" >/dev/null
  # preserve original, then remove uppercase source from served dir
  mv "$DIR/$src" "$ORIG/$src"
  echo "optimized $src -> $out ($(du -h "$DIR/$out" | cut -f1))"
done
echo "Done. Optimized files in $DIR, originals in $ORIG."
```

- [ ] **Step 2: Run the script**

Run: `bash scripts/optimize-wedding-images.sh`
Expected: prints 8 `optimized … -> …` lines; each optimized file is a few hundred KB.

- [ ] **Step 3: Verify output**

Run: `ls -la public/wedding/*.jpg && du -sh public/wedding/*.jpg | sort -h | tail -3`
Expected: `gallery-1.jpg … gallery-6.jpg`, `groom.jpg`, `bride.jpg` all present; largest optimized file well under ~1 MB. `public/wedding/_originals/` holds the 8 `.JPG` originals.

- [ ] **Step 4: Ignore originals & commit**

Add `public/wedding/_originals/` to `.gitignore`.
```bash
git add scripts/optimize-wedding-images.sh .gitignore public/wedding/*.jpg
git commit -m "chore: optimize wedding photos and normalize filenames"
```

---

## Task 2: Types + static wedding data

**Files:**
- Create: `app/(app)/my-wedding/types.ts`
- Create: `app/(app)/my-wedding/data.ts`
- Test: `tests/my-wedding/data.test.ts`

**Interfaces:**
- Produces (`types.ts`):
```ts
export interface Person { name: string; role: string; } // role e.g. "Trưởng Nam"
export interface Parents { side: string; father: string; mother: string; address: string; }
export interface GalleryPhoto { src: string; alt: string; wide?: boolean; }
export interface TimelineItem { time: string; label: string; }
export interface Wish { id: string; name: string; message: string; avatar: string; createdAt: string; }
export interface WeddingData {
  couple: { groom: Person; bride: Person; combined: string; };
  parents: { groom: Parents; bride: Parents; };
  cover: { date: string; invite: string; };
  event: { datetime: string; timeLabel: string; dateBlock: { weekday: string; day: string; month: string; year: string; lunar: string; }; ceremonyVenue: string; };
  reception: { venueName: string; address: string; mapQuery: string; };
  hero: { src: string; alt: string; };
  portraits: { groom: { src: string; alt: string }; bride: { src: string; alt: string } };
  gallery: GalleryPhoto[];
  dressCode: { note: string; swatches: string[] };
  timeline: TimelineItem[];
  wishes: Wish[];
}
export declare const weddingData: WeddingData;
```
- Produces (`data.ts`): `export const weddingData: WeddingData = { … }` with real Vietnamese content: couple Võ Hải Nam (Trưởng Nam) & Huỳnh Khánh Linh (Út Nữ); `event.datetime = "2026-07-30T18:00:00+07:00"`; `hero.src = "/wedding/gallery-3.jpg"`; `gallery` = 6 entries `/wedding/gallery-1.jpg … gallery-6.jpg` (`gallery-1` `wide: true`); `portraits` → `/wedding/groom.jpg`, `/wedding/bride.jpg`; `timeline` = 5 items (17:30 Đón khách · 18:30 Khai tiệc · 18:45 Rót rượu, cắt bánh · 19:00 Phục vụ món chính · 21:00 Kết thúc tiệc); `wishes` = 4 seeded entries with fixed `id`/`createdAt` (no `Date.now()` — deterministic strings); `dressCode.swatches = ["#3E5C3A", "#F3EFE4", "#D8CBB0"]`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/my-wedding/data.test.ts
import { describe, it, expect } from "vitest";
import { weddingData } from "@/app/(app)/my-wedding/data";

describe("weddingData", () => {
  it("has the couple and combined title", () => {
    expect(weddingData.couple.groom.name).toBe("Võ Hải Nam");
    expect(weddingData.couple.bride.name).toBe("Huỳnh Khánh Linh");
    expect(weddingData.couple.combined).toMatch(/&/);
  });
  it("event datetime is a valid future-facing ISO string", () => {
    expect(weddingData.event.datetime).toBe("2026-07-30T18:00:00+07:00");
    expect(Number.isNaN(Date.parse(weddingData.event.datetime))).toBe(false);
  });
  it("has exactly 6 gallery photos all under /wedding/", () => {
    expect(weddingData.gallery).toHaveLength(6);
    for (const p of weddingData.gallery) expect(p.src.startsWith("/wedding/")).toBe(true);
  });
  it("has a 5-step timeline and at least one seeded wish", () => {
    expect(weddingData.timeline).toHaveLength(5);
    expect(weddingData.wishes.length).toBeGreaterThan(0);
    for (const w of weddingData.wishes) expect(w.id && w.createdAt).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/data.test.ts`
Expected: FAIL — cannot resolve `@/app/(app)/my-wedding/data`.

- [ ] **Step 3: Implement `types.ts` then `data.ts`**

Create `types.ts` with the interfaces above. Create `data.ts` populating every field per the Interfaces block (real Vietnamese copy; deterministic `wishes` ids/timestamps).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/data.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/types.ts app/\(app\)/my-wedding/data.ts tests/my-wedding/data.test.ts
git commit -m "feat: add /my-wedding data model and static content"
```

---

## Task 3: Pure logic — countdown math & guestbook append

**Files:**
- Create: `app/(app)/my-wedding/lib/countdown.ts`
- Create: `app/(app)/my-wedding/lib/wishes.ts`
- Test: `tests/my-wedding/countdown.test.ts`, `tests/my-wedding/wishes.test.ts`

**Interfaces:**
- Produces:
```ts
// countdown.ts
export interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; past: boolean; }
export function getTimeLeft(targetISO: string, nowMs: number): TimeLeft;
// wishes.ts
import type { Wish } from "@/app/(app)/my-wedding/types";
export function makeWish(input: { name: string; message: string; avatar: string }, nowMs: number): Wish;
export function prependWish(list: Wish[], wish: Wish): Wish[]; // returns NEW array, no mutation
```
- `getTimeLeft`: returns component parts; when `target <= now`, returns all-zero with `past: true`.
- `makeWish`: `id` = `String(nowMs)`, `createdAt` = `new Date(nowMs).toISOString()`, trims name/message.
- `prependWish`: `[wish, ...list]` (immutable).

- [ ] **Step 1: Write failing tests**

```ts
// tests/my-wedding/countdown.test.ts
import { describe, it, expect } from "vitest";
import { getTimeLeft } from "@/app/(app)/my-wedding/lib/countdown";

const target = "2026-07-30T18:00:00+07:00";
describe("getTimeLeft", () => {
  it("computes days/hours/minutes/seconds remaining", () => {
    const now = Date.parse("2026-07-29T17:00:00+07:00"); // 1 day 1 hour before
    const t = getTimeLeft(target, now);
    expect(t).toMatchObject({ days: 1, hours: 1, minutes: 0, seconds: 0, past: false });
  });
  it("flags past when target already happened", () => {
    const now = Date.parse("2026-08-01T00:00:00+07:00");
    expect(getTimeLeft(target, now)).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true });
  });
});
```
```ts
// tests/my-wedding/wishes.test.ts
import { describe, it, expect } from "vitest";
import { makeWish, prependWish } from "@/app/(app)/my-wedding/lib/wishes";

describe("wishes", () => {
  it("makeWish trims and stamps deterministically", () => {
    const w = makeWish({ name: "  An  ", message: "  Chúc mừng  ", avatar: "🌿" }, 1_700_000_000_000);
    expect(w.name).toBe("An");
    expect(w.message).toBe("Chúc mừng");
    expect(w.id).toBe("1700000000000");
    expect(w.createdAt).toBe(new Date(1_700_000_000_000).toISOString());
  });
  it("prependWish returns a new array with the wish first (no mutation)", () => {
    const base = [{ id: "1", name: "B", message: "x", avatar: "🌸", createdAt: "t" }];
    const next = prependWish(base, { id: "2", name: "A", message: "y", avatar: "🌿", createdAt: "t2" });
    expect(next).toHaveLength(2);
    expect(next[0].id).toBe("2");
    expect(base).toHaveLength(1); // original untouched
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run tests/my-wedding/countdown.test.ts tests/my-wedding/wishes.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement both modules**

`countdown.ts`: `const diff = Date.parse(targetISO) - nowMs; if (diff <= 0) return {days:0,hours:0,minutes:0,seconds:0,past:true};` then derive parts with `Math.floor` (days `/86400000`, hours `%86400000/3600000`, etc.).
`wishes.ts`: implement `makeWish` (trim + stamp) and `prependWish` (`[wish, ...list]`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run tests/my-wedding/countdown.test.ts tests/my-wedding/wishes.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/lib tests/my-wedding/countdown.test.ts tests/my-wedding/wishes.test.ts
git commit -m "feat: add countdown and guestbook pure-logic helpers"
```

---

## Task 4: Route shell — layout, tokens, page skeleton

**Files:**
- Create: `app/(app)/my-wedding/wedding.css`
- Create: `app/(app)/my-wedding/layout.tsx`
- Create: `app/(app)/my-wedding/page.tsx`
- Test: `tests/my-wedding/page-smoke.test.tsx`

**Interfaces:**
- Produces: default-exported `WeddingLayout({ children })` wrapping children in `<div className={cn(cormorant.variable, "wed-root")}>`; `wedding.css` defines `.wed-root { --wed-green:…; … background:var(--wed-cream); color:var(--wed-ink); }` plus keyframe utilities. `page.tsx` = server component exporting `metadata` + default `WeddingPage()` rendering `<main data-testid="wedding-page">` composing section components (placeholders until later tasks).

- [ ] **Step 1: Write the failing smoke test**

```tsx
// tests/my-wedding/page-smoke.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WeddingPage from "@/app/(app)/my-wedding/page";

describe("WeddingPage", () => {
  it("renders the wedding main landmark and couple name", () => {
    render(<WeddingPage />);
    expect(screen.getByTestId("wedding-page")).toBeInTheDocument();
    expect(screen.getAllByText(/Hải Nam/).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/page-smoke.test.tsx`
Expected: FAIL — `page` module not found.

- [ ] **Step 3: Implement the shell**

`wedding.css`: `.wed-root` with all `--wed-*` vars (Global Constraints), `min-height`, base bg/color, and a `font-[family-name:var(--font-cormorant)]` helper class `.wed-display`. Import it in `layout.tsx` (`import "./wedding.css"`).
`layout.tsx`:
```tsx
import { Cormorant_Garamond } from "next/font/google";
import { cn } from "@/lib/utils";
import "./wedding.css";
const cormorant = Cormorant_Garamond({ subsets: ["latin","vietnamese"], weight: ["400","500","600","700"], variable: "--font-cormorant" });
export default function WeddingLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn(cormorant.variable, "wed-root")}>{children}</div>;
}
```
`page.tsx` (server component): `export const metadata = { title: "Hải Nam & Khánh Linh — Thiệp Cưới" };` and a `WeddingPage` returning `<main data-testid="wedding-page">` that renders the `CoverGate` wrapping the couple name (temporary inline `<h1>{weddingData.couple.combined}</h1>` placeholder) — later tasks replace the body. Import `weddingData` from `./data`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/page-smoke.test.tsx`
Expected: PASS.

- [ ] **Step 5: Manually verify route renders**

Run: `pnpm dev`, open `http://localhost:3000/my-wedding`. Expected: cream page, Cormorant name visible, no navbar/footer.

- [ ] **Step 6: Commit**

```bash
git add app/\(app\)/my-wedding/wedding.css app/\(app\)/my-wedding/layout.tsx app/\(app\)/my-wedding/page.tsx tests/my-wedding/page-smoke.test.tsx
git commit -m "feat: scaffold /my-wedding route shell with scoped tokens and font"
```

---

## Task 5: Shared presentational — SectionHeading + HyPattern

**Files:**
- Create: `app/(app)/my-wedding/_components/section-heading.tsx`
- Create: `app/(app)/my-wedding/_components/hy-pattern.tsx`
- Test: `tests/my-wedding/section-heading.test.tsx`

**Interfaces:**
- Produces:
```tsx
export function SectionHeading({ children }: { children: React.ReactNode }): JSX.Element; // green banner, cream small-caps tracked label
export function HyPattern({ className }?: { className?: string }): JSX.Element; // decorative scattered 囍, aria-hidden
```

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/section-heading.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SectionHeading } from "@/app/(app)/my-wedding/_components/section-heading";

it("renders a heading with its label text", () => {
  render(<SectionHeading>THÔNG TIN LỄ CƯỚI</SectionHeading>);
  expect(screen.getByText("THÔNG TIN LỄ CƯỚI")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/section-heading.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement components**

`section-heading.tsx`: full-width green band — `<div className="bg-[var(--wed-green)] py-3 text-center"><span className="font-[Inter] text-sm uppercase tracking-[0.25em] text-[var(--wed-cream-text)]">{children}</span></div>`.
`hy-pattern.tsx`: `aria-hidden` absolutely-positioned layer scattering `囍` glyphs at low opacity in `--wed-green`/`--wed-red`; accepts `className` for placement. Pure CSS, no images.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/section-heading.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/section-heading.tsx app/\(app\)/my-wedding/_components/hy-pattern.tsx tests/my-wedding/section-heading.test.tsx
git commit -m "feat: add SectionHeading and HyPattern presentational components"
```

---

## Task 6: CoverGate (open-card reveal + scroll lock)

**Files:**
- Create: `app/(app)/my-wedding/_components/cover-gate.tsx`
- Test: `tests/my-wedding/cover-gate.test.tsx`

**Interfaces:**
- Consumes: `weddingData.couple.combined`, `weddingData.cover.date`, `weddingData.cover.invite`.
- Produces: `"use client"` default `CoverGate({ children }: { children: React.ReactNode })`. Shows deep-green cover (HyPattern bg, couple name, date, "Thân Mời", **Mở thiệp** button). On click → `opened=true`: animate cover out (framer-motion `opacity`/`translateY`, honoring `useReducedMotion`) and render `children`. Locks `document.body.style.overflow="hidden"` until opened; restores in cleanup.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/cover-gate.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeAll } from "vitest";
import CoverGate from "@/app/(app)/my-wedding/_components/cover-gate";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, onchange: null, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false } as any));
});

it("hides children until 'Mở thiệp' is clicked", async () => {
  const user = userEvent.setup();
  render(<CoverGate><p>INNER CARD</p></CoverGate>);
  expect(screen.queryByText("INNER CARD")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /Mở thiệp/i }));
  expect(await screen.findByText("INNER CARD")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/cover-gate.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement CoverGate**

`"use client"`; `useState(false)` for `opened`; `useReducedMotion()`; `useEffect` toggling `document.body.style.overflow`. Render cover with `motion.div` (AnimatePresence exit) + button `onClick={() => setOpened(true)}`; render `{opened && children}`. Reduced-motion → skip transition (`transition={{ duration: reduce ? 0 : 0.8 }}`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/cover-gate.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/cover-gate.tsx tests/my-wedding/cover-gate.test.tsx
git commit -m "feat: add CoverGate open-card reveal with scroll lock"
```

---

## Task 7: Hero section

**Files:**
- Create: `app/(app)/my-wedding/_components/hero.tsx`
- Test: `tests/my-wedding/hero.test.tsx`

**Interfaces:**
- Consumes: `weddingData.hero`, `weddingData.couple`.
- Produces: `Hero()` server component — arch-framed hero image (`next/image` `priority`, explicit dims, `sizes`), "WELCOME TO OUR WEDDING" eyebrow, groom/bride role labels, "LOVE NEVER FAILS" line. Arch shape via `clip-path`/`border-radius` on a wrapper.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/hero.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "@/app/(app)/my-wedding/_components/hero";

it("renders eyebrow and the hero image alt", () => {
  render(<Hero />);
  expect(screen.getByText(/WELCOME TO OUR WEDDING/i)).toBeInTheDocument();
  expect(screen.getByRole("img")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/hero.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Hero**

Use `next/image` with `weddingData.hero.src`, `width={1200} height={1600}`, `priority`, `sizes="(max-width:768px) 90vw, 480px"`, wrapper with arch `clip-path`. Add eyebrow + names in `.wed-display`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/hero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/hero.tsx tests/my-wedding/hero.test.tsx
git commit -m "feat: add arch-framed wedding hero section"
```

---

## Task 8: CeremonyInfo section

**Files:**
- Create: `app/(app)/my-wedding/_components/ceremony-info.tsx`
- Test: `tests/my-wedding/ceremony-info.test.tsx`

**Interfaces:**
- Consumes: `weddingData.parents`, `weddingData.couple`, `weddingData.event`, `weddingData.portraits`.
- Produces: `CeremonyInfo()` — SectionHeading "THÔNG TIN LỄ CƯỚI"; two parent columns (groom side / bride side); "Trân trọng báo tin lễ thành hôn của con chúng tôi"; groom & bride names (Cormorant, large) with role captions; optional groom/bride portraits (`next/image`, lazy); ceremony venue + big date block (weekday · 30 · Tháng 07 · 2026 · lunar note).

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/ceremony-info.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CeremonyInfo from "@/app/(app)/my-wedding/_components/ceremony-info";

it("shows both names and the day number", () => {
  render(<CeremonyInfo />);
  expect(screen.getByText("Võ Hải Nam")).toBeInTheDocument();
  expect(screen.getByText("Huỳnh Khánh Linh")).toBeInTheDocument();
  expect(screen.getByText("30")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/ceremony-info.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement CeremonyInfo** per Interfaces (reuse `SectionHeading`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/ceremony-info.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/ceremony-info.tsx tests/my-wedding/ceremony-info.test.tsx
git commit -m "feat: add ceremony info section with parents and date block"
```

---

## Task 9: Gallery + lightbox

**Files:**
- Create: `app/(app)/my-wedding/_components/gallery.tsx`
- Test: `tests/my-wedding/gallery.test.tsx`

**Interfaces:**
- Consumes: `weddingData.gallery`.
- Produces: `"use client"` `Gallery()` — SectionHeading "ALBUM ẢNH CƯỚI"; responsive grid of 6 `next/image` thumbs (`gallery-1` spans wide via `md:col-span-2`); clicking a thumb opens a lightbox (Radix `Dialog` from `@/components/ui/dialog`) showing the full image; Esc/overlay closes (free via Radix).

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/gallery.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Gallery from "@/app/(app)/my-wedding/_components/gallery";

it("renders 6 thumbnails and opens a lightbox on click", async () => {
  const user = userEvent.setup();
  render(<Gallery />);
  const imgs = screen.getAllByRole("img");
  expect(imgs.length).toBeGreaterThanOrEqual(6);
  await user.click(screen.getAllByRole("button")[0]);
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/gallery.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Gallery** — grid of `<button>`-wrapped thumbs, `useState<number|null>` for active index, `Dialog open={active!==null} onOpenChange={() => setActive(null)}` rendering the full-size image in `DialogContent`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/gallery.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/gallery.tsx tests/my-wedding/gallery.test.tsx
git commit -m "feat: add wedding photo gallery with lightbox"
```

---

## Task 10: Countdown (client, live timer)

**Files:**
- Create: `app/(app)/my-wedding/_components/countdown.tsx`
- Test: `tests/my-wedding/countdown-component.test.tsx`

**Interfaces:**
- Consumes: `getTimeLeft` (Task 3), `weddingData.event.datetime`.
- Produces: `"use client"` `Countdown({ targetISO }: { targetISO: string })` — renders 4 cells (Ngày/Giờ/Phút/Giây). Uses `useState`+`useEffect`+`setInterval(1000)`; computes via `getTimeLeft(targetISO, Date.now())`; renders `null` until mounted (avoid hydration mismatch); clears interval on unmount; when `past` shows "Đã diễn ra".

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/countdown-component.test.tsx
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Countdown from "@/app/(app)/my-wedding/_components/countdown";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("renders countdown cells and ticks", () => {
  vi.setSystemTime(new Date("2026-07-29T17:59:58+07:00"));
  render(<Countdown targetISO="2026-07-30T18:00:00+07:00" />);
  act(() => { vi.advanceTimersByTime(0); });          // mount effect
  expect(screen.getByText(/Ngày/i)).toBeInTheDocument();
  act(() => { vi.advanceTimersByTime(1000); });
  expect(screen.getByText(/Giây/i)).toBeInTheDocument();
});

it("shows 'Đã diễn ra' when the date passed", () => {
  vi.setSystemTime(new Date("2026-08-01T00:00:00+07:00"));
  render(<Countdown targetISO="2026-07-30T18:00:00+07:00" />);
  act(() => { vi.advanceTimersByTime(0); });
  expect(screen.getByText(/Đã diễn ra/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/countdown-component.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Countdown** using `getTimeLeft`; `mounted` guard; interval cleanup.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/countdown-component.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/countdown.tsx tests/my-wedding/countdown-component.test.tsx
git commit -m "feat: add live wedding countdown component"
```

---

## Task 11: CalendarWidget + ReceptionInfo

**Files:**
- Create: `app/(app)/my-wedding/_components/calendar-widget.tsx`
- Create: `app/(app)/my-wedding/_components/reception-info.tsx`
- Test: `tests/my-wedding/calendar-widget.test.tsx`

**Interfaces:**
- Consumes: `weddingData.event`, `Countdown`, `CalendarWidget`, RSVP trigger.
- Produces:
```tsx
export function CalendarWidget({ year, month, day }: { year: number; month: number; day: number }): JSX.Element; // month grid, highlights `day`
export default function ReceptionInfo({ onRsvp }: { onRsvp: () => void }): JSX.Element; // SectionHeading "THÔNG TIN TIỆC CƯỚI" + time + <Countdown> + <CalendarWidget> + add-to-calendar link + "Xác nhận tham dự" button
```
- `CalendarWidget`: static (no state) July 2026 grid; the `day` cell gets a `--wed-green` ring/dot.
- Add-to-calendar link: a Google Calendar `render?action=TEMPLATE` URL built from `weddingData.event` (opens new tab). No library.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/calendar-widget.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CalendarWidget } from "@/app/(app)/my-wedding/_components/calendar-widget";

it("renders the target day and marks it", () => {
  render(<CalendarWidget year={2026} month={7} day={30} />);
  const cell = screen.getByText("30");
  expect(cell).toBeInTheDocument();
  expect(cell.closest("[data-active='true']")).not.toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/calendar-widget.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement CalendarWidget then ReceptionInfo.** Calendar builds weeks with `new Date(year, month-1, 1)`; active cell wrapper gets `data-active="true"`. ReceptionInfo composes `Countdown targetISO={weddingData.event.datetime}`, the calendar (`day=30 month=7 year=2026`), add-to-calendar `<a target="_blank" rel="noopener">`, and a `<button onClick={onRsvp}>Xác nhận tham dự</button>`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/calendar-widget.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/calendar-widget.tsx app/\(app\)/my-wedding/_components/reception-info.tsx tests/my-wedding/calendar-widget.test.tsx
git commit -m "feat: add reception info with calendar and add-to-calendar link"
```

---

## Task 12: RsvpModal (Radix Dialog + validation + toast)

**Files:**
- Create: `app/(app)/my-wedding/_components/rsvp-modal.tsx`
- Test: `tests/my-wedding/rsvp-modal.test.tsx`

**Interfaces:**
- Consumes: `@/components/ui/dialog`, `@/hooks/use-toast`.
- Produces: `"use client"` `RsvpModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void })` — form fields: name (required), attendance select (Có/Không), guest count, message. Submit disabled until name non-empty; on submit → `toast({ title: "Cảm ơn bạn!", description: … })`, then `onOpenChange(false)`.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/rsvp-modal.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import RsvpModal from "@/app/(app)/my-wedding/_components/rsvp-modal";

const toastMock = vi.fn();
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: toastMock }) }));

it("disables submit until a name is entered, then toasts", async () => {
  const user = userEvent.setup();
  const onOpenChange = vi.fn();
  render(<RsvpModal open onOpenChange={onOpenChange} />);
  const submit = screen.getByRole("button", { name: /Gửi xác nhận/i });
  expect(submit).toBeDisabled();
  await user.type(screen.getByLabelText(/Tên/i), "An Nguyễn");
  expect(submit).toBeEnabled();
  await user.click(submit);
  expect(toastMock).toHaveBeenCalled();
  expect(onOpenChange).toHaveBeenCalledWith(false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/rsvp-modal.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement RsvpModal** — controlled `Dialog`; local `useState` for fields; `disabled={!name.trim()}`; submit handler fires toast + closes. Label inputs with `htmlFor`/`id` so `getByLabelText` works.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/rsvp-modal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/rsvp-modal.tsx tests/my-wedding/rsvp-modal.test.tsx
git commit -m "feat: add RSVP modal with validation and toast confirmation"
```

---

## Task 13: Static trio — Venue, DressCode, Timeline

**Files:**
- Create: `app/(app)/my-wedding/_components/venue.tsx`
- Create: `app/(app)/my-wedding/_components/dress-code.tsx`
- Create: `app/(app)/my-wedding/_components/timeline.tsx`
- Test: `tests/my-wedding/static-sections.test.tsx`

**Interfaces:**
- Consumes: `weddingData.reception`, `weddingData.dressCode`, `weddingData.timeline`.
- Produces: `Venue()` (SectionHeading "TIỆC CƯỚI SẼ TỔ CHỨC TẠI" + address text + lazy Google Maps `<iframe loading="lazy">` from `reception.mapQuery`); `DressCode()` ("DRESS CODE", note, swatch dots from `dressCode.swatches`); `Timeline()` ("LỊCH TRÌNH NGÀY CƯỚI", vertical list of `time` + `label`).

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/static-sections.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Venue from "@/app/(app)/my-wedding/_components/venue";
import DressCode from "@/app/(app)/my-wedding/_components/dress-code";
import Timeline from "@/app/(app)/my-wedding/_components/timeline";

it("venue shows address", () => { render(<Venue />); expect(screen.getByText(/Gala Center/i)).toBeInTheDocument(); });
it("dress code shows heading", () => { render(<DressCode />); expect(screen.getByText(/DRESS CODE/i)).toBeInTheDocument(); });
it("timeline shows all 5 steps", () => {
  render(<Timeline />);
  expect(screen.getByText(/Đón khách/i)).toBeInTheDocument();
  expect(screen.getByText(/Kết thúc tiệc/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/static-sections.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the three components** per Interfaces (each reuses `SectionHeading`). Venue address must include `"Gala Center"` (set in `data.ts` `reception.venueName`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/static-sections.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/venue.tsx app/\(app\)/my-wedding/_components/dress-code.tsx app/\(app\)/my-wedding/_components/timeline.tsx tests/my-wedding/static-sections.test.tsx
git commit -m "feat: add venue, dress code, and wedding-day timeline sections"
```

---

## Task 14: Guestbook (seeded + in-memory append)

**Files:**
- Create: `app/(app)/my-wedding/_components/guestbook.tsx`
- Test: `tests/my-wedding/guestbook.test.tsx`

**Interfaces:**
- Consumes: `weddingData.wishes`, `makeWish`/`prependWish` (Task 3).
- Produces: `"use client"` `Guestbook()` — SectionHeading "SỔ LƯU BÚT"; form (name input, message textarea, avatar/emoji picker, "Gửi lời chúc" button); on submit prepends a new wish to local `useState` list (seeded from `weddingData.wishes`); renders each wish (avatar, name, message, formatted time). Submit disabled while name or message empty.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/guestbook.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Guestbook from "@/app/(app)/my-wedding/_components/guestbook";

it("renders seeded wishes and prepends a new one", async () => {
  const user = userEvent.setup();
  render(<Guestbook />);
  const before = screen.getAllByTestId("wish-item").length;
  expect(before).toBeGreaterThan(0);
  await user.type(screen.getByLabelText(/Tên/i), "Minh");
  await user.type(screen.getByLabelText(/Lời chúc/i), "Chúc hai bạn trăm năm hạnh phúc");
  await user.click(screen.getByRole("button", { name: /Gửi lời chúc/i }));
  const after = screen.getAllByTestId("wish-item");
  expect(after.length).toBe(before + 1);
  expect(after[0]).toHaveTextContent("Minh");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/guestbook.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Guestbook** — `useState(weddingData.wishes)`; submit → `prependWish(list, makeWish({name,message,avatar}, Date.now()))`; each wish wrapper `data-testid="wish-item"`; inputs labelled (`htmlFor`/`id`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/guestbook.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding/_components/guestbook.tsx tests/my-wedding/guestbook.test.tsx
git commit -m "feat: add guestbook with seeded wishes and in-memory submissions"
```

---

## Task 15: GiftBox + WeddingFooter + full page composition

**Files:**
- Create: `app/(app)/my-wedding/_components/gift-box.tsx`
- Create: `app/(app)/my-wedding/_components/wedding-footer.tsx`
- Modify: `app/(app)/my-wedding/page.tsx` (compose all sections)
- Test: `tests/my-wedding/full-page.test.tsx`

**Interfaces:**
- Consumes: all section components + `weddingData`.
- Produces: `GiftBox()` (SectionHeading "HỘP QUÀ MỪNG" + CSS/SVG lì-xì red-envelope with `--wed-red`/`--wed-gold` + closing line); `WeddingFooter()` (couple + date, minimal). Final `page.tsx` renders inside `CoverGate`: Hero → CeremonyInfo → Gallery → ReceptionInfo(onRsvp) → Venue → DressCode → Timeline → Guestbook → GiftBox → WeddingFooter, with RSVP modal state (`useState`) — **NOTE:** since `page.tsx` now needs `useState` for the RSVP modal, extract the composed body into a `"use client"` `WeddingContent` component and keep `page.tsx` a thin server wrapper rendering `<WeddingContent />` (preserves `metadata` export).

- [ ] **Step 1: Write the failing test**

```tsx
// tests/my-wedding/full-page.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeAll } from "vitest";
import WeddingPage from "@/app/(app)/my-wedding/page";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, onchange: null, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false } as any));
});

it("opens the card and shows key sections", async () => {
  const user = userEvent.setup();
  render(<WeddingPage />);
  await user.click(screen.getByRole("button", { name: /Mở thiệp/i }));
  expect(await screen.findByText(/ALBUM ẢNH CƯỚI/i)).toBeInTheDocument();
  expect(screen.getByText(/SỔ LƯU BÚT/i)).toBeInTheDocument();
  expect(screen.getByText(/HỘP QUÀ MỪNG/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/my-wedding/full-page.test.tsx`
Expected: FAIL — sections not yet composed.

- [ ] **Step 3: Implement GiftBox, WeddingFooter, WeddingContent, and rewire page.tsx.**

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/my-wedding/full-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/my-wedding tests/my-wedding/full-page.test.tsx
git commit -m "feat: compose full /my-wedding page with gift box and footer"
```

---

## Task 16: Final verification & visual polish

**Files:** none new (fixes only, as needed)

- [ ] **Step 1: Full test suite for the feature**

Run: `pnpm vitest run tests/my-wedding`
Expected: all `my-wedding` tests PASS.

- [ ] **Step 2: Lint + type-check**

Run: `pnpm lint && pnpm type-check`
Expected: no errors in `app/(app)/my-wedding/**`. Fix any.

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: build succeeds; `/my-wedding` compiles.

- [ ] **Step 4: Visual QA with Playwright (manual, dev server running)**

Navigate `http://localhost:3000/my-wedding`; screenshot at 375 and 1440. Compare against reference (`docs/superpowers/specs/…`): cover → open → all 11 sections in order, green/cream palette, countdown ticking, gallery lightbox, RSVP toast, guestbook append. Fix layout/spacing/color gaps.

- [ ] **Step 5: Reduced-motion check**

Emulate `prefers-reduced-motion: reduce`; confirm reveal animations are disabled and content is fully visible.

- [ ] **Step 6: Commit polish**

```bash
git add -A
git commit -m "chore: polish /my-wedding visuals and pass verification"
```

---

## Verification (end-to-end)

1. `pnpm vitest run tests/my-wedding` → all green (data, countdown, wishes logic; cover-gate, hero, ceremony, gallery, countdown, calendar, rsvp, static trio, guestbook, full-page components).
2. `pnpm lint && pnpm type-check` → clean.
3. `pnpm build` → succeeds.
4. `pnpm dev` → `/my-wedding`: cover shows names + "Mở thiệp"; clicking reveals the card; every section renders top-to-bottom matching the reference; countdown ticks; gallery lightbox opens; "Xác nhận tham dự" opens RSVP modal → toast; guestbook accepts a wish and shows it first; no navbar/footer chrome; responsive at 375/768/1440; reduced-motion respected.
5. `du -sh public/wedding/*.jpg` → all optimized (small); `_originals/` git-ignored.

## Post-plan housekeeping

- After approval, copy this plan to `docs/superpowers/plans/2026-07-15-my-wedding.md` and commit (plan-mode restricts edits to this file only during planning).
- All placeholder content (names, parents, addresses, photos) lives in `data.ts` for easy later swap.
