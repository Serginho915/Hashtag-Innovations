export const i18n = {
  locales: ["en", "bg"],
  defaultLocale: "bg",
} as const;

export type Locale = (typeof i18n)['locales'][number];