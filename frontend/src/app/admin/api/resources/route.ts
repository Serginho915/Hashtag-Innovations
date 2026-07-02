import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getBackendApiUrl,
  verifyAdminSession,
} from "@/Lib/adminAuth";

export async function GET(request: NextRequest) {
  const isAuthenticated = await verifyAdminSession(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/api/admin/resources/`, {
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Admin backend is unavailable" }, { status: 502 });
  }

  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok || !payload) {
    return NextResponse.json({ error: "Failed to load admin resources" }, { status: 502 });
  }

  return NextResponse.json(payload);
}
