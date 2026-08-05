import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminApiToken,
  getBackendApiUrl,
  verifyAdminSession,
} from "@/Lib/adminAuth";

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAdminSession(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/api/admin/ai-insight-settings/generate/`, {
    method: "POST",
    headers: {
      "X-Admin-Api-Token": getAdminApiToken(),
    },
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Admin backend is unavailable" }, { status: 502 });
  }

  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(payload ?? { error: "Failed to generate AI insight" }, { status: backendResponse.status });
  }

  return NextResponse.json(payload, { status: backendResponse.status });
}
