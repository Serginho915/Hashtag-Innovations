import { LegalPage } from "@/Components/Legal/LegalPage.tsx";

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return <LegalPage lang={lang} pageKey="cookies" />;
}
