import { NextRequest, NextResponse } from 'next/server';

// Animation types
type AnimationType = 'none' | 'gradient' | 'pulse' | 'wave' | 'shimmer';

// Gradient direction types
type GradientDirection = 'horizontal' | 'vertical' | 'diagonal' | 'radial' | 'conic';

// Background type
type BackgroundType = 'solid' | 'gradient' | 'animated';

// Validate hex color - only allow 3 or 6 character hex values
function isValidHexColor(color: string): boolean {
  return /^[0-9A-F]{3}$/i.test(color) || /^[0-9A-F]{6}$/i.test(color);
}

// Sanitize and validate color parameter
function sanitizeColor(value: string | null, defaultColor: string): string {
  const color = (value ?? defaultColor).toUpperCase();
  // Only allow valid hex characters (0-9, A-F)
  const sanitized = color.replace(/[^0-9A-F]/g, '');
  // Validate it's a valid hex color (3 or 6 chars)
  if (isValidHexColor(sanitized)) {
    return sanitized;
  }
  return defaultColor;
}

// Validate alignment parameter
function sanitizeAlignment(value: string | null): string {
  const validAlignments = ['left', 'center', 'right'];
  const alignment = value?.toLowerCase();
  return validAlignments.includes(alignment ?? '') ? alignment! : 'center';
}

// Validate bgType parameter
function sanitizeBgType(value: string | null): BackgroundType {
  const validTypes: BackgroundType[] = ['solid', 'gradient', 'animated'];
  const bgType = value?.toLowerCase() as BackgroundType;
  return validTypes.includes(bgType) ? bgType : 'solid';
}

// Validate gradient direction
function sanitizeGradientDirection(value: string | null): GradientDirection {
  const validDirections: GradientDirection[] = [
    'horizontal',
    'vertical',
    'diagonal',
    'radial',
    'conic',
  ];
  const direction = value?.toLowerCase() as GradientDirection;
  return validDirections.includes(direction) ? direction : 'horizontal';
}

// Validate animation type
function sanitizeAnimationType(value: string | null): AnimationType {
  const validAnimations: AnimationType[] = ['none', 'gradient', 'pulse', 'wave', 'shimmer'];
  const animation = value?.toLowerCase() as AnimationType;
  return validAnimations.includes(animation) ? animation : 'none';
}

function buildGradientDef(
  id: string,
  startColor: string,
  endColor: string,
  direction: GradientDirection,
): string {
  if (direction === 'radial') {
    return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#${startColor}"/>
      <stop offset="100%" stop-color="#${endColor}"/>
    </radialGradient>`;
  }
  if (direction === 'conic') {
    return `<conicGradient id="${id}" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse" from="0deg">
      <stop offset="0%" stop-color="#${startColor}"/>
      <stop offset="100%" stop-color="#${endColor}"/>
    </conicGradient>`;
  }
  const coords: Record<string, string> = {
    horizontal: 'x1="0%" y1="0%" x2="100%" y2="0%"',
    vertical: 'x1="0%" y1="0%" x2="0%" y2="100%"',
    diagonal: 'x1="0%" y1="0%" x2="100%" y2="100%"',
  };
  return `<linearGradient id="${id}" ${coords[direction] ?? coords.horizontal}>
    <stop offset="0%" stop-color="#${startColor}"/>
    <stop offset="100%" stop-color="#${endColor}"/>
  </linearGradient>`;
}

function buildAnimatedGradientDef(
  id: string,
  startColor: string,
  endColor: string,
  animation: AnimationType,
): string {
  if (animation === 'gradient') {
    // Multi-stop gradient for animation
    return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#${startColor}">
        <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
      </stop>
      <stop offset="50%" stop-color="#${endColor}">
        <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="#${startColor}">
        <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
      </stop>
    </linearGradient>`;
  }
  if (animation === 'pulse') {
    return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#${startColor}">
        <animate attributeName="stop-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="#${endColor}">
        <animate attributeName="stop-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </stop>
    </linearGradient>`;
  }
  // Default animated gradient
  return buildGradientDef(id, startColor, endColor, 'horizontal');
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  // Get and sanitize parameters
  const bgType = sanitizeBgType(sp.get('bgType'));
  const thickness = parseInt(sp.get('thickness') ?? '2', 10);
  const width = parseInt(sp.get('width') ?? '800', 10);
  const alignment = sanitizeAlignment(sp.get('alignment'));

  // Color parameters - sanitized
  const bgSolidColor = sanitizeColor(sp.get('bgSolidColor'), 'CCCCCC');
  const bgStartColor = sanitizeColor(sp.get('bgStartColor'), 'CCCCCC');
  const bgEndColor = sanitizeColor(sp.get('bgEndColor'), '999999');
  const bgGradientDirection = sanitizeGradientDirection(sp.get('bgGradientDirection'));
  const bgAnimation = sanitizeAnimationType(sp.get('bgAnimation'));

  // Clamp thickness
  const clampedThickness = Math.max(1, Math.min(50, thickness));
  const clampedWidth = Math.max(100, Math.min(2000, width));

  // Calculate alignment offset
  let xOffset = 0;
  if (alignment === 'left') {
    xOffset = -(clampedWidth / 4);
  } else if (alignment === 'right') {
    xOffset = clampedWidth / 4;
  }

  // Build SVG based on bgType
  let svgContent = '';
  const gradientId = 'dividerGradient';
  const gradientRef = `url(#${gradientId})`;

  if (bgType === 'solid') {
    svgContent = `<rect x="${xOffset}" y="0" width="${clampedWidth}" height="${clampedThickness}" fill="#${bgSolidColor}" rx="${clampedThickness / 2}"/>`;
  } else if (bgType === 'gradient') {
    const gradientDef = buildGradientDef(gradientId, bgStartColor, bgEndColor, bgGradientDirection);
    svgContent = `<defs>${gradientDef}</defs><rect x="${xOffset}" y="0" width="${clampedWidth}" height="${clampedThickness}" fill="${gradientRef}" rx="${clampedThickness / 2}"/>`;
  } else if (bgType === 'animated') {
    const gradientDef = buildAnimatedGradientDef(gradientId, bgStartColor, bgEndColor, bgAnimation);
    svgContent = `<defs>${gradientDef}</defs><rect x="${xOffset}" y="0" width="${clampedWidth}" height="${clampedThickness}" fill="${gradientRef}" rx="${clampedThickness / 2}"/>`;
  } else {
    // Fallback to solid
    svgContent = `<rect x="${xOffset}" y="0" width="${clampedWidth}" height="${clampedThickness}" fill="#${bgSolidColor}" rx="${clampedThickness / 2}"/>`;
  }

  return new NextResponse(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${clampedWidth}" height="${clampedThickness}" viewBox="0 0 ${clampedWidth} ${clampedThickness}">
  ${svgContent}
</svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}
