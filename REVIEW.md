# Code Review — Duplicate Patterns for Refactoring

This document catalogues duplicate code across the codebase that should be extracted
into shared, reusable utilities or components.

---

## 1. ~~`escapeXml` duplicated instead of reusing `lib/utils.ts`~~ ✅ DONE

Added `escapeXml` as a named export in `lib/utils.ts` (uses `&apos;` for single
quotes, preserving original XML semantics). Removed the local definition from
`app/api/streak/route.ts` and replaced it with an import from `@/lib/utils`.
Typecheck, ESLint, and all 89 tests pass.

---## 2. ~~`isValidHexColor` duplicated across routes~~ ✅ DONE

Moved the stats version of `isValidHexColor` (supports both 3-char and 6-char hex)
to `lib/utils.ts`. Both `app/api/stats/route.ts` and `app/api/streak/route.ts` now
import from the shared utility. The streak route previously used a stricter regex that
only accepted 6-char hex — it now correctly also accepts 3-char hex like `fff`.
Typecheck, ESLint, and all 89 tests pass.

---

## 3. `sanitizeColor` lives only in stats route

**Files:**

- `app/api/stats/route.ts` — line 19

**Problem:** The `sanitizeColor` function (strips non-hex characters) is only defined
in the stats route but could be useful in other routes that accept colour overrides.

**Suggested fix:** Move to `lib/utils.ts` alongside `isValidHexColor`.

---

## 4. "GitHub Token Required" error SVG — copy-pasted across all 5 API routes

**Files:**

- `app/api/activity/route.ts` — lines 184–200
- `app/api/stats/route.ts` — lines 383–398
- `app/api/streak/route.ts` — lines 224–242
- `app/api/top-langs/route.ts` — lines 387–404
- `app/api/trophies/route.ts` — lines 345–362

**Problem:** Every API route renders a nearly identical "GitHub Token Required" SVG
placeholder when `GITHUB_TOKEN` is missing. The only differences are the endpoint name
(e.g., "stats", "streak", "trophies") and minor styling variations.

**Suggested fix:** Create a shared helper in `lib/svg-helpers.ts`:

```ts
function generateTokenRequiredSvg(
  theme: { bg: string; text: string; border: string; title?: string },
  endpointName: string,
  username: string,
): string;
```

---

## 5. "Error fetching" error SVG — copy-pasted across all 5 API routes

**Files:**

- `app/api/activity/route.ts` — lines 167–182
- `app/api/stats/route.ts` — lines 368–381
- `app/api/streak/route.ts` — lines 203–222
- `app/api/top-langs/route.ts` — lines 371–385
- `app/api/trophies/route.ts` — lines 330–343

**Problem:** Every API route renders a nearly identical error SVG when the GitHub API
call fails. The only differences are the endpoint name, dimensions, and username escaping.

**Suggested fix:** Extend the shared helper from item #4:

```ts
function generateErrorSvg(
  theme: { bg: string; text: string },
  endpointName: string,
  username: string,
  width?: number,
  height?: number,
): string;
```

---

## 6. Theme colour override pattern duplicated across routes

**Files:**

- `app/api/activity/route.ts` — lines 83–103 (manual if/replace chain)
- `app/api/stats/route.ts` — lines 328–354 (sanitize + validate pattern)
- `app/api/streak/route.ts` — lines 170–181 (tryColour helper)
- `app/api/top-langs/route.ts` — lines 341–351 (manual if/replace chain)

**Problem:** Each route implements its own colour-override-from-query-params logic
with varying levels of sanitization. Some validate hex, some don't; some sanitize,
some just strip `#`.

**Suggested fix:** Create a shared helper:

```ts
function applyColorOverrides<T extends Record<string, string>>(
  baseTheme: T,
  searchParams: URLSearchParams,
  overrides: Record<string, keyof T>,
): T;
```

---

## 7. `formatCompact` utility only in stats route

