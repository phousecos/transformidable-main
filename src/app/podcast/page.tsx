import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { podcastEpisodes, PodcastEpisode } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Podcast — Transformidable",
  description:
    "Transformidable Conversations: interviews and insights for technology leaders driving enterprise transformation.",
};

/** Group episodes by "Month Year" in reverse-chronological order. */
function groupByMonth(episodes: PodcastEpisode[]) {
  const groups: { label: string; key: string; episodes: PodcastEpisode[] }[] =
    [];
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

  // Sort groups descending and episodes within each group descending
  groups.sort((a, b) => b.key.localeCompare(a.key));
  for (const g of groups) {
    g.episodes.sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }
  return groups;
}

export default function PodcastPage() {
  const published = podcastEpisodes.filter((ep) => ep.status === "published");
  const groups = groupByMonth(published);

  return (
    <>
      <Navbar />
      <main className="bg-parchment">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <h1 className="font-serif text-4xl font-bold text-obsidian md:text-5xl">
            Podcast
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-obsidian/60 font-light">
            Transformidable Conversations — interviews and insights for
            technology leaders driving enterprise transformation.
          </p>

          {groups.length === 0 && (
            <p className="mt-16 text-center text-obsidian/40">
              No episodes published yet.
            </p>
          )}

          {groups.map((group) => (
            <section key={group.key} className="mt-14 first:mt-10">
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
      </main>
      <Footer />
    </>
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
