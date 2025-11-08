import '../silk.generated.css'; // Physical file → Next.js CSS pipeline

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js + Silk (Turbopack + CLI) Test</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
