export const ADMIN_SESSION_COOKIE = "hashtag_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

interface AdminSessionPayload {
  username: string;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const getAdminSecret = () =>
  process.env.ADMIN_SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  process.env.DJANGO_SECRET_KEY ||
  "unsafe-dev-admin-session-secret";

export const getBackendApiUrl = () =>
  (process.env.BACKEND_INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000").replace(/\/$/, "");

const bytesToBase64Url = (bytes: Uint8Array) => {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};

const stringToBase64Url = (value: string) => bytesToBase64Url(encoder.encode(value));

const base64UrlToBytes = (value: string) => {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(normalized + padding);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const sign = async (value: string) => {
  const secret = getAdminSecret();

  if (!secret) {
    return "";
  }

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return bytesToBase64Url(new Uint8Array(signature));
};

export const createAdminSession = async (username: string) => {
  const payload: AdminSessionPayload = {
    username,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };
  const encodedPayload = stringToBase64Url(JSON.stringify(payload));
  const signature = await sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
};

export const verifyAdminSession = async (sessionCookie?: string) => {
  if (!sessionCookie) {
    return false;
  }

  const [encodedPayload, signature] = sessionCookie.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = await sign(encodedPayload);

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const payload = JSON.parse(decoder.decode(base64UrlToBytes(encodedPayload))) as AdminSessionPayload;

    return Boolean(payload.username) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};
