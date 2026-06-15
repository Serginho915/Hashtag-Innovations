import { getExpertById, getHomePageData } from '../../../../api';
import ExpertProfile from '../../../../Components/Sections/Experts/ExpertProfile/ExpertProfile';
import { notFound } from 'next/navigation';
import { translations } from '../translations';

export default async function ExpertPage({
  params
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const { lang, id } = await params;
  const expert = await getExpertById(id, lang);

  if (!expert) {
    notFound();
  }

  // Fetch all experts to use as similar experts (excluding the current one)
  const homeData = await getHomePageData(lang);
  const similarExperts = homeData.experts.filter(e => e.id !== id);

  const t = translations[lang] || translations['en'];

  return (
    <main>
      <ExpertProfile expert={expert} similarExperts={similarExperts} t={t} lang={lang} />
    </main>
  );
}
