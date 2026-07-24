// Mirrors legacy crudEntity::createSlug() exactly (accents intentionally kept,
// since that block is commented out in the PHP source) — used by every entity
// that had `setNombre()`/`setTitulo()` auto-generate a slug in the old app.
export function slugify(texto: string): string {
  return texto.toLowerCase().replace(/ /g, '-').replace(/,/g, '');
}
