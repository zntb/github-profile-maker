/**
 * Shared helpers for generating error and token-required placeholder SVGs.
 * Used by the activity, stats, streak, top-langs, and trophies API routes.
 */

export interface TokenRequiredSvgOptions {
  /** SVG width (default 495) */
  width?: number;
  /** SVG height (default 120) */
  height?: number;
  /** Border hex color (default 'e4e2e2') */
  border?: string;
  /** Title text hex color (default '2f80ed') */
  titleColor?: string;
  /** Body text hex color (default '434d58') */
  bodyColor?: string;
  /** Title font size (default 14) */
  titleFontSize?: number;
  /** Body font size (default 12) */
  bodyFontSize?: number;
  /** Description font size (default 11) */
  descFontSize?: number;
}

/**
 * Generate an SVG placeholder shown when the GITHUB_TOKEN env var is missing.
 *
 * @param bg          – Background hex color (from the route's theme)
 * @param escapedUsername – Already-escaped username for safe insertion into SVG
 * @param endpointDescription – Short text like "to fetch real activity for"
 * @param options     – Optional overrides for dimensions, colors, and font sizes
 */
export function generateTokenRequiredSvg(
  bg: string,
  escapedUsername: string,
  endpointDescription: string,
  options: TokenRequiredSvgOptions = {},
): string {
  const {
    width = 495,
    height = 120,
    border = 'e4e2e2',
    titleColor = '2f80ed',
    bodyColor = '434d58',
    titleFontSize = 14,
    bodyFontSize = 12,
    descFontSize = 11,
  } = options;

  const centerX = width / 2;
  const centerY = height / 2;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#${bg}" rx="10" stroke="#${border}"/>
        <text x="${centerX}" y="${centerY - 18}" text-anchor="middle" fill="#${titleColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="${titleFontSize}" font-weight="600">
          GitHub Token Required
        </text>
        <text x="${centerX}" y="${centerY + 2}" text-anchor="middle" fill="#${bodyColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="${bodyFontSize}">
          Set GITHUB_TOKEN environment variable
        </text>
        <text x="${centerX}" y="${centerY + 18}" text-anchor="middle" fill="#${bodyColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="${descFontSize}" opacity="0.7">
          ${endpointDescription} @${escapedUsername}
        </text>
      </svg>`;
}

// ---------------------------------------------------------------------------
// Error SVG
// ---------------------------------------------------------------------------

export interface ErrorSvgOptions {
  /** SVG width (default 495) */
  width?: number;
  /** SVG height (default 120) */
  height?: number;
  /** Text hex color (default '434d58') */
  textColor?: string;
  /** Title font size (default 14) */
  titleFontSize?: number;
  /** Body font size (default 12) */
  bodyFontSize?: number;
}

/**
 * Generate an SVG error placeholder shown when the GitHub API call fails.
 *
 * @param bg          – Background hex color (from the route's theme)
 * @param escapedUsername – Already-escaped username for safe insertion into SVG
 * @param endpointDescription – Short text like "Error fetching activity for"
 * @param options     – Optional overrides for dimensions, colors, and font sizes
 */
export function generateErrorSvg(
  bg: string,
  escapedUsername: string,
  endpointDescription: string,
  options: ErrorSvgOptions = {},
): string {
  const {
    width = 495,
    height = 120,
    textColor = '434d58',
    titleFontSize = 14,
    bodyFontSize = 12,
  } = options;

  const centerX = width / 2;
  const centerY = height / 2;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#${bg}" rx="10"/>
        <text x="${centerX}" y="${centerY - 10}" text-anchor="middle" fill="#${textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="${titleFontSize}">
          ${endpointDescription} @${escapedUsername}
        </text>
        <text x="${centerX}" y="${centerY + 10}" text-anchor="middle" fill="#${textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="${bodyFontSize}" opacity="0.7">
          User may not exist or API rate limit exceeded
        </text>
      </svg>`;
}
