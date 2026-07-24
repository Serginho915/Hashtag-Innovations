import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminApiToken,
  getBackendApiUrl,
  verifyAdminSession,
} from "@/Lib/adminAuth";

const isAdminRequest = async (request: NextRequest) =>
  verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

const adminBackendHeaders = () => ({
  "X-Admin-Api-Token": getAdminApiToken(),
});

export async function GET(request: NextRequest) {
  const isAuthenticated = await verifyAdminSession(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/api/admin/resources/`, {
    headers: adminBackendHeaders(),
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

const forwardMutation = async (request: NextRequest, method: "POST" | "PATCH" | "DELETE") => {
  const isAuthenticated = await isAdminRequest(request);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestText = await request.text().catch(() => "");
  let body: {
    resourceKey?: string;
    recordId?: string;
    record?: Record<string, unknown>;
  } | null = null;

  if (requestText) {
    try {
      body = JSON.parse(requestText) as typeof body;
    } catch {
      return NextResponse.json(
        { error: "Admin request body is invalid. If you are uploading a file, try a smaller file." },
        { status: 400 },
      );
    }
  }

  if (!body?.resourceKey) {
    return NextResponse.json({ error: "Admin request is missing a resource key." }, { status: 400 });
  }

  if (method !== "POST" && !body.recordId) {
    return NextResponse.json({ error: "Missing record id" }, { status: 400 });
  }

  const resourcePath = encodeURIComponent(body.resourceKey);
  const recordPath = body.recordId ? `${encodeURIComponent(body.recordId)}/` : "";
  const backendResponse = await fetch(
    `${getBackendApiUrl()}/api/admin/resources/${resourcePath}/${recordPath}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        ...adminBackendHeaders(),
      },
      body: method === "DELETE" ? undefined : JSON.stringify(body.record ?? {}),
      cache: "no-store",
    },
  ).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Admin backend is unavailable" }, { status: 502 });
  }

  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(
      payload ?? { error: "Failed to save admin resource" },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json(payload);
};

export async function POST(request: NextRequest) {
  return forwardMutation(request, "POST");
}

export async function PATCH(request: NextRequest) {
  return forwardMutation(request, "PATCH");
}

export async function DELETE(request: NextRequest) {
  return forwardMutation(request, "DELETE");
}