**Files:**

- `app/api/stats/route.ts` — line 23

**Problem:** The `formatCompact` function (formats numbers like `1.2k`, `3.4M`) is
defined locally in the stats route. It's a general-purpose utility that could be
useful in other contexts.

**Suggested fix:** Move to `lib/utils.ts`.

---

## 8. Pie/donut chart segment generation — 3 near-identical implementations

**Files:**

- `app/api/top-langs/route.ts`:
  - `generateDonutSvg` — lines 141–198
  - `generateDonutVerticalSvg` — lines 201–257
  - `generatePieSvg` — lines 260–325

**Problem:** All three functions contain identical angle-to-SVG-path math for
converting language percentages into pie/donut segments. The only differences are
the center coordinates, radius, and legend positioning.

**Suggested fix:** Extract a shared segment calculator:

```ts
function generatePieSegments(
  langs: LanguageData[],
  centerX: number,
  centerY: number,
  radius: number,
): string;
```

---

## 9. Inline theme objects in `quotes/route.ts` and `trophies/route.ts`

**Files:**

- `app/api/quotes/route.ts` — lines 191–203 (10 theme entries)
- `app/api/trophies/route.ts` — lines 5–68 (8 theme entries)

**Problem:** Both routes define their own `themes` object inline rather than
importing from `lib/themes.ts`. Theme maintenance requires editing route files.
Also, the stats/lang themes in `lib/themes.ts` use a flat `{ bg, title, text, border }`
shape, while quotes uses `{ bg, text, accent, border }` and trophies uses
`{ bg, title, text, trophy, frame }` — inconsistent naming and structure.

**Suggested fix:** Move quote and trophy themes into `lib/themes.ts` with dedicated
theme types and getter functions (`getQuoteTheme`, `getTrophyTheme`) following the
pattern already established for stats, lang, and streak themes.

---

## 10. Social badge rendering duplicated across 3 files

**Files:**

- `components/builder/block-preview.tsx` — lines 151–180 (list of badge names)
- `components/builder/live-preview.tsx` — lines 193–275 (JSX badge elements)
- `lib/markdown.ts` — lines 175–220 (markdown badge syntax)

**Problem:** The social badge definition (platform → name, URL pattern, color) is
repeated in all three files. Adding a new platform (e.g., Mastodon) requires editing
all three locations.

**Suggested fix:** Define a shared badge registry:

```ts
const SOCIAL_BADGES: Record<string, {
  label: string;
  color: string;
  logo: string;
  urlPattern: (username: string) => string;
}> = { ... }
```

Then each renderer consumes the registry instead of hardcoding the mapping.

---

## 11. Alignment select field duplicated — `AlignmentField` component exists but isn't used

**Files:**

- `components/builder/config/alignment-field.tsx` — reusable component
- `components/builder/config/blocks/greeting-config.tsx` — lines 24–38 (inline)
- `components/builder/config/blocks/paragraph-config.tsx` — lines 14–24 (inline)
- `components/builder/config/blocks/heading-config.tsx` — likely similar

**Problem:** An `AlignmentField` component already exists in
`components/builder/config/alignment-field.tsx`, but several config components
re-implement the left/center/right alignment select inline.

**Suggested fix:** Replace inline alignment selects with `<AlignmentField>`.

---

## 12. "Hide Border" toggle duplicated across config components

**Files:**

- `components/builder/config/blocks/stats-card-config.tsx` — lines 73–80
- `components/builder/config/blocks/top-languages-config.tsx` — lines 67–74
- `components/builder/config/blocks/streak-stats-config.tsx` — lines 46–53
- `components/builder/config/blocks/activity-graph-config.tsx` — lines 26–33

**Problem:** The "Hide Border" label + Switch pattern is repeated identically across
4+ config components.

**Suggested fix:** Extract a `HideBorderField` (or a more generic `ToggleField`):

