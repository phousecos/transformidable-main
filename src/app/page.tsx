import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArticleGrid from "@/components/ArticleGrid";
import PodcastSection from "@/components/PodcastSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import { articles, podcastEpisodes } from "@/lib/mock-data";

export default function Home() {
  // Featured article is the most recent
  const featuredArticle = articles[0];
  // Grid articles are the next 4
  const gridArticles = articles.slice(1, 5);
  // Latest podcast episode
  const latestEpisode = podcastEpisodes[0];

  return (
    <>
      <Navbar />
      <main>
        <Hero article={featuredArticle} />
        <ArticleGrid articles={gridArticles} />
        <PodcastSection episode={latestEpisode} />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
