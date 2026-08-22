import { NextRequest, NextResponse } from 'next/server';

import { fetchUserStats, type GitHubStats } from '@/lib/github';
import { generateErrorSvg, generateTokenRequiredSvg } from '@/lib/svg-helpers';
import { getTrophyTheme } from '@/lib/themes';

interface Trophy {
  name: string;
  rank: string;
  icon: string;
}

/** Data-driven rank calculator. Thresholds are checked from highest to lowest. */
function rankFromThresholds(value: number, thresholds: [number, string][]): string {
  for (const [min, rank] of thresholds) {
    if (value >= min) return rank;
  }
  return 'C';
}

/** Trophy category definitions: stat key → thresholds (descending). */
const TROPHY_CATEGORIES: {
  name: string;
  stat: keyof GitHubStats;
  icon: string;
  thresholds: [number, string][];
}[] = [
  {
    name: 'Stars',
    stat: 'totalStars',
    icon: 'star',
    thresholds: [
      [10000, 'SSS'],
      [5000, 'SS'],
      [1000, 'S'],
      [500, 'AA'],
      [100, 'A'],
      [50, 'B'],
    ],
  },
  {
    name: 'Commits',
    stat: 'totalCommits',
    icon: 'git-commit',
    thresholds: [
      [10000, 'SSS'],
      [5000, 'SS'],
      [1000, 'S'],
      [500, 'AA'],
      [200, 'A'],
      [100, 'B'],
    ],
  },
  {
    name: 'Followers',
    stat: 'followers',
    icon: 'users',
    thresholds: [
      [5000, 'SSS'],
      [1000, 'SS'],
      [500, 'S'],
      [100, 'AA'],
      [50, 'A'],
      [10, 'B'],
    ],
  },
  {
    name: 'PRs',
    stat: 'totalPRs',
    icon: 'git-pull-request',
    thresholds: [
      [1000, 'SSS'],
      [500, 'SS'],
      [200, 'S'],
      [100, 'AA'],
      [50, 'A'],
      [20, 'B'],
    ],
  },
  {
    name: 'Issues',
    stat: 'totalIssues',
    icon: 'alert-circle',
    thresholds: [
      [500, 'SSS'],
      [200, 'SS'],
      [100, 'S'],
      [50, 'AA'],
      [20, 'A'],
      [10, 'B'],
    ],
  },
  {
    name: 'Repos',
    stat: 'publicRepos',
    icon: 'repo',
    thresholds: [
      [200, 'SSS'],
      [100, 'SS'],
      [50, 'S'],
      [30, 'AA'],
      [20, 'A'],
      [10, 'B'],
    ],
  },
  {
    name: 'Reviews',
    stat: 'totalReviews',
    icon: 'code-review',
    thresholds: [
      [500, 'SSS'],
      [200, 'SS'],
      [100, 'S'],
      [50, 'AA'],
      [20, 'A'],
      [10, 'B'],
    ],
  },
  {
    name: 'Contributed',
    stat: 'contributedTo',
    icon: 'comment-discussion',
    thresholds: [
      [100, 'SSS'],
      [50, 'SS'],
      [30, 'S'],
      [20, 'AA'],
      [10, 'A'],
      [5, 'B'],
    ],
  },
];

function calculateTrophies(stats: GitHubStats): Trophy[] {
  return TROPHY_CATEGORIES.map((cat) => ({
    name: cat.name,
    rank: rankFromThresholds(Number(stats[cat.stat]), cat.thresholds),
    icon: cat.icon,
  }));
}

function generateTrophySvg(
  trophies: Trophy[],
  theme: { bg: string; title: string; text: string; trophy: string; frame: string },
  options: {
    column: number;
    row: number;
    marginW: number;
    marginH: number;
    noFrame: boolean;
    noBg: boolean;
  },
) {
  const trophyWidth = 80;
  const trophyHeight = 90;
  const { column, row, marginW, marginH } = options;

  const totalTrophies = Math.min(column * row, trophies.length);
  const displayTrophies = trophies.slice(0, totalTrophies);

  const width = column * trophyWidth + (column - 1) * marginW + 40;
  const height = row * trophyHeight + (row - 1) * marginH + 20;

  const rankColors: Record<string, string> = {
    SSS: 'ff0000',
    SS: 'ff4500',
    S: 'ffa500',
    AA: 'ffd700',
    A: 'c0c0c0',
    B: 'cd7f32',
    C: '808080',
  };

  const trophyCards = displayTrophies
    .map((trophy, i) => {
      const col = i % column;
      const rowIdx = Math.floor(i / column);
      const x = 20 + col * (trophyWidth + marginW);
      const y = 10 + rowIdx * (trophyHeight + marginH);

      return `
      <g transform="translate(${x}, ${y})">
        ${!options.noFrame ? `<rect x="0" y="0" width="${trophyWidth}" height="${trophyHeight}" rx="6" fill="${options.noBg ? 'none' : '#' + theme.bg}" stroke="#${theme.frame}" stroke-width="1"/>` : ''}

        <!-- Trophy -->
        <g transform="translate(${trophyWidth / 2}, 35)">
          <path transform="translate(-15, -18)" d="M15 4 L19 11 L26 11 L20 16 L23 24 L15 19 L7 24 L10 16 L4 11 L11 11 Z" fill="#${rankColors[trophy.rank] || theme.trophy}"/>
        </g>

        <text x="${trophyWidth / 2}" y="55" text-anchor="middle" class="trophy-title">${trophy.name}</text>
        <text x="${trophyWidth / 2}" y="70" text-anchor="middle" class="trophy-rank" fill="#${rankColors[trophy.rank] || theme.trophy}">${trophy.rank}</text>
      </g>
    `;
    })
    .join('');

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .trophy-title { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${theme.title}; }
    .trophy-rank { font: 800 16px 'Segoe UI', Ubuntu, Sans-Serif; }
  </style>

  ${!options.noBg ? `<rect x="0" y="0" width="${width}" height="${height}" fill="#${theme.bg}" rx="10"/>` : ''}

  ${trophyCards}
</svg>
  `.trim();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const username = searchParams.get('username') || 'github';
  const themeName = searchParams.get('theme') || 'default';
  const column = parseInt(searchParams.get('column') || '4');
  const row = parseInt(searchParams.get('row') || '2');
  const marginW = parseInt(searchParams.get('margin_w') || '15');
  const marginH = parseInt(searchParams.get('margin_h') || '15');
  const noFrame = searchParams.get('no_frame') === 'true';
  const noBg = searchParams.get('no_bg') === 'true';

  const theme = getTrophyTheme(themeName);
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      const stats = await fetchUserStats(username, token);
      const trophies = calculateTrophies(stats);

      const svg = generateTrophySvg(trophies, theme, {
        column,
        row,
        marginW,
        marginH,
        noFrame,
        noBg,
      });

      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch {
      return new NextResponse(
        generateErrorSvg(theme.bg, username, 'Error fetching trophies for', {
          textColor: theme.text,
        }),
        {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=300',
          },
        },
      );
    }
  } else {
    return new NextResponse(
      generateTokenRequiredSvg(theme.bg, username, 'to fetch real trophies for', {
        border: theme.frame,
        titleColor: theme.title,
        bodyColor: theme.text,
      }),
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60',
        },
      },
    );
  }
}
