import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transformidable — Executive Insight for Technology Leaders",
  description:
    "The flagship publication for C-suite and executive leaders navigating technology-driven transformation. Articles, podcast, and insight on strategy, talent, and execution.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
