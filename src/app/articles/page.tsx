import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { getAllIssues } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Archive — Transformidable",
  description:
    "Browse past issues of Transformidable — executive insight on technology strategy, project execution, talent development, and leadership.",
};

export default async function ArchivePage() {
  const issues = await getAllIssues();

  return (
    <>
      <SiteNav />

      <main className="bg-parchment">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h1 className="font-serif text-4xl font-bold text-obsidian md:text-5xl">
            Archive
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-obsidian/60 font-light">
            Past issues of Transformidable.
          </p>

          {/* Issue list */}
          <div className="mt-12 space-y-16">
            {issues.map((issue) => {
              const articles = issue.articles ?? [];
              const flagship = articles.find((a) => a.isFlagship);
              const remaining = articles
                .filter((a) => !a.isFlagship)
                .sort((a, b) => a.position - b.position);

              const issueDate = new Date(issue.publishDate);
              const dateStr = isNaN(issueDate.getTime())
                ? ""
                : issueDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  });

              return (
                <section key={issue.id}>
                  {/* Issue header */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-oxblood md:text-xs">
                        {[
                          issue.issueNumber != null ? `Issue ${String(issue.issueNumber).padStart(2, "0")}` : null,
                          issue.volume != null ? `Volume ${issue.volume}` : null,
                          issue.season || null,
                        ].filter(Boolean).join(" · ")}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl font-bold italic leading-snug text-obsidian md:text-3xl">
                        <Link href="/" className="transition-colors hover:text-oxblood">
                          {issue.headline || issue.title}
                        </Link>
                      </h2>
                      {issue.subheadline && (
                        <p className="mt-1 text-sm text-obsidian/50">
                          {issue.subheadline}
                        </p>
                      )}
                    </div>
                    {dateStr && (
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-obsidian/40">
                        {dateStr}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 h-[2px] bg-oxblood" />

                  {/* Articles in this issue */}
                  <div className="mt-6 space-y-4">
                    {flagship && (
                      <div className="flex items-baseline gap-4">
                        <span className="w-6 shrink-0 text-right text-xs font-bold text-gold">
                          {String(flagship.position).padStart(2, "0")}
                        </span>
                        <span className="text-xs text-gold" aria-label="Flagship">★</span>
                        <div>
                          <p className="font-serif text-base font-semibold leading-snug text-obsidian md:text-lg">
                            {flagship.article.title}
                          </p>
                          <p className="mt-1 text-xs text-obsidian/50 md:text-sm">
                            {flagship.article.excerpt}
                          </p>
                        </div>
                      </div>
                    )}
                    {remaining.map((ia) => (
                      <div key={ia.article.id} className="flex items-baseline gap-4">
                        <span className="w-6 shrink-0 text-right text-xs font-bold text-obsidian/30">
                          {String(ia.position).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="font-serif text-sm font-medium leading-snug text-obsidian/80 md:text-base">
                            {ia.article.title}
                          </p>
                          {ia.article.brandPillars?.[0] && (
                            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-obsidian/40 md:text-[10px]">
                              {ia.article.brandPillars[0].name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Read this issue link */}
                  <Link
                    href="/"
                    className="mt-6 inline-block rounded-sm border border-oxblood/40 px-6 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-oxblood transition-colors hover:bg-oxblood/5 md:text-xs"
                  >
                    Read This Issue →
                  </Link>
                </section>
              );
            })}
          </div>

          {!issues.length && (
            <p className="mt-12 font-serif text-lg text-obsidian/60 italic">
              No published issues yet.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
