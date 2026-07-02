import type { Metadata } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import "@/Styles/globals.scss";

const ebgaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Admin | Hashtag Innovations",
  description: "Hashtag Innovations content administration",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ebgaramond.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
