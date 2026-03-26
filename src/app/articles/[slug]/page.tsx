import { notFound } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
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

  const rawDate = new Date(article.publishDate);
  const date = isNaN(rawDate.getTime())
    ? ""
    : rawDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  return (
    <>
      <SiteNav />

      {/* Breadcrumb back to current issue */}
      <div className="sticky top-[56px] z-40 border-t border-parchment/10 bg-obsidian md:top-[60px]">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-2">
          <Link
            href="/"
            className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:text-parchment md:text-xs"
          >
            &larr; Current Issue
          </Link>
          <span className="text-parchment/20">|</span>
          <span className="truncate text-[10px] font-medium tracking-[0.1em] text-parchment/50 md:text-xs">
            {article.title}
          </span>
        </div>
      </div>

      <main>
        {/* Article header */}
        <div className="bg-obsidian">
          <div className="mx-auto max-w-3xl px-6 pb-12 pt-10 md:pt-14 md:pb-16">
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
              {date && (
                <>
                  <span className="text-gold/40">·</span>
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold/70">
                    {date}
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

            {/* Back to issue */}
            <div className="mt-16 border-t border-obsidian/10 pt-8">
              <Link
                href="/"
                className="text-sm font-medium text-oxblood transition-colors hover:text-oxblood/70"
              >
                &larr; Back to Current Issue
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
