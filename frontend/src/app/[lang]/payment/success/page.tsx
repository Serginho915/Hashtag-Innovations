import Link from "next/link";

export default async function PaymentSuccessPage({ params }: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "96px 24px", color: "#1e1e20" }}>
      <p style={{ margin: "0 0 12px", fontWeight: 800, textTransform: "uppercase", color: "#076f7f" }}>
        Payment started
      </p>
      <h1 style={{ margin: "0 0 16px", fontSize: 48, lineHeight: 1.08 }}>
        Thank you
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 18, lineHeight: 1.6 }}>
        Stripe has redirected you back to Hashtag Innovations. The purchase request is visible in the admin sales tab.
      </p>
      <Link href={`/${lang}`} style={{ color: "#000", fontWeight: 800 }}>
        Back to home
      </Link>
    </section>
  );
}
