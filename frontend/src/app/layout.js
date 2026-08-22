import "./globals.css";

export const metadata = {
  title: "Haul Spire | AI-Powered Sovereign Product Curation Platform",
  description:
    "Curate the future of e-commerce with Haul Spire's Human-in-the-Loop AI agent platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-900 bg-[#F8F9FB] min-h-screen selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
