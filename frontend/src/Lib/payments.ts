export type PurchaseType = "consultation" | "learn_material" | "event_ticket";

export interface CheckoutPayload {
  purchaseType: PurchaseType;
  itemId: string;
  customerName: string;
  customerEmail: string;
  lang: string;
  sessionId?: string;
  additional?: string;
}

export const createCheckoutSession = async (payload: CheckoutPayload) => {
  const response = await fetch("/api/payments/checkout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = await response.json().catch(() => null) as {
    checkoutUrl?: string;
    error?: string;
  } | null;

  if (!response.ok || !responsePayload?.checkoutUrl) {
    throw new Error(responsePayload?.error || "Could not start payment.");
  }

  return responsePayload.checkoutUrl;
};
