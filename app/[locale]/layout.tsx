import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Space_Grotesk, Unbounded } from "next/font/google";
import { getMessages, hasLocale, locales } from "@/lib/i18n";
import "@/styles/tokens.css";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  display: "swap",
});

// Only /pl and /en exist; anything else is a 404 in the static export.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { meta } = getMessages(locale);

  return {
    metadataBase: new URL("https://loczek7.github.io"),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        pl: "/pl/",
        en: "/en/",
        "x-default": "/pl/",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${unbounded.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
