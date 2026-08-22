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

---## 3. ~~`sanitizeColor` lives only in stats route~~ ✅ DONE

Moved `sanitizeColor` to `lib/utils.ts` alongside `isValidHexColor`.
`app/api/stats/route.ts` now imports it from the shared utility.
Typecheck, ESLint, and all 89 tests pass.

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

## 6. ~~Theme colour override pattern duplicated across routes~~ ✅ DONE

Added `applyColorOverrides` to `lib/utils.ts` with a generic signature that
works with all theme types. All 4 API routes now call the shared helper with a
mapping from query-param name to theme key. Consistent sanitization and hex
validation is applied everywhere. Typecheck, ESLint, and all 89 tests pass.

---

## 7. ~~`formatCompact` utility only in stats route~~ ✅ DONE

Moved `formatCompact` to `lib/utils.ts`. The stats route now imports it from the
shared utility. Typecheck, ESLint, and all 89 tests pass.

---

## 8. ~~Pie/donut chart segment generation — 3 near-identical implementations~~ ✅ DONE

Extracted `generatePieSegments` into `lib/svg-helpers.ts`. All three functions
(compact donut, vertical donut, and full pie) now call the shared helper with
centerX, centerY, and radius. Typecheck, ESLint, and all 89 tests pass.

---

## 9. ~~Inline theme objects in `quotes/route.ts` and `trophies/route.ts`~~ ✅ DONE

Moved trophy themes (`TrophyTheme` type, `trophyThemes` map, `getTrophyTheme`) and
quote themes (`QuoteTheme` type, `quoteThemes` map, `getQuoteTheme`) into
`lib/themes.ts`. Both routes now import from the shared module. Typecheck,
ESLint, and all 89 tests pass.

---

## 10. ~~Social badge rendering duplicated across 3 files~~ ✅ DONE

Created `lib/social-badges.ts` with a shared `SOCIAL_BADGES` registry and
`buildBadgeUrl` helper. All 3 renderers (block-preview, live-preview, markdown)
now consume the registry. Adding a new platform requires a single edit.
Typecheck, ESLint, and all 89 tests pass.

---

## 11. ~~Alignment select field duplicated — `AlignmentField` component exists but isn't used~~ ✅ DONE

Replaced inline alignment selects in greeting-config, paragraph-config, and
heading-config with the existing `<AlignmentField>` component. Removed unused
imports. Typecheck, ESLint, and all 89 tests pass.

---

## 12. ~~"Hide Border" toggle duplicated across config components~~ ✅ DONE

Created `ToggleField` component in `components/builder/config/toggle-field.tsx`.
Replaced inline toggle patterns in stats-card-config (4 toggles),
top-languages-config (2 toggles), streak-stats-config (1 toggle), and
activity-graph-config (1 toggle). Removed unused `Switch`/`Label` imports.
Typecheck, ESLint, and all 89 tests pass.

---

## 13. ~~API URL params construction duplicated in live-preview and markdown~~ ✅ DONE

Created `lib/api-urls.ts` with a `buildApiUrl` base helper and per-endpoint
builders (buildStatsUrl, buildTopLangsUrl, buildStreakUrl, buildActivityUrl,
buildTrophiesUrl, buildQuotesUrl). Both live-preview.tsx and markdown.ts now
import from the shared module. Typecheck, ESLint, and all 89 tests pass.

---

## 14. ~~`buildInternalUrl` and `buildExternalUrl` are near-identical~~ ✅ DONE

Merged into `buildApiUrl` in `lib/api-urls.ts` with an optional `origin`
parameter. Removed the two duplicate functions from markdown.ts.

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

| #   | Item                                          | Impact                        | Effort |
| --- | --------------------------------------------- | ----------------------------- | ------ |
| 4+5 | Error/token-required SVG helpers              | High — 10 duplicated blocks   | Low    |
| 8   | ~~Pie/donut segment generation~~              | ✅ Done                       | —      |
| 6   | ~~Colour override helper~~                    | ✅ Done                       | —      |
| 10  | ~~Social badge registry~~                     | ✅ Done                       | —      |     | 2   | ~~`isValidHexColor` + `sanitizeColor`~~ | ✅ Done (part 1) | —   |
| 3   | ~~`sanitizeColor` lives only in stats route~~ | ✅ Done                       | —      |     | 11  | ~~Use existing `AlignmentField`~~       | ✅ Done          | —   |     | 12    | ~~`ToggleField` component~~ | ✅ Done | —   |
| 1   | ~~`escapeXml` → `lib/utils.ts`~~              | ✅ Done                       | —      |     | 9   | ~~Move themes to `lib/themes.ts`~~      | ✅ Done          | —   |     | 13+14 | ~~Shared API URL builder~~  | ✅ Done | —   |
| 15  | Move icon paths to shared module              | Low — future-proofing         | Low    |
| 16  | Data-driven trophy ranks                      | Low — readability improvement | Low    |
| 7   | ~~Move `formatCompact` to utils~~             | ✅ Done                       | —      |
