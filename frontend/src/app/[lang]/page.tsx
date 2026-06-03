import Image from "next/image";


export default async function Home({ params }: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  return (
    <>
      
    </>
  );
}
