import type { Metadata } from "next";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/dm-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transformidable — Executive Insight for Technology Leaders",
  description:
    "The flagship publication for C-suite and executive leaders navigating technology-driven transformation. Articles, podcast, and insight on strategy, talent, and execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
