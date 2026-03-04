import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PodcastSection from "@/components/PodcastSection";
import { getEpisodeBySlug, getEpisodeSlugs } from "@/lib/payload";

export async function generateStaticParams() {
  const slugs = await getEpisodeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = await getEpisodeBySlug(slug);
  if (!ep) return { title: "Not Found — Transformidable" };
  return {
    title: `${ep.title} — Transformidable Podcast`,
    description: ep.description,
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) notFound();

  const date = new Date(episode.publishDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Navbar />

      {/* Reuse the existing audio-player section */}
      <PodcastSection episode={episode} />

      {/* Show notes / transcript */}
      <main className="bg-parchment">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.15em]">
            <span className="text-oxblood">
              Season {episode.season} · Episode {episode.episodeNumber}
            </span>
            <span className="text-obsidian/20">·</span>
            <span className="text-obsidian/40">{date}</span>
            {episode.brandPillars.map((bp) => (
              <Link
                key={bp.id}
                href={`/brand/${bp.slug}`}
                className="text-obsidian/40 transition-colors hover:text-oxblood"
              >
                {bp.name}
              </Link>
            ))}
          </div>

          {/* Show notes */}
          <section className="mt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Show Notes
            </h2>
            {episode.showNotes ? (
              <div
                className="prose prose-lg mt-4 max-w-none font-light text-obsidian/80"
                dangerouslySetInnerHTML={{ __html: episode.showNotes }}
              />
            ) : (
              <p className="mt-4 text-base text-obsidian/40 italic">
                Show notes will appear here once published from the CMS.
              </p>
            )}
          </section>

          {/* Transcript */}
          <section className="mt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Transcript
            </h2>
            {episode.transcript ? (
              <div
                className="prose prose-lg mt-4 max-w-none font-light text-obsidian/80"
                dangerouslySetInnerHTML={{ __html: episode.transcript }}
              />
            ) : (
              <p className="mt-4 text-base text-obsidian/40 italic">
                Transcript will be available shortly after publication.
              </p>
            )}
          </section>

          {/* Back link */}
          <div className="mt-16 border-t border-obsidian/10 pt-8">
            <Link
              href="/podcast"
              className="text-sm font-medium text-oxblood transition-colors hover:text-oxblood/70"
            >
              &larr; All episodes
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
