// proyecto_lugar.geometria is stored as WKT text "POINT(lng lat)" (confirmed
// against real data — legacy public/cartografia/js/utiles.js parses it the
// same way: strip "POINT(...)", split on space, [0]=lng, [1]=lat).
export function parseWktPoint(wkt: string): { lat: number; lng: number } | null {
  const match = wkt.match(/POINT\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)/i);
  if (!match) return null;
  const [, lng, lat] = match;
  return { lat: parseFloat(lat), lng: parseFloat(lng) };
}

export function toWktPoint(lat: number, lng: number): string {
  return `POINT(${lng} ${lat})`;
}
