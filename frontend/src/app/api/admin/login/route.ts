import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSession,
  getBackendApiUrl,
} from "@/Lib/adminAuth";

const normalizeNextPath = (nextPath?: string) => {
  if (!nextPath?.startsWith("/admin") || nextPath.startsWith("/admin/login")) {
    return "/admin";
  }

  return nextPath;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
    next?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";
  const backendResponse = await fetch(`${getBackendApiUrl()}/api/admin/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Admin backend is unavailable" }, { status: 502 });
  }

  if (!backendResponse.ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const adminUser = (await backendResponse.json()) as {
    username?: string;
  };

  const response = NextResponse.json({ next: normalizeNextPath(body?.next) });
  const session = await createAdminSession(adminUser.username || username);

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: session,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    path: "/admin",
  });

  return response;
}
