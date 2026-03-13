import { NextRequest, NextResponse } from "next/server";

import { fetchBackendResponse } from "@/lib/api";

export async function proxyRequest(request: NextRequest, path: string) {
  const bodyText =
    request.method === "GET" || request.method === "DELETE"
      ? undefined
      : await request.text();

  const response = await fetchBackendResponse(path, {
    method: request.method,
    body: bodyText,
    headers: bodyText ? { "Content-Type": "application/json" } : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "application/json";
  const payload = await response.text();

  return new NextResponse(payload, {
    status: response.status,
    headers: {
      "content-type": contentType,
    },
  });
}
