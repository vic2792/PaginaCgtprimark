// Las rutas se resuelven desde este módulo, también bajo /PaginaCgtprimark/.
export async function loadData(name) {
  const response = await fetch(
    new URL(`../../data/${name}.json`, import.meta.url),
  );
  if (!response.ok)
    throw new Error(`No se pudo cargar ${name}: HTTP ${response.status}`);
  return response.json();
}
