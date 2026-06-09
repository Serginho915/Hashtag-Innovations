import { Hero } from "../../Components/Sections/Home/Hero/Hero";
import { Community } from "../../Components/Sections/Home/Community/Community";


export default async function Home({ params }: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  return (
    <>
      <Hero lang={lang} />
      <Community lang={lang} />
    </>
  );
}
