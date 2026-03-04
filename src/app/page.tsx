import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArticleGrid from "@/components/ArticleGrid";
import PodcastSection from "@/components/PodcastSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import { getArticles, getPodcastEpisodes } from "@/lib/payload";

export default async function Home() {
  const [allArticles, episodes] = await Promise.all([
    getArticles({ limit: 5 }),
    getPodcastEpisodes({ limit: 1 }),
  ]);

  const featuredArticle = allArticles[0];
  const gridArticles = allArticles.slice(1, 5);
  const latestEpisode = episodes[0];

  return (
    <>
      <Navbar />
      <main>
        {featuredArticle && <Hero article={featuredArticle} />}
        <ArticleGrid articles={gridArticles} />
        {latestEpisode && <PodcastSection episode={latestEpisode} />}
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
