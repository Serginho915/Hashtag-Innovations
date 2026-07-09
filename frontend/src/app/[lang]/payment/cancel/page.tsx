import Link from "next/link";

export default async function PaymentCancelPage({ params }: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "96px 24px", color: "#1e1e20" }}>
      <p style={{ margin: "0 0 12px", fontWeight: 800, textTransform: "uppercase", color: "#d62612" }}>
        Payment canceled
      </p>
      <h1 style={{ margin: "0 0 16px", fontSize: 48, lineHeight: 1.08 }}>
        No charge was made
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 18, lineHeight: 1.6 }}>
        You can return to the site and start checkout again whenever you are ready.
      </p>
      <Link href={`/${lang}`} style={{ color: "#000", fontWeight: 800 }}>
        Back to home
      </Link>
    </section>
  );
}
