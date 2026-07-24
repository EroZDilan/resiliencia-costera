// Mirrors legacy crudEntity::absoluteUrl(): prefixes bare domains with
// http:// so links stored without a scheme still work as <a href>.
export function absoluteUrl(url: string | null | undefined): string | null {
  if (!url) return url ?? null;
  if (url.includes('http://') || url.includes('https://')) return url;
  return `http://${url}`;
}
