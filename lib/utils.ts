import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Escape HTML special characters to prevent XSS attacks.
 * This should be used when inserting user-provided values into HTML/SVG content.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate that a string is a valid hex color (3 or 6 characters).
 */
export function isValidHexColor(color: string): boolean {
  return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(color);
}

/**
 * Sanitize a color value for use in SVG - strips any non-hex characters.
 * This provides defense in depth against XSS by ensuring only valid hex
 * characters can ever appear in color attributes.
 */
export function sanitizeColor(color: string): string {
  return color.replace(/[^0-9a-fA-F]/g, '');
}

/**
 * Escape XML special characters. Uses the named entity &apos; for the
 * single-quote character (valid in SVG text content).
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Escape special characters for SVG attribute values to prevent XSS attacks.
 * SVG attributes require stricter escaping than HTML text content.
 */
export function escapeSvg(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#47;')
    .replace(/\n/g, '&#10;');
}

/**
 * Apply colour overrides from URL query parameters to a theme object.
 * Each override is sanitised (non-hex characters stripped) and validated
 * (must be 3 or 6 hex characters) before being applied.
 *
 * @param baseTheme  – The base theme object to clone and modify
 * @param searchParams – URL search parameters to read overrides from
 * @param overrides  – Mapping from query-param name to theme key
 * @returns A new theme object with the overrides applied
 */
export function applyColorOverrides<T extends object>(
  baseTheme: T,
  searchParams: URLSearchParams,
  overrides: Record<string, keyof T & string>,
): T {
  const result = { ...baseTheme } as Record<string, string>;

  for (const [param, key] of Object.entries(overrides)) {
    const raw = searchParams.get(param);
    if (raw) {
      const sanitized = sanitizeColor(raw.replace('#', ''));
      if (isValidHexColor(sanitized)) {
        result[key] = sanitized;
      }
    }
  }

  return result as T;
}
