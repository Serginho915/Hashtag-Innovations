import { LegalPage } from "@/Components/Legal/LegalPage.tsx";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return <LegalPage lang={lang} pageKey="terms" />;
}
