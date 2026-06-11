import { Hero } from "../../Components/Sections/Home/Hero/Hero";
import { Community } from "../../Components/Sections/Home/Community/Community";
import { FeaturedVoices } from "../../Components/Sections/Home/FeaturedVoices/FeaturedVoices";


export default async function Home({ params }: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  return (
    <>
      <Hero lang={lang} />
      <Community lang={lang} />
      <FeaturedVoices lang={lang} />
    </>
  );
}
