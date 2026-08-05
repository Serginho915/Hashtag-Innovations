import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminApiToken,
  getBackendApiUrl,
  verifyAdminSession,
} from "@/Lib/adminAuth";

const adminBackendHeaders = () => ({
  "X-Admin-Api-Token": getAdminApiToken(),
});

const isAdminRequest = async (request: NextRequest) =>
  verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/api/admin/ai-insight-settings/`, {
    headers: adminBackendHeaders(),
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Admin backend is unavailable" }, { status: 502 });
  }

  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok || !payload) {
    return NextResponse.json(payload ?? { error: "Failed to load AI insight settings" }, { status: 502 });
  }

  return NextResponse.json(payload);
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.text().catch(() => "");
  const backendResponse = await fetch(`${getBackendApiUrl()}/api/admin/ai-insight-settings/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...adminBackendHeaders(),
    },
    body,
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Admin backend is unavailable" }, { status: 502 });
  }

  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(payload ?? { error: "Failed to save AI insight settings" }, { status: backendResponse.status });
  }

  return NextResponse.json(payload);
}
