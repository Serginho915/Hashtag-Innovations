import { Hero } from "../../Components/Sections/Home/Hero/Hero";
import { Community } from "../../Components/Sections/Home/Community/Community";
import { FeaturedVoices } from "../../Components/Sections/Home/FeaturedVoices/FeaturedVoices";
import { ExploreAndLearn } from "../../Components/Sections/Home/ExploreAndLearn/ExploreAndLearn";
import { getHomePageData } from "../../api";

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
