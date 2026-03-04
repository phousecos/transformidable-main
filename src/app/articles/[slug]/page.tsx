import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticleBySlug, getArticleSlugs } from "@/lib/payload";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not Found — Transformidable" };
  return {
    title: `${article.title} — Transformidable`,
    description: article.seoDescription ?? article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const date = new Date(article.publishDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Article header */}
        <div className="bg-obsidian">
          <div className="mx-auto max-w-3xl px-6 pb-16 pt-20 md:pt-28 md:pb-20">
            <div className="flex flex-wrap gap-2">
              {article.brandPillars.map((bp) => (
                <Link
                  key={bp.id}
                  href={`/brand/${bp.slug}`}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:text-parchment"
                >
                  {bp.name}
                </Link>
              ))}
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-parchment md:text-5xl md:leading-[1.1]">
              {article.title}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-parchment/65 font-light">
              {article.excerpt}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                {article.author.name}
              </span>
              <span className="text-gold/40">·</span>
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold/70">
                {date}
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

            {/* Back to articles */}
            <div className="mt-16 border-t border-obsidian/10 pt-8">
              <Link
                href="/articles"
                className="text-sm font-medium text-oxblood transition-colors hover:text-oxblood/70"
              >
                &larr; All articles
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
