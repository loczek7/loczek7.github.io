import pl from "@/messages/pl.json";
import en from "@/messages/en.json";

export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";

export type Messages = typeof pl;

const messages: Record<Locale, Messages> = { pl, en };

// Labels shown in the language switcher (prototype: PL / ENG).
export const localeLabels: Record<Locale, string> = { pl: "PL", en: "ENG" };

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

// TODO(phase 2): add cv-pl.pdf and cv-en.pdf to public/cv/.
export function cvHref(locale: Locale): string {
  return `/cv/cv-${locale}.pdf`;
}
