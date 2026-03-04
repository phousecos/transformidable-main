"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { articles, podcastEpisodes, Article, PodcastEpisode } from "@/lib/mock-data";

type SearchResult =
  | { type: "article"; item: Article }
  | { type: "episode"; item: PodcastEpisode };

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    const q = value.toLowerCase();
    const matchedArticles: SearchResult[] = articles
      .filter(
        (a) =>
          a.status === "published" &&
          (a.title.toLowerCase().includes(q) ||
            a.excerpt.toLowerCase().includes(q) ||
            a.author.name.toLowerCase().includes(q) ||
            a.brandPillars.some((bp) => bp.name.toLowerCase().includes(q)))
      )
      .map((item) => ({ type: "article" as const, item }));

    const matchedEpisodes: SearchResult[] = podcastEpisodes
      .filter(
        (ep) =>
          ep.status === "published" &&
          (ep.title.toLowerCase().includes(q) ||
            ep.description.toLowerCase().includes(q) ||
            ep.guest?.name.toLowerCase().includes(q))
      )
      .map((item) => ({ type: "episode" as const, item }));

    setResults([...matchedArticles, ...matchedEpisodes]);
  }

  return (
    <>
      {/* Search trigger button in navbar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-parchment/60 transition-colors hover:text-gold"
        aria-label="Search"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="hidden text-xs text-parchment/30 lg:inline">⌘K</span>
      </button>

      {/* Search overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-obsidian/80 pt-[15vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-lg border border-parchment/10 bg-obsidian shadow-2xl">
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-parchment/10 px-5 py-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-gold"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search articles, episodes, authors..."
                className="flex-1 bg-transparent text-parchment placeholder:text-parchment/30 focus:outline-none"
              />
              <kbd className="rounded border border-parchment/20 px-2 py-0.5 text-[11px] text-parchment/30">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {query && results.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-parchment/40">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}

              {results.map((result) => (
                <Link
                  key={result.item.id}
                  href={
                    result.type === "article"
                      ? `/articles/${result.item.slug}`
                      : `/podcast/${result.item.slug}`
                  }
                  onClick={() => setOpen(false)}
                  className="flex flex-col gap-1 rounded-md px-4 py-3 transition-colors hover:bg-parchment/5"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                    {result.type === "article" ? "Article" : "Podcast Episode"}
                  </span>
                  <span className="font-serif text-sm font-semibold text-parchment">
                    {result.item.title}
                  </span>
                  <span className="text-xs text-parchment/50 line-clamp-1">
                    {result.type === "article"
                      ? (result.item as Article).excerpt
                      : (result.item as PodcastEpisode).description}
                  </span>
                </Link>
              ))}

              {!query && (
                <p className="px-4 py-8 text-center text-sm text-parchment/30">
                  Start typing to search&hellip;
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
