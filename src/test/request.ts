import { NextRequest } from "next/server";

/** Builds a NextRequest for calling route handlers directly in tests. */
export function makeRequest(
  path: string,
  { method = "GET", body, headers = {} }: { method?: string; body?: unknown; headers?: Record<string, string> } = {}
): NextRequest {
  return new NextRequest(new URL(path, "http://localhost"), {
    method,
    headers: body === undefined ? headers : { "content-type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
