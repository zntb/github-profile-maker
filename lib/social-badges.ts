/**
 * Shared social badge registry.
 * Consumed by block-preview.tsx, live-preview.tsx, and lib/markdown.ts so that
 * adding a new platform only requires a single edit.
 */

export interface SocialBadgeDefinition {
  /** Display label (e.g. "LinkedIn") */
  label: string;
  /** Shields.io background hex (without #) */
  color: string;
  /** Shields.io logo key */
  logo: string;
  /** Build the link URL from the user-provided username/value */
  url: (username: string) => string;
}

/**
 * Ordered map of platform keys → badge definitions.
 * The key matches the prop name used in the SocialBadgesProps interface.
 */
export const SOCIAL_BADGES: Record<string, SocialBadgeDefinition> = {
  linkedin: {
    label: 'LinkedIn',
    color: '0077B5',
    logo: 'linkedin',
    url: (u) => `https://linkedin.com/in/${u}`,
  },
  twitter: {
    label: 'Twitter',
    color: '1DA1F2',
    logo: 'twitter',
    url: (u) => `https://twitter.com/${u}`,
  },
  github: {
    label: 'GitHub',
    color: '100000',
    logo: 'github',
    url: (u) => `https://github.com/${u}`,
  },
  youtube: {
    label: 'YouTube',
    color: 'FF0000',
    logo: 'youtube',
    url: (u) => `https://youtube.com/@${u}`,
  },
  instagram: {
    label: 'Instagram',
    color: 'E4405F',
    logo: 'instagram',
    url: (u) => `https://instagram.com/${u}`,
  },
  discord: {
    label: 'Discord',
    color: '7289DA',
    logo: 'discord',
    url: (u) => `https://discord.gg/${u}`,
  },
  email: {
    label: 'Email',
    color: 'D14836',
    logo: 'gmail',
    url: (u) => `mailto:${u}`,
  },
  portfolio: {
    label: 'Portfolio',
    color: '000000',
    logo: 'About.me',
    url: (u) => u,
  },
};

/**
 * Build a shields.io badge URL for a given platform.
 */
export function buildBadgeUrl(
  platform: SocialBadgeDefinition,
  username: string,
  style: string,
): string {
  return `https://img.shields.io/badge/${encodeURIComponent(platform.label)}-${platform.color}?style=${style}&logo=${platform.logo}&logoColor=white`;
}
