import { Hero } from "../../Components/Sections/Home/Hero/Hero.tsx";
import { Community } from "../../Components/Sections/Home/Community/Community.tsx";
import { FeaturedVoices } from "../../Components/Sections/Home/FeaturedVoices/FeaturedVoices.tsx";
import { ExploreAndLearn } from "../../Components/Sections/Home/ExploreAndLearn/ExploreAndLearn.tsx";
import { getHomePageData } from "../../api/index.ts";

export default async function Home({ params }: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const data = await getHomePageData(lang);

  return (
    <>
      <Hero lang={lang} news={data.news} upcomingEvents={data.upcomingEvents} />
      <Community lang={lang} events={data.communityEvents} />
      <FeaturedVoices lang={lang} experts={data.experts} />
      <ExploreAndLearn lang={lang} textbooks={data.textbooks} popularInsights={data.popularInsights} />
    </>
  );
}
