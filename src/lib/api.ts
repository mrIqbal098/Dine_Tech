// src/lib/api.ts
export async function apiFetch(path: string, options?: RequestInit) {
  // always call same-origin API
  const url = path.startsWith("http") ? path : path;
  return fetch(url, options);
}
