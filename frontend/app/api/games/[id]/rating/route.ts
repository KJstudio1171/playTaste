import { NextRequest } from "next/server";

import { proxyRequest } from "@/lib/proxy";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyRequest(request, `/games/${id}/rating`);
}
