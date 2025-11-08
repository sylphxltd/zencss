import 'silk.css'; // Virtual module → Next.js webpack CSS pipeline

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js + Silk (Webpack) Test</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
