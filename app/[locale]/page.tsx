import { notFound } from "next/navigation";
import { getMessages, hasLocale } from "@/lib/i18n";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Offer } from "@/components/offer/Offer";
import { Timeline } from "@/components/timeline/Timeline";
import { Stack } from "@/components/stack/Stack";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getMessages(locale);

  // TODO(phase 1): port the remaining sections from docs/design/Main.dc.html.
  return (
    <main>
      <Hero locale={locale} t={t.hero} downloadCv={t.common.downloadCv} />
      <About t={t.about} />
      <Offer t={t.offer} />
      <Timeline t={t.timeline} />
      {/* TODO(phase 1, step 4): project galaxy (#projects) goes here. */}
      <Stack t={t.stack} />
    </main>
  );
}
