import { lookup } from 'node:dns/promises';

import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

// Allowed hosts for SSRF protection - only allow UploadThing domains
const ALLOWED_HOSTS = ['utfs.io', 'ufs.sh', 'uploadthing.com'];

// Private IP ranges to block (SSRF protection)
const PRIVATE_IP_RANGES = [
  // 127.0.0.0/8 (loopback)
  /^127\./,
  // 10.0.0.0/8
  /^10\./,
  // 172.16.0.0/12
  /^172\.(1[6-9]|2\d|3[01])\./,
  // 192.168.0.0/16
  /^192\.168\./,
  // 169.254.0.0/16 (link-local)
  /^169\.254\./,
  // 0.0.0.0/8
  /^0\./,
  // 100.64.0.0/10 (carrier-grade NAT)
  /^100\.(6[4-9]|[7-9]\d|1[0-1]\d|12[0-7])\./,
  // 192.0.0.0/24 (IETF Protocol Assignments)
  /^192\.0\.0\./,
  // 192.0.2.0/24 (TEST-NET-1)
  /^192\.0\.2\./,
  // 198.51.100.0/24 (TEST-NET-2)
  /^198\.51\.100\./,
  // 203.0.113.0/24 (TEST-NET-3)
  /^203\.0\.113\./,
  // 224.0.0.0/4 (multicast)
  /^2[2-4]\d\./,
  // 240.0.0.0/4 (reserved)
  /^2[4-5]\d\./,
];

// Reserved/broadcast addresses
const RESERVED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  'broadcasthost',
  'metadata.google.internal',
  'metadata.google',
];

function isPrivateIP(ip: string): boolean {
  return PRIVATE_IP_RANGES.some((pattern) => pattern.test(ip));
}

function isHostnameBlocked(hostname: string): boolean {
  const lowerHostname = hostname.toLowerCase();

  // Check reserved hostnames
  if (RESERVED_HOSTNAMES.includes(lowerHostname)) {
    return true;
  }

  // Check if it's an IP address (IPv4)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    return isPrivateIP(hostname);
  }

  // Check for localhost variants in domain
  if (lowerHostname.includes('localhost') || lowerHostname === 'local') {
    return true;
  }

  return false;
}

async function isUrlAllowedWithDNS(url: URL): Promise<boolean> {
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');

  // First, check if hostname is blocked (private IP or reserved) directly
  if (isHostnameBlocked(hostname)) {
    return false;
  }

  // Check if hostname is in allowed list (skip DNS for known domains)
  if (ALLOWED_HOSTS.includes(hostname)) {
    return true;
  }

  // Check if hostname ends with an allowed domain
  if (ALLOWED_HOSTS.some((allowedHost) => hostname.endsWith(`.${allowedHost}`))) {
    return true;
  }

  // For non-uploadthing domains, perform DNS resolution to check for SSRF via DNS rebinding
  try {
    const addresses = await lookup(hostname, { all: true });
    for (const addr of addresses) {
      // Check IPv4 addresses
      if (addr.address && isPrivateIP(addr.address)) {
        return false;
      }
      // Check IPv6 addresses
      if (addr.family === 6) {
        // Block link-local and unique local addresses
        if (
          addr.address.startsWith('fe80:') ||
          addr.address.startsWith('fc') ||
          addr.address.startsWith('fd')
        ) {
          return false;
        }
      }
    }
  } catch {
    // DNS lookup failed - block the request
    return false;
  }

  return false;
}

