import type { Metadata } from "next";
import { defaultLocale } from "@/lib/i18n";

const target = `/${defaultLocale}/`;

export const metadata: Metadata = {
  title: "Marceli Duraziński",
  robots: { index: false },
};

// GitHub Pages has no server redirects, so `/` uses a meta refresh
// (React hoists the <meta> into <head>).
export default function RootRedirectPage() {
  return (
    <main>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <a href={target}>Marceli Duraziński — portfolio</a>
    </main>
  );
}
