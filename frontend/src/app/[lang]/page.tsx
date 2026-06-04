import { Hero } from "../../Components/Sections/Home/Hero/Hero";


export default async function Home({ params }: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  return (
    <>
      <Hero />
    </>
  );
}