// Derive a safe, constrained path for UploadThing resources.
// This prevents the user from arbitrarily controlling the request target path.
function getSafeUploadThingPath(url: URL): string | null {
  // Only allow paths of the form /f/<fileKey> or /file/<fileKey>, where fileKey is a single
  // path segment made of safe characters and contains no traversal.
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length !== 2) {
    return null;
  }
  const [prefix, fileKey] = segments;
  if (prefix !== 'f' && prefix !== 'file') {
    return null;
  }
  // Restrict fileKey to a safe character set (alphanumeric, dash, underscore, dot).
  if (!/^[A-Za-z0-9._-]+$/.test(fileKey)) {
    return null;
  }
  return `/${prefix}/${fileKey}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceUrl, customFileName } = body;

    if (!sourceUrl) {
      return NextResponse.json({ error: 'Source URL is required' }, { status: 400 });
    }

    // Validate and restrict the source URL to mitigate SSRF
    let validatedUrl: URL;
    try {
      validatedUrl = new URL(sourceUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid source URL format' }, { status: 400 });
    }

    // Only allow http and https protocols
    if (validatedUrl.protocol !== 'http:' && validatedUrl.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Only HTTP and HTTPS protocols are allowed' },
        { status: 400 },
      );
    }

    // Check if the hostname is allowed (with DNS resolution for DNS rebinding protection)
    if (!(await isUrlAllowedWithDNS(validatedUrl))) {
      return NextResponse.json({ error: 'Source URL host is not allowed' }, { status: 400 });
    }

    // Derive a safe, constrained path for UploadThing resources.
    // This prevents the user from arbitrarily controlling the request target path.
    const safePath = getSafeUploadThingPath(validatedUrl);
    if (!safePath) {
      return NextResponse.json({ error: 'Source URL path is not allowed' }, { status: 400 });
    }

    // Reconstruct a sanitized URL using the validated origin and the constrained path.
    const origin = `${validatedUrl.protocol}//${validatedUrl.hostname}`;
    const sanitizedUrl = new URL(safePath, origin).toString();

    const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

    // Download the source image using the sanitized URL with timeout and size limit
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let response: Response;
    try {
      response = await fetch(sanitizedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'GitHub-Profile-Maker/1.0',
        },
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      // Handle abort errors specially
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out' }, { status: 500 });
      }
      return NextResponse.json({ error: 'Failed to download source image' }, { status: 500 });
    }

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to download source image' }, { status: 500 });
    }

    // Check response size to prevent memory exhaustion (max 10MB)
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Source file too large' }, { status: 500 });
    }

    const arrayBuffer = await response.arrayBuffer();

    // Additional size check after reading
    if (arrayBuffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Source file too large' }, { status: 500 });
    }

    const uint8Array = new Uint8Array(arrayBuffer);

    // Determine content type from the source URL or response
    const contentType = response.headers.get('content-type') || 'image/png';

    // Generate filename - use custom filename or derive from source
    let fileName = customFileName;
    if (!fileName) {
      // Use validated URL to extract filename (not the raw sourceUrl to avoid SSRF bypass)
      const urlPath = validatedUrl.pathname;
      const pathParts = urlPath.split('/').filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1] || '';
      // Remove any query strings or file keys
      const originalName = lastPart.includes('?') ? lastPart.split('?')[0] : lastPart;
      // Remove the file key prefix if present (uploadthing uses 'f' prefix)
      const nameParts = originalName.split('-');
      if (nameParts.length > 1 && nameParts[0] === 'f') {
        fileName = nameParts.slice(1).join('-');
      } else {
        fileName = originalName;
      }
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${fileName.replace(/\.[^/.]+$/, '')}-${timestamp}`;

    // Create a File object from the buffer
    const file = new File([uint8Array], uniqueFileName, {
      type: contentType,
      lastModified: Date.now(),
    });

    // Upload the duplicated file
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await utapi.uploadFiles(file);

    // Check if result has the expected structure (result.data contains UploadedFileData with 'key' property)
    if (result && result.data && 'key' in result.data && 'ufsUrl' in result.data) {
      return NextResponse.json({
        success: true,
        url: result.data.ufsUrl,
        fileKey: result.data.key,
      });
    }

    return NextResponse.json(
      { error: 'Failed to upload duplicated image', details: result },
      { status: 500 },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to duplicate file' }, { status: 500 });
  }
}
