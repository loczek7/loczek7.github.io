import { notFound } from "next/navigation";
import { getMessages, hasLocale } from "@/lib/i18n";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getMessages(locale);

  // TODO(phase 1): port the remaining sections from docs/design/Main.dc.html.
  return (
    <main>
      <Hero locale={locale} t={t.hero} downloadCv={t.common.downloadCv} />
      <About t={t.about} />
    </main>
  );
}