```tsx
function ToggleField({ label, checked, onChange }: { ... }) {
  return (
    <FieldGroup>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Switch checked={checked} onCheckedChange={onChange} />
      </div>
    </FieldGroup>
  );
}
```

---

## 13. API URL params construction duplicated in live-preview and markdown

**Files:**

- `components/builder/live-preview.tsx` — lines 307–395 (URLSearchParams per block type)
- `lib/markdown.ts` — `renderBlock` function (similar param construction)

**Problem:** Both files build URL query strings for the same API endpoints
(`/api/stats`, `/api/top-langs`, `/api/streak`, etc.) with overlapping logic.

**Suggested fix:** Create a shared function in `lib/api-urls.ts`:

```ts
function buildStatsApiUrl(params: { username, theme, layout, ... }): string
function buildTopLangsApiUrl(params: { ... }): string
function buildStreakApiUrl(params: { ... }): string
function buildActivityApiUrl(params: { ... }): string
function buildTrophiesApiUrl(params: { ... }): string
```

---

## 14. `buildInternalUrl` and `buildExternalUrl` are near-identical

**Files:**

- `lib/markdown.ts` — lines 5–28

**Problem:** These two functions are identical except that `buildExternalUrl` prefixes
the path with `origin`. They could be a single function with an optional `origin`
parameter.

**Suggested fix:** Merge into one:

```ts
function buildApiUrl(
  endpoint: string,
  params: Record<string, unknown>,
  origin?: string,
): string;
```

---

## 15. GitHub Stats icon paths + `makeStatIcon` only in stats route

**Files:**

- `app/api/stats/route.ts` — lines 28–54 (icon path definitions + helper)

**Problem:** The Octicon SVG path data and `makeStatIcon` helper are defined locally.
If other routes ever need GitHub icons (e.g., trophies could use stat icons), this
would need to be duplicated.

**Suggested fix:** Move to `lib/svg-icons.ts` for reuse.

---

## 16. Trophy rank calculation uses deeply nested ternaries

**Files:**

- `app/api/trophies/route.ts` — `calculateTrophies` function (lines 72–176)

**Problem:** Each stat category (stars, commits, followers, etc.) uses a 6-level
nested ternary chain. This pattern is repeated 7 times with different thresholds.

**Suggested fix:** Extract a data-driven rank calculator:

```ts
function calculateRank(value: number, thresholds: [number, string][]): string {
  for (const [min, rank] of thresholds) {
    if (value >= min) return rank;
  }
  return 'C';
}
```

Then each category just defines its threshold array.

---

## Summary of Priority

| #     | Item                                | Impact                                | Effort |
| ----- | ----------------------------------- | ------------------------------------- | ------ |
| 4+5   | Error/token-required SVG helpers    | High — 10 duplicated blocks           | Low    |
| 8     | Pie/donut segment generation        | Medium — 3 near-identical functions   | Low    |
| 6     | Colour override helper              | Medium — inconsistent sanitization    | Low    |
| 10    | Social badge registry               | High — 3 files to update per platform | Medium || 2 | ~~`isValidHexColor` + `sanitizeColor`~~ | ✅ Done (part 1) | — |
| 3 | `sanitizeColor` lives only in stats route | Medium — move to utils | Low |
| 11    | Use existing `AlignmentField`       | Low — easy swap                       | Low    |
| 12    | `ToggleField` component             | Low — repeated boilerplate            | Low    |
| 1     | ~~`escapeXml` → `lib/utils.ts`~~    | ✅ Done                               | —      |
| 9     | Move themes to `lib/themes.ts`      | Medium — consistency improvement      | Low    |
| 13+14 | Shared API URL builder              | Medium — DRY up param construction    | Medium |
| 15    | Move icon paths to shared module    | Low — future-proofing                 | Low    |
| 16    | Data-driven trophy ranks            | Low — readability improvement         | Low    |
| 7     | Move `formatCompact` to utils       | Low — single function move            | Low    |
