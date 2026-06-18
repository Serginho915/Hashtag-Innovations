interface ExploreAndLearnTranslations {
  sectionTitle: string;
  textbooks: string;
  blogs: string;
  read: string;
  downloadPdf: string;
}

export const translations: Record<string, ExploreAndLearnTranslations> = {
  en: {
    sectionTitle: "Explore & Learn",
    textbooks: "Textbooks",
    blogs: "Blogs",
    read: "Read",
    downloadPdf: "Download PDF",
  },
  bg: {
    sectionTitle: "Разгледай и научи",
    textbooks: "Учебници",
    blogs: "Блогове",
    read: "Прочети",
    downloadPdf: "Изтегли PDF",
  }
};
