/**
 * Shared API URL builders.
 * Consumed by components/builder/live-preview.tsx and lib/markdown.ts so that
 * URL construction for each endpoint lives in one place.
 */

// ---------------------------------------------------------------------------
// Base helper
// ---------------------------------------------------------------------------

/**
 * Build an API URL, optionally prefixed with an origin (for exported markdown).
 *
 * @param endpoint – API route name (e.g. "stats", "top-langs")
 * @param params   – Query parameters (undefined / null / '' values are omitted)
 * @param origin   – Optional origin prefix (e.g. "https://example.com")
 */
export function buildApiUrl(
  endpoint: string,
  params: Record<string, unknown>,
  origin?: string,
): string {
  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      filtered[key] = String(value);
    }
  }
  const query = new URLSearchParams(filtered);
  const base = origin ? `${origin}/api/${endpoint}` : `/api/${endpoint}`;
  return `${base}?${query.toString()}`;
}

// ---------------------------------------------------------------------------
// Per-endpoint helpers
// ---------------------------------------------------------------------------

export function buildStatsUrl(params: Record<string, unknown>, origin?: string): string {
  return buildApiUrl(
    'stats',
    {
      username: params.username,
      theme: params.theme,
      layout: params.layout ?? 'standard',
      show_icons: params.showIcons ? 'true' : 'false',
      hide_border: params.hideBorder ? 'true' : 'false',
      hide_title: params.hideTitle ? 'true' : 'false',
      hide_rank: params.hideRank ? 'true' : 'false',
      border_radius: params.borderRadius,
      bg_color: params.bgColor,
      text_color: params.textColor,
      title_color: params.titleColor,
      icon_color: params.iconColor,
    },
    origin,
  );
}

export function buildTopLangsUrl(params: Record<string, unknown>, origin?: string): string {
  return buildApiUrl(
    'top-langs',
    {
      username: params.username,
      theme: params.theme,
      layout: params.layout,
      hide_border: params.hideBorder ? 'true' : 'false',
      hide_progress: params.hideProgress ? 'true' : 'false',
      langs_count: params.langs_count,
      border_radius: params.borderRadius,
      bg_color: params.bgColor,
      text_color: params.textColor,
      title_color: params.titleColor,
    },
    origin,
  );
}

export function buildStreakUrl(params: Record<string, unknown>, origin?: string): string {
  return buildApiUrl(
    'streak',
    {
      username: params.username,
      theme: params.theme,
      hide_border: params.hideBorder ? 'true' : 'false',
      border_radius: params.borderRadius,
      background: params.bgColor,
      fire: params.fireColor,
      ring: params.ringColor,
      currStreakNum: params.currStreakColor,
      sideNums: params.sideNumColor,
      sideLabels: params.sideLabelColor,
      dates: params.datesColor,
    },
    origin,
  );
}

export function buildActivityUrl(params: Record<string, unknown>, origin?: string): string {
  return buildApiUrl(
    'activity',
    {
      username: params.username,
      theme: params.theme,
      hide_border: params.hideBorder ? 'true' : 'false',
      bg_color: params.bgColor,
      color: params.color,
      line: params.lineColor,
      point: params.pointColor,
      area_color: params.areaColor,
    },
    origin,
  );
}

export function buildTrophiesUrl(params: Record<string, unknown>, origin?: string): string {
  return buildApiUrl(
    'trophies',
    {
      username: params.username,
      theme: params.theme,
      column: params.column,
      row: params.row,
      margin_w: params.margin_w,
      margin_h: params.margin_h,
      no_frame: params.noFrame ? 'true' : 'false',
      no_bg: params.noBg ? 'true' : 'false',
    },
    origin,
  );
}

export function buildQuotesUrl(params: Record<string, unknown>, origin?: string): string {
  return buildApiUrl(
    'quotes',
    {
      type: params.type,
      theme: params.theme,
    },
    origin,
  );
}
