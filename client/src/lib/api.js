export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function api(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
