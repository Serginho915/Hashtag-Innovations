import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/Lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid chat request" }, { status: 400 });
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/api/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Chat backend is unavailable" }, { status: 502 });
  }

  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(
      payload ?? { error: "Failed to get assistant response" },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json(payload);
}
