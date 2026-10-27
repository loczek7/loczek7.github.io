import pl from "@/messages/pl.json";
import en from "@/messages/en.json";

export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";

export type Messages = typeof pl;

const messages: Record<Locale, Messages> = { pl, en };

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
