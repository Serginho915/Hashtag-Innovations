import Link from "next/link";

type PurchaseType = "consultation" | "learn_material" | "event_ticket";

const getBackendApiUrl = () =>
  (process.env.BACKEND_INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000").replace(/\/$/, "");

const copy = {
  en: {
    label: "Payment successful",
    title: "Thank you",
    home: "Back to home",
    messages: {
      consultation: "Thank you for your purchase. The expert will contact you shortly.",
      learn_material: "Thank you for your purchase. The purchased material will be sent to your email shortly.",
      event_ticket: "Thank you for your purchase. Your event registration confirmation will be sent to your email shortly.",
      fallback: "Thank you for your purchase. We will contact you shortly with the next steps.",
    },
  },
  bg: {
    label: "Успешно плащане",
    title: "Благодарим ви",
    home: "Към началото",
    messages: {
      consultation: "Благодарим ви за покупката. Експертът ще се свърже с вас скоро.",
      learn_material: "Благодарим ви за покупката. Закупеният материал ще бъде изпратен на имейла ви скоро.",
      event_ticket: "Благодарим ви за покупката. Потвърждението за регистрацията за събитието ще бъде изпратено на имейла ви скоро.",
      fallback: "Благодарим ви за покупката. Ще се свържем с вас скоро със следващите стъпки.",
    },
  },
} as const;

const getPurchaseType = async (sessionId?: string): Promise<PurchaseType | undefined> => {
  if (!sessionId) {
    return undefined;
  }

  try {
    const response = await fetch(
      `${getBackendApiUrl()}/api/payments/checkout-status/?session_id=${encodeURIComponent(sessionId)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as { purchaseType?: PurchaseType };
    return payload.purchaseType;
  } catch {
    return undefined;
  }
};

export default async function PaymentSuccessPage({ params, searchParams }: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { lang } = await params;
  const { session_id: sessionId } = await searchParams;
  const locale = lang === "bg" ? "bg" : "en";
  const t = copy[locale];
  const purchaseType = await getPurchaseType(sessionId);
  const message = purchaseType ? t.messages[purchaseType] : t.messages.fallback;

  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "96px 24px", color: "#1e1e20" }}>
      <p style={{ margin: "0 0 12px", fontWeight: 800, textTransform: "uppercase", color: "#076f7f" }}>
        {t.label}
      </p>
      <h1 style={{ margin: "0 0 16px", fontSize: 48, lineHeight: 1.08 }}>
        {t.title}
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 18, lineHeight: 1.6 }}>
        {message}
      </p>
      <Link href={`/${lang}`} style={{ color: "#000", fontWeight: 800 }}>
        {t.home}
      </Link>
    </section>
  );
}
