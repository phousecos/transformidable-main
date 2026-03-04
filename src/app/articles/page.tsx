import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";
import { articles, brandPillars } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Articles — Transformidable",
  description:
    "Executive insight on technology strategy, project execution, talent development, and leadership.",
};

export default function ArticlesPage() {
  const published = articles.filter((a) => a.status === "published");

  return (
    <>
      <Navbar />
      <main className="bg-parchment">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <h1 className="font-serif text-4xl font-bold text-obsidian md:text-5xl">
            Articles
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-obsidian/60 font-light">
            Ideas, strategies, and perspectives for technology leaders who drive
            transformation.
          </p>

          <div className="mt-10">
            <ArticleList articles={published} brandPillars={brandPillars} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
