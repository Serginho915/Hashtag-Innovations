import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/Lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid checkout request" }, { status: 400 });
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/api/payments/checkout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      frontendBaseUrl: request.nextUrl.origin,
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Payment backend is unavailable" }, { status: 502 });
  }

  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(
      payload ?? { error: "Failed to create Stripe checkout session" },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json(payload, { status: backendResponse.status });
}
