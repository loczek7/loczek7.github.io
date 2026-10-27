// Separate root layout for `/`, which only redirects to the default locale.
export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
