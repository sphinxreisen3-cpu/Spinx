// General helper functions

export function generateId(length: number = 10): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function normalizeBaseUrl(url: string): string {
  const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(url);
  if (!isLocalhost && url.startsWith('http://')) {
    return `https://${url.slice('http://'.length)}`;
  }
  return url;
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  if (process.env.NEXT_PUBLIC_APP_URL) return normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL);
  // Railway provides RAILWAY_PUBLIC_DOMAIN for public URLs
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  // Fallback to Vercel for backwards compatibility
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return normalizeBaseUrl('http://localhost:3000');
}

export function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
