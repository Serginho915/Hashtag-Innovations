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

type AdminMutationBody = {
  resourceKey?: string;
  recordId?: string;
  record?: Record<string, unknown>;
};

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

  const contentType = request.headers.get("content-type") || "";
  const isMultipart = contentType.includes("multipart/form-data");
  let body: AdminMutationBody | null = null;
  let backendBody: BodyInit | undefined;
  let backendHeaders: Record<string, string> = adminBackendHeaders();

  if (isMultipart) {
    const formData = await request.formData().catch(() => null);

    if (!formData) {
      return NextResponse.json({ error: "Admin upload request is invalid." }, { status: 400 });
    }

    body = {
      resourceKey: String(formData.get("resourceKey") || ""),
      recordId: String(formData.get("recordId") || ""),
    };
    formData.delete("resourceKey");
    formData.delete("recordId");
    backendBody = formData;
  } else {
    const requestText = await request.text().catch(() => "");

    if (requestText) {
      try {
        body = JSON.parse(requestText) as AdminMutationBody;
      } catch {
        return NextResponse.json(
          { error: "Admin request body is invalid. If you are uploading a file, try a smaller file." },
          { status: 400 },
        );
      }
    }

    backendHeaders = {
      "Content-Type": "application/json",
      ...backendHeaders,
    };
    backendBody = method === "DELETE" ? undefined : JSON.stringify(body?.record ?? {});
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
      headers: backendHeaders,
      body: method === "DELETE" ? undefined : backendBody,
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
