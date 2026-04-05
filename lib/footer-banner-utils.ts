/**
 * Utility helpers shared across the three Footer Banner consumers:
 *   - components/builder/config/block-config-fields.tsx
 *   - components/builder/block-preview.tsx
 *   - components/builder/live-preview.tsx
 *
 * WHY THIS EXISTS
 * ───────────────
 * Legacy Footer Banner blocks (and template entries) may carry a `waveColor`
 * prop in the format `"0:RRGGBB,100:RRGGBB"` (comma-separated gradient stops,
 * each stop being `position:hex`).
 *
 * The previous inline parsing used `.split(':')` directly on the whole string,
 * which produces the wrong result:
 *
 *   "0:EEFF00,100:A82DAA".split(':')
 *   → ['0', 'EEFF00,100', 'A82DAA']   ← startColor = '0'  (invalid hex!)
 *                                       ← endColor   = 'EEFF00,100' (invalid!)
 *
 * The correct approach is to split on ',' first to isolate each stop, then
 * extract the hex part from each stop:
 *
 *   stops[0] = '0:EEFF00'  → hex = 'EEFF00'  ✓
 *   stops[1] = '100:A82DAA' → hex = 'A82DAA'  ✓
 */

export interface ResolvedGradientColors {
  bgStartColor: string;
  bgEndColor: string;
}

const DEFAULT_START = 'EEFF00';
const DEFAULT_END = 'A82DAA';

/**
 * Extract a hex colour string from a single gradient-stop token.
 * Handles both bare hex ("EEFF00") and positional ("0:EEFF00", "100:A82DAA").
 * Returns `undefined` when the token contains no usable 3- or 6-char hex.
 */
function hexFromStop(stop: string): string | undefined {
  const trimmed = stop.trim();
  // Positional format:  "0:EEFF00"  or  "100:A82DAA"
  const colonIdx = trimmed.indexOf(':');
  const candidate = colonIdx !== -1 ? trimmed.slice(colonIdx + 1).trim() : trimmed;
  // Accept 3- or 6-character hex strings (CSS shorthand or full)
  return /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(candidate) ? candidate.toUpperCase() : undefined;
}

/**
 * Parse a legacy `waveColor` string such as `"0:EEFF00,100:A82DAA"` into
 * `{ bgStartColor, bgEndColor }`.  Falls back to safe defaults if parsing
 * fails so that the block always renders something sensible.
 */
export function parseLegacyWaveColor(waveColor: string): ResolvedGradientColors {
  if (!waveColor) {
    return { bgStartColor: DEFAULT_START, bgEndColor: DEFAULT_END };
  }

  const stops = waveColor.split(',');
  const start = stops[0] ? hexFromStop(stops[0]) : undefined;
  const end = stops[stops.length - 1] ? hexFromStop(stops[stops.length - 1]) : undefined;

  return {
    bgStartColor: start ?? DEFAULT_START,
    // If there's only one stop, mirror it as the end colour rather than
    // falling back to an unrelated default.
    bgEndColor: end && stops.length > 1 ? end : (start ?? DEFAULT_END),
  };
}

/**
 * Resolve the effective start/end gradient colours for a Footer Banner block.
 *
 * Priority order:
 *   1. Modern props  → `bgStartColor` / `bgEndColor`  (set by config panel)
 *   2. Legacy prop   → `waveColor`  (old blocks / templates)
 *   3. Defaults      → EEFF00 / A82DAA
 *
 * This is intentionally the single source of truth; all three render paths
 * (config panel, canvas preview, live preview) should call this function
 * rather than duplicating parsing logic.
 */
export function resolveFooterBannerColors(props: Record<string, unknown>): ResolvedGradientColors {
  const modernStart = props.bgStartColor ? String(props.bgStartColor).trim() : undefined;
  const modernEnd = props.bgEndColor ? String(props.bgEndColor).trim() : undefined;

  if (modernStart && modernEnd) {
    return { bgStartColor: modernStart, bgEndColor: modernEnd };
  }

  if (props.waveColor) {
    const parsed = parseLegacyWaveColor(String(props.waveColor));
    return {
      bgStartColor: modernStart ?? parsed.bgStartColor,
      bgEndColor: modernEnd ?? parsed.bgEndColor,
    };
  }

  return {
    bgStartColor: modernStart ?? DEFAULT_START,
    bgEndColor: modernEnd ?? DEFAULT_END,
  };
}
