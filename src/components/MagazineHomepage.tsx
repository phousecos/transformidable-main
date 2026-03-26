"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteNav from "./SiteNav";
import type { Issue, Article } from "@/lib/types";

type View =
  | { kind: "cover" }
  | { kind: "editors-letter" }
  | { kind: "this-issue" }
  | { kind: "article"; article: Article; position: number };

interface MagazineHomepageProps {
  issue: Issue;
}

export default function MagazineHomepage({ issue }: MagazineHomepageProps) {
  const [view, setView] = useState<View>({ kind: "cover" });

  const vol = issue.volume ?? 1;
  const num = issue.issueNumber ?? 1;
  const volumeLabel = `VOL. ${"I".repeat(vol)} · ISSUE ${String(num).padStart(2, "0")}`;
  const issueNumberFormatted = String(num).padStart(2, "0");

  const articles = issue.articles ?? [];
  const flagship = articles.find((a) => a.isFlagship);
  const remaining = articles
    .filter((a) => !a.isFlagship)
    .sort((a, b) => a.position - b.position);

  const openArticle = (article: Article, position: number) => {
    setView({ kind: "article", article, position });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs: { id: View["kind"]; label: string }[] = [
    { id: "cover", label: "COVER" },
    { id: "editors-letter", label: "EDITOR\u2019S LETTER" },
    { id: "this-issue", label: "THIS ISSUE" },
  ];

  const handleTabClick = (tabId: View["kind"]) => {
    if (tabId === "cover") setView({ kind: "cover" });
    else if (tabId === "editors-letter") setView({ kind: "editors-letter" });
    else if (tabId === "this-issue") setView({ kind: "this-issue" });
  };

  // Determine which tab is active (articles map back to "this-issue")
  const activeTabId = view.kind === "article" ? "this-issue" : view.kind;

  return (
    <>
      <SiteNav />

      {/* Magazine tab bar + breadcrumb */}
      <div className="sticky top-[56px] z-40 bg-obsidian md:top-[60px]">
        {/* Tab bar */}
        <div className="border-t border-parchment/10">
          <div className="mx-auto flex max-w-5xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 py-3 text-center text-xs font-medium tracking-[0.15em] transition-colors md:text-sm md:tracking-[0.2em] ${
                  activeTabId === tab.id
                    ? "bg-parchment/10 text-gold"
                    : "text-parchment/60 hover:text-parchment"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Article breadcrumb bar — shown when reading an article */}
        {view.kind === "article" && (
          <div className="border-t border-parchment/10 bg-obsidian/80">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-2">
              <button
                onClick={() => setView({ kind: "this-issue" })}
                className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:text-parchment md:text-xs"
              >
                &larr; Back to Issue
              </button>
              <span className="text-parchment/20">|</span>
              <span className="truncate text-[10px] font-medium tracking-[0.1em] text-parchment/50 md:text-xs">
                {String(view.position).padStart(2, "0")} &middot; {view.article.title}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <main className="min-h-[60vh]">
        {view.kind === "cover" && (
          <CoverView
            issue={issue}
            issueNumber={issueNumberFormatted}
            onNavigate={() => setView({ kind: "this-issue" })}
          />
        )}
        {view.kind === "editors-letter" && (
          <EditorsLetterView issue={issue} />
        )}
        {view.kind === "this-issue" && (
          <ThisIssueView
            issue={issue}
            flagship={flagship}
            remaining={remaining}
            onOpenArticle={openArticle}
          />
        )}
        {view.kind === "article" && (
          <ArticleReadView
            article={view.article}
            position={view.position}
            issue={issue}
            allArticles={articles}
            onOpenArticle={openArticle}
            onBackToIssue={() => setView({ kind: "this-issue" })}
          />
        )}
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Cover Tab
// ---------------------------------------------------------------------------

function CoverView({
  issue,
  issueNumber,
  onNavigate,
}: {
  issue: Issue;
  issueNumber: string;
  onNavigate: () => void;
}) {
  const coverArticles = issue.articles ?? [];

  return (
    <section className="bg-obsidian">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-12 md:pt-16 md:pb-20">
        {/* Volume / Season / Publisher */}
        <p className="mb-10 text-[10px] font-medium uppercase tracking-[0.25em] text-parchment/50 md:mb-14 md:text-xs">
          {issue.volume != null && <>Volume {issue.volume} &nbsp;·&nbsp;</>}{issue.season}{issue.season && <> &nbsp;·&nbsp;</>}
          <a href="https://phousecos.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">Powerhouse Industries</a>
        </p>

        {/* Large decorative issue number */}
        <p
          className="font-serif text-[64px] font-bold leading-none text-parchment/20 md:text-[96px]"
          aria-hidden="true"
        >
          {issueNumber}
        </p>

        {/* Wordmark */}
        <div className="mt-4">
          <Image
            src="/logo.png"
            alt="Transformidable"
            width={800}
            height={200}
            className="h-5 w-auto opacity-80 md:h-6"
          />
        </div>

        {/* Headline */}
        <h1 className="mt-6 font-serif text-3xl font-bold italic leading-tight text-parchment md:mt-8 md:text-[40px] md:leading-[1.15]">
          {(issue.headline ?? "").split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <p className="mt-4 text-sm font-light text-parchment/50 md:text-base">
          {issue.subheadline}
        </p>

        {/* Divider */}
        <div className="mt-10 h-px w-16 bg-gold md:mt-14" />

        {/* In This Issue */}
        <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.25em] text-parchment/50 md:text-xs">
          In This Issue
        </p>

        <div className="mt-6 space-y-4">
          {coverArticles
            .sort((a, b) => a.position - b.position)
            .map((ia) => (
              <div key={ia.article.id} className="flex items-baseline gap-4">
                <span className="w-6 shrink-0 text-right text-xs font-bold text-gold">
                  {String(ia.position).padStart(2, "0")}
                </span>
                {ia.isFlagship && (
                  <span className="text-xs text-gold" aria-label="Flagship">
                    ★
                  </span>
                )}
                <span
                  className={`font-serif text-sm leading-snug md:text-base ${
                    ia.isFlagship
                      ? "font-semibold text-parchment"
                      : "font-normal text-parchment/70"
                  }`}
                >
                  {ia.article.title}
                </span>
              </div>
            ))}
        </div>

        {/* Read This Issue CTA */}
        <button
          onClick={onNavigate}
          className="mt-10 rounded-sm border border-gold/60 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
        >
          Read This Issue →
        </button>
      </div>

      {/* Footer bar */}
      <div className="border-t border-parchment/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-parchment/40 md:text-xs">
            A publication of <a href="https://phousecos.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">Powerhouse Industries</a>
          </p>
          <p className="font-serif text-xs italic text-gold/60 md:text-sm">
            {issue.season}
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Editor's Letter Tab
// ---------------------------------------------------------------------------

function EditorsLetterView({ issue }: { issue: Issue }) {
  const editorsLetter = issue.editorsLetter;
  if (!editorsLetter?.body) {
    return (
      <section className="bg-parchment">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="font-serif text-lg text-obsidian/60 italic">
            Editor&apos;s letter coming soon.
          </p>
        </div>
      </section>
    );
  }

  // Body may be plain text (mock data, newline-separated) or HTML (from CMS
  // Lexical → normalizeBody). Detect which format we have and render accordingly.
  const isHtml = editorsLetter.body.trim().startsWith("<");

  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-12 md:pt-16 md:pb-20">
        {/* Section label */}
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-oxblood md:text-xs">
          From the Editor
        </p>

        {/* Gold rule */}
        <div className="mt-4 h-[2px] w-16 bg-oxblood" />

        {/* Letter body */}
        {isHtml ? (
          <div
            className="mt-10 space-y-6 font-serif text-lg leading-[1.8] text-obsidian md:mt-14 md:text-xl [&>p]:mb-6"
            dangerouslySetInnerHTML={{ __html: editorsLetter.body }}
          />
        ) : (
          <div className="mt-10 space-y-6 md:mt-14">
            {editorsLetter.body.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="font-serif text-lg leading-[1.8] text-obsidian md:text-xl"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-obsidian/10 md:mt-16" />

        {/* Author attribution */}
        {editorsLetter.author?.name && (
          <div className="mt-8">
            <p className="text-sm font-semibold text-obsidian">
              — {editorsLetter.author.name}
            </p>
            {editorsLetter.author.role && (
              <p className="mt-1 text-xs text-obsidian/50">
                {editorsLetter.author.role}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// This Issue Tab (Table of Contents)
// ---------------------------------------------------------------------------

function ThisIssueView({
  issue,
  flagship,
  remaining,
  onOpenArticle,
}: {
  issue: Issue;
  flagship: Issue["articles"][number] | undefined;
  remaining: Issue["articles"];
  onOpenArticle: (article: Article, position: number) => void;
}) {
  const categoryLabel = (pillars?: { name: string }[]) => {
    return pillars?.[0]?.name?.toUpperCase() ?? "EXECUTIVE LEADERSHIP";
  };

  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:pt-14 md:pb-20">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <Image
            src="/logo.png"
            alt="Transformidable"
            width={800}
            height={200}
            className="h-5 w-auto brightness-0 md:h-6"
          />
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-obsidian/40 md:text-xs">
            {issue.issueNumber != null && <>Issue {String(issue.issueNumber).padStart(2, "0")}</>}
            {issue.issueNumber != null && issue.volume != null && <> · </>}
            {issue.volume != null && <>Volume {issue.volume}</>}
            {issue.season && (
              <>
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> · </span>
                {issue.season}
              </>
            )}
          </p>
        </div>

        {/* Gold rule */}
        <div className="mt-4 h-[2px] bg-oxblood" />

        {/* Headline */}
        <h2 className="mt-8 font-serif text-2xl font-bold italic leading-snug text-obsidian md:mt-10 md:text-[32px] md:leading-tight">
          {(issue.headline ?? "").split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h2>

        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.25em] text-obsidian/50 md:text-xs">
          {(issue.subheadline ?? "").toUpperCase()}
        </p>

        {/* In This Issue */}
        <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.25em] text-oxblood md:mt-14 md:text-xs">
          In This Issue
        </p>

        {/* Flagship article (full-width) */}
        {flagship && (
          <div className="mt-6 flex flex-col gap-4 md:mt-8 md:flex-row md:gap-8">
            {/* Large number */}
            <p
              className="hidden font-serif text-[72px] font-bold leading-none text-obsidian/15 md:block md:text-[96px]"
              aria-hidden="true"
            >
              {String(flagship.position).padStart(2, "0")}
            </p>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="rounded-sm border border-obsidian/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-obsidian/60 md:text-[10px]">
                  Flagship
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-obsidian/40 md:text-[10px]">
                  {categoryLabel(flagship.article.brandPillars)}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-obsidian md:text-2xl">
                <button
                  onClick={() => onOpenArticle(flagship.article, flagship.position)}
                  className="text-left transition-colors hover:text-oxblood"
                >
                  {flagship.article.title}
                </button>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-obsidian/60 md:text-base">
                {flagship.article.excerpt}
              </p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="mt-8 h-px bg-obsidian/10 md:mt-10" />

        {/* Remaining articles in responsive grid */}
        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-3 md:gap-6">
          {remaining.map((ia) => (
            <article key={ia.article.id}>
              <p
                className="font-serif text-[36px] font-bold leading-none text-obsidian/15 md:text-[48px]"
                aria-hidden="true"
              >
                {String(ia.position).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.2em] text-obsidian/40 md:text-[10px]">
                {categoryLabel(ia.article.brandPillars)}
              </p>
              <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-obsidian md:text-lg">
                <button
                  onClick={() => onOpenArticle(ia.article, ia.position)}
                  className="text-left transition-colors hover:text-oxblood"
                >
                  {ia.article.title}
                </button>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-obsidian/50 md:text-sm">
                {ia.article.excerpt}
              </p>
            </article>
          ))}
        </div>

        {/* Footer tagline */}
        <div className="mt-14 flex items-center justify-between border-t border-obsidian/10 pt-4 md:mt-20">
          <p className="text-[10px] font-medium tracking-[0.15em] text-obsidian/40 md:text-xs">
            A publication of <a href="https://phousecos.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-oxblood">Powerhouse Industries</a>
          </p>
          {issue.tagline && (
            <p className="font-serif text-xs italic text-gold md:text-sm">
              {issue.tagline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Article Read View — reads an article within the magazine context
// ---------------------------------------------------------------------------

function ArticleReadView({
  article,
  position,
  issue,
  allArticles,
  onOpenArticle,
  onBackToIssue,
}: {
  article: Article;
  position: number;
  issue: Issue;
  allArticles: Issue["articles"];
  onOpenArticle: (article: Article, position: number) => void;
  onBackToIssue: () => void;
}) {
  const date = new Date(article.publishDate);
  const dateStr = isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  // Find prev/next articles for navigation
  const sorted = [...allArticles].sort((a, b) => a.position - b.position);
  const currentIdx = sorted.findIndex((ia) => ia.article.id === article.id);
  const prev = currentIdx > 0 ? sorted[currentIdx - 1] : null;
  const next = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;

  return (
    <>
      {/* Article header */}
      <div className="bg-obsidian">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-10 md:pt-14 md:pb-16">
          {/* Position & category */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-bold text-parchment/20 md:text-3xl">
              {String(position).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap gap-2">
              {article.brandPillars?.map((bp) => (
                <span
                  key={bp.id}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-gold"
                >
                  {bp.name}
                </span>
              ))}
            </div>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-parchment md:text-5xl md:leading-[1.1]">
            {article.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-parchment/65 font-light">
            {article.excerpt}
          </p>

          <div className="mt-8 flex items-center gap-3">
            {article.author?.name && (
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                {article.author.name}
              </span>
            )}
            {dateStr && (
              <>
                <span className="text-gold/40">·</span>
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold/70">
                  {dateStr}
                </span>
              </>
            )}
            {article.readTime && (
              <>
                <span className="text-gold/40">·</span>
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold/70">
                  {article.readTime}
                </span>
              </>
            )}
          </div>

          {/* Issue context line */}
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-parchment/30 md:text-xs">
            {[
              issue.issueNumber != null ? `Issue ${String(issue.issueNumber).padStart(2, "0")}` : null,
              issue.volume != null ? `Volume ${issue.volume}` : null,
              issue.season || null,
            ].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {/* Article body */}
      <div className="bg-parchment">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          {article.body ? (
            <div
              className="prose prose-lg max-w-none font-light text-obsidian/80"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          ) : (
            <div className="prose prose-lg max-w-none font-light text-obsidian/80">
              <p className="text-xl leading-relaxed">{article.excerpt}</p>
              <p className="mt-8 text-base text-obsidian/40 italic">
                Full article content will be rendered from the CMS rich text
                field when connected to the Payload API.
              </p>
            </div>
          )}

          {/* Article navigation: prev / back to issue / next */}
          <div className="mt-16 border-t border-obsidian/10 pt-8">
            <div className="flex items-center justify-between">
              {prev ? (
                <button
                  onClick={() => {
                    onOpenArticle(prev.article, prev.position);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-left"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-obsidian/40 md:text-xs">
                    Previous
                  </span>
                  <p className="mt-1 font-serif text-sm font-semibold text-oxblood md:text-base">
                    {prev.article.title}
                  </p>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={onBackToIssue}
                className="rounded-sm border border-obsidian/20 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-obsidian/60 transition-colors hover:border-oxblood hover:text-oxblood md:text-xs"
              >
                This Issue
              </button>

              {next ? (
                <button
                  onClick={() => {
                    onOpenArticle(next.article, next.position);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-right"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-obsidian/40 md:text-xs">
                    Next
                  </span>
                  <p className="mt-1 font-serif text-sm font-semibold text-oxblood md:text-base">
                    {next.article.title}
                  </p>
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
