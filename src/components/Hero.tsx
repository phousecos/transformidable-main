import Link from "next/link";
import type { Article } from "@/lib/types";

interface HeroProps {
  article: Article;
}

export default function Hero({ article }: HeroProps) {
  const pillarLabel = article.brandPillars[0]?.name ?? "Executive Leadership";

  return (
    <section className="bg-obsidian">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:pt-28 md:pb-20">
        {/* Category tag */}
        <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-gold">
          {pillarLabel}
        </span>

        {/* Headline */}
        <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-parchment md:text-5xl lg:text-[56px] lg:leading-[1.1]">
          <Link
            href={`/articles/${article.slug}`}
            className="transition-colors hover:text-gold"
          >
            {article.title}
          </Link>
        </h1>

        {/* Excerpt */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-parchment/65 font-light">
          {article.excerpt}
        </p>

        {/* Author + read time */}
        <div className="mt-8 flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
            {article.author.name}
          </span>
          {article.readTime && (
            <>
              <span className="text-gold/40">·</span>
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold/70">
                {article.readTime}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Gold rule */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gold/30" />
      </div>
    </section>
  );
}
