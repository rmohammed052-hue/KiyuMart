import { QueryClient, QueryFunction } from "@tanstack/react-query";

const TIMEOUT_MS = 30000; // 30s default timeout
let csrfToken: string | null = null;

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const res = await fetch('/api/csrf-token', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to obtain CSRF token');
  const data = await res.json();
  csrfToken = data.token;
  return csrfToken!;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    try {
      const json = JSON.parse(text);
      throw json; // throw structured JSON error if available
    } catch {
      throw { error: `${res.status}: ${text}` };
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = {};
  if (data) headers["Content-Type"] = "application/json";

  // Attach CSRF token for mutating requests
  const upper = method.toUpperCase();
  if (["POST", "PATCH", "PUT", "DELETE"].includes(upper)) {
    headers["X-CSRF-Token"] = await getCsrfToken();
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    signal: controller.signal,
  }).catch((err) => {
    if (err?.name === 'AbortError') {
      throw { error: `Request timeout after ${TIMEOUT_MS}ms` };
    }
    throw err;
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Only use the first element as the URL, rest are just cache keys
    const url = queryKey[0] as string;
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
