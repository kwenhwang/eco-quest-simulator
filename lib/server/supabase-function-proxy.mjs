const DEFAULT_TIMEOUT_MS = 8_000;

const trimTrailingSlash = (value) => value.replace(/\/$/, "");

export function hasSupabaseFunctionConfig() {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    return false;
  }
  return Boolean(anon || service);
}

export function createSupabaseFunctionUrl(functionName) {
  if (!functionName) {
    return null;
  }
  const baseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) {
    return null;
  }
  const trimmedBase = trimTrailingSlash(baseUrl);
  return `${trimmedBase}/functions/v1/${functionName}`;
}

export function buildSupabaseHeaders() {
  const anon =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!anon && !service) {
    return null;
  }
  const token = service || anon;
  return {
    Authorization: `Bearer ${token}`,
    apikey: anon || token,
    "Content-Type": "application/json",
  };
}

export async function forwardSupabaseFunction(
  functionName,
  payload,
  fetchImpl = globalThis.fetch,
  options,
) {
  const url = createSupabaseFunctionUrl(functionName);
  const headers = buildSupabaseHeaders();
  if (!url || !headers || typeof fetchImpl !== "function") {
    return { forwarded: false, reason: "missing-config" };
  }

  const controller = new AbortController();
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers,
      body: payload === undefined ? undefined : JSON.stringify(payload),
      signal: controller.signal,
    });

    const headerEntries = {};
    response.headers.forEach((value, key) => {
      headerEntries[key] = value;
    });

    const bodyText = await response.text();

    return {
      forwarded: true,
      ok: response.ok,
      status: response.status,
      headers: headerEntries,
      bodyText,
    };
  } catch (error) {
    return { forwarded: false, reason: "network-error", error };
  } finally {
    clearTimeout(timer);
  }
}
