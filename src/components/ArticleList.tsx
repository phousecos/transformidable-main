"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article, BrandPillar } from "@/lib/types";

interface ArticleListProps {
  articles: Article[];
  brandPillars: BrandPillar[];
  initialFilter?: string;
}

export default function ArticleList({
  articles,
  brandPillars,
  initialFilter,
}: ArticleListProps) {
  const [activeFilter, setActiveFilter] = useState<string>(
    initialFilter ?? "all"
  );

  const filtered =
    activeFilter === "all"
      ? articles
      : articles.filter((a) =>
          a.brandPillars.some((bp) => bp.slug === activeFilter)
        );

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <FilterTag
          label="All"
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        />
        {brandPillars.map((bp) => (
          <FilterTag
            key={bp.id}
            label={bp.name}
            active={activeFilter === bp.slug}
            onClick={() =>
              setActiveFilter(activeFilter === bp.slug ? "all" : bp.slug)
            }
          />
        ))}
      </div>

      {/* Article listing */}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {filtered.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-obsidian/40">
          No articles match this filter.
        </p>
      )}
    </>
  );
}

function FilterTag({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
        active
          ? "border-oxblood bg-oxblood text-parchment"
          : "border-obsidian/20 text-obsidian/60 hover:border-oxblood hover:text-oxblood"
      }`}
    >
      {label}
    </button>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const pillarLabel = article.brandPillars[0]?.name ?? "Executive Leadership";
  const date = new Date(article.publishDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group border-b border-obsidian/10 pb-8">
      <div className="flex flex-wrap items-center gap-2">
        {article.brandPillars.map((bp) => (
          <Link
            key={bp.id}
            href={`/brand/${bp.slug}`}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-oxblood transition-colors hover:text-oxblood/70"
          >
            {bp.name}
          </Link>
        ))}
      </div>

      <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug text-obsidian">
        <Link
          href={`/articles/${article.slug}`}
          className="transition-colors group-hover:text-oxblood"
        >
          {article.title}
          <span className="block h-0.5 max-w-0 bg-oxblood transition-all duration-300 group-hover:max-w-full" />
        </Link>
      </h3>

      <p className="mt-3 text-base leading-relaxed text-obsidian/60 font-light">
        {article.excerpt}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
          {article.author.name}
        </span>
        <span className="text-obsidian/20">·</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-obsidian/40">
          {date}
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
