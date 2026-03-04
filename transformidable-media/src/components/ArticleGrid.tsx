import Link from "next/link";
import { Article } from "@/lib/mock-data";

interface ArticleGridProps {
  articles: Article[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const pillarLabel = article.brandPillars[0]?.name ?? "Executive Leadership";

  return (
    <article className="group border-b border-obsidian/10 pb-8">
      {/* Category tag */}
      <span className="mb-3 inline-block text-[11px] font-medium uppercase tracking-[0.2em] text-oxblood">
        {pillarLabel}
      </span>

      {/* Headline */}
      <h3 className="font-serif text-2xl font-semibold leading-snug text-obsidian">
        <Link
          href={`/articles/${article.slug}`}
          className="transition-colors group-hover:text-oxblood"
        >
          {article.title}
          <span className="block h-0.5 max-w-0 bg-oxblood transition-all duration-300 group-hover:max-w-full" />
        </Link>
      </h3>

      {/* Excerpt */}
      <p className="mt-3 text-base leading-relaxed text-obsidian/60 font-light">
        {article.excerpt}
      </p>

      {/* Author + read time */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
          {article.author.name}
        </span>
        {article.readTime && (
          <>
            <span className="text-obsidian/20">·</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-obsidian/40">
              {article.readTime}
            </span>
          </>
        )}
      </div>
    </article>
  );
}
