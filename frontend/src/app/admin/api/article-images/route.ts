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

  const formData = await request.formData().catch(() => null);
  const image = formData?.get("image");

  if (!formData || !(image instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  const backendResponse = await fetch(`${getBackendApiUrl()}/api/admin/article-images/`, {
    method: "POST",
    headers: {
      "X-Admin-Api-Token": getAdminApiToken(),
    },
    body: formData,
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json({ error: "Admin backend is unavailable" }, { status: 502 });
  }

  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(
      payload ?? { error: "Could not upload the article image." },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json(payload, { status: 201 });
}
