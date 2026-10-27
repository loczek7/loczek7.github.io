import { notFound } from "next/navigation";
import { getMessages, hasLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getMessages(locale);

  // TODO(phase 1): port sections from docs/design/Main.dc.html.
  return (
    <main>
      <p className="kicker">{t.heroOpen}</p>
      <h1 className="display">{t.meta.title}</h1>
    </main>
  );
}
