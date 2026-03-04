import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PodcastList from "@/components/PodcastList";
import { getPodcastEpisodes } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Podcast — Transformidable",
  description:
    "Transformidable Conversations: interviews and insights for technology leaders driving enterprise transformation.",
};

export default async function PodcastPage() {
  const published = await getPodcastEpisodes();

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

          <PodcastList episodes={published} />
        </div>
      </main>
      <Footer />
    </>
  );
}
