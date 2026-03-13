const API_PREFIX = "/api/v1";

function getBackendBaseUrl() {
  return process.env.INTERNAL_API_BASE_URL ?? "http://backend:8000";
}

function buildBackendUrl(path: string) {
  return `${getBackendBaseUrl()}${API_PREFIX}${path}`;
}

export async function fetchBackendResponse(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(buildBackendUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function fetchBackendJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchBackendResponse(path, init);

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
