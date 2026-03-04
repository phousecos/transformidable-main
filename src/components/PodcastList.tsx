"use client";

import { useState } from "react";
import Link from "next/link";
import { PodcastEpisode } from "@/lib/mock-data";

interface MonthGroup {
  label: string;
  key: string;
  episodes: PodcastEpisode[];
}

/** Group episodes by "Month Year" in reverse-chronological order. */
function groupByMonth(episodes: PodcastEpisode[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  const map = new Map<string, PodcastEpisode[]>();

  for (const ep of episodes) {
    const d = new Date(ep.publishDate);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!map.has(key)) {
      map.set(key, []);
      groups.push({ label, key, episodes: map.get(key)! });
    }
    map.get(key)!.push(ep);
  }

  groups.sort((a, b) => b.key.localeCompare(a.key));
  for (const g of groups) {
    g.episodes.sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }
  return groups;
}

/** Extract unique years from the groups for the sidebar heading structure. */
function groupByYear(groups: MonthGroup[]) {
  const years: { year: string; months: MonthGroup[] }[] = [];
  const map = new Map<string, MonthGroup[]>();

  for (const g of groups) {
    const year = g.key.slice(0, 4);
    if (!map.has(year)) {
      map.set(year, []);
      years.push({ year, months: map.get(year)! });
    }
    map.get(year)!.push(g);
  }

  years.sort((a, b) => b.year.localeCompare(a.year));
  return years;
}

export default function PodcastList({
  episodes,
}: {
  episodes: PodcastEpisode[];
}) {
  const allGroups = groupByMonth(episodes);
  const yearGroups = groupByYear(allGroups);
  const [activeMonth, setActiveMonth] = useState<string>("all");

  const visibleGroups =
    activeMonth === "all"
      ? allGroups
      : allGroups.filter((g) => g.key === activeMonth);

  return (
    <div className="mt-10 flex flex-col gap-10 lg:flex-row">
      {/* Episodes — main column (3/4 width) */}
      <div className="min-w-0 lg:w-3/4">
        {visibleGroups.length === 0 && (
          <p className="mt-6 text-center text-obsidian/40">
            No episodes for this period.
          </p>
        )}

        {visibleGroups.map((group) => (
          <section key={group.key} className="mt-12 first:mt-0">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              {group.label}
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {group.episodes.map((ep) => (
                <EpisodeCard key={ep.id} episode={ep} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Month/year filter — right sidebar */}
      <aside className="shrink-0 lg:w-1/4 lg:pl-8 lg:border-l lg:border-obsidian/10">
        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-obsidian/40">
          Filter by date
        </h3>

        <button
          onClick={() => setActiveMonth("all")}
          className={`mt-4 block text-sm transition-colors ${
            activeMonth === "all"
              ? "font-medium text-oxblood"
              : "text-obsidian/50 hover:text-oxblood"
          }`}
        >
          All episodes
        </button>

        {yearGroups.map(({ year, months }) => (
          <div key={year} className="mt-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-obsidian">
              {year}
            </span>
            <ul className="mt-2 space-y-1.5">
              {months.map((m) => (
                <li key={m.key}>
                  <button
                    onClick={() =>
                      setActiveMonth(activeMonth === m.key ? "all" : m.key)
                    }
                    className={`text-sm transition-colors ${
                      activeMonth === m.key
                        ? "font-medium text-oxblood"
                        : "text-obsidian/50 hover:text-oxblood"
                    }`}
                  >
                    {m.label.split(" ")[0]}
                    <span className="ml-1.5 text-[11px] text-obsidian/30">
                      {m.episodes.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
    </div>
  );
}

function EpisodeCard({ episode }: { episode: PodcastEpisode }) {
  const date = new Date(episode.publishDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group border-b border-obsidian/10 pb-8">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-oxblood">
          Episode {episode.episodeNumber}
        </span>
        {episode.brandPillars.map((bp) => (
          <Link
            key={bp.id}
            href={`/brand/${bp.slug}`}
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-obsidian/40 transition-colors hover:text-oxblood"
          >
            {bp.name}
          </Link>
        ))}
      </div>

      <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug text-obsidian">
        <Link
          href={`/podcast/${episode.slug}`}
          className="transition-colors group-hover:text-oxblood"
        >
          {episode.title}
          <span className="block h-0.5 max-w-0 bg-oxblood transition-all duration-300 group-hover:max-w-full" />
        </Link>
      </h3>

      <p className="mt-3 text-base leading-relaxed text-obsidian/60 font-light">
        {episode.description}
      </p>

      <div className="mt-4 flex items-center gap-3">
        {episode.guest && (
          <>
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
              with {episode.guest.name}
            </span>
            <span className="text-obsidian/20">·</span>
          </>
        )}
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-obsidian/40">
          {date}
        </span>
      </div>
    </article>
  );
}
