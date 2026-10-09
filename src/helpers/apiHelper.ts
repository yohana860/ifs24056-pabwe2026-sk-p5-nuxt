const TOKEN_KEY = "access_token";

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = (): void => localStorage.removeItem(TOKEN_KEY);

export interface ApiOptions {
  method?: string;
  body?: Record<string, unknown> | FormData;
  query?: Record<string, string | number | undefined | null>;
  auth?: boolean;
}

export async function apiFetch(path: string, { method = "GET", body, query, auth = true }: ApiOptions = {}) {
  const url = new URL(DELCOM_BASEURL + path);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== "" && v != null) url.searchParams.set(k, String(v));
  });
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(url, { method, headers, body: payload });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.message || `Permintaan gagal (${res.status})`);
  return json;
}

/** Ambil array dari data respons dengan beberapa kemungkinan nama key. */
export function pickList(data: any, ...keys: string[]): any[] {
  for (const k of keys) if (Array.isArray(data?.[k])) return data[k];
  return Array.isArray(data) ? data : [];
}
