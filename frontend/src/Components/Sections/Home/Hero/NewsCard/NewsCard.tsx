import React from "react";
import { translations } from "./translations.ts";
import { ArticleTeaserCard } from "../../../../UI/ArticleTeaserCard/ArticleTeaserCard.tsx";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorAvatarUrl?: string;
  authorExpertId?: string;
  lang: string;
}

export const NewsCard = ({ id, title, excerpt, authorLabel, authorAvatarUrl, authorExpertId, lang }: NewsCardProps) => {
  const t = translations[lang] || translations.en;
  const articleUrl = `/${lang}/insights/${id}`;

  return (
    <ArticleTeaserCard
      as="li"
      title={title}
      excerpt={excerpt}
      authorLabel={authorLabel}
      authorAvatarUrl={authorAvatarUrl}
      authorHref={authorExpertId ? `/${lang}/experts/${authorExpertId}` : undefined}
      readText={t.read}
      readHref={articleUrl}
    />
  );
};
