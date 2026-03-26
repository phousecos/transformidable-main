import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";
import {
  getArticles,
  getBrandPillars,
  getBrandPillarBySlug,
  getBrandPillarSlugs,
} from "@/lib/payload";

export async function generateStaticParams() {
  const slugs = await getBrandPillarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = await getBrandPillarBySlug(slug);
  if (!pillar) return { title: "Not Found — Transformidable" };
  return {
    title: `${pillar.name} — Transformidable`,
    description: pillar.contentFocus,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [pillar, published, allPillars] = await Promise.all([
    getBrandPillarBySlug(slug),
    getArticles(),
    getBrandPillars(),
  ]);
  if (!pillar) notFound();

  return (
    <>
      <SiteNav />
      <main className="bg-parchment">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          {/* Brand header */}
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-oxblood">
            {pillar.mappedDomain}
          </span>
          <h1 className="mt-2 font-serif text-4xl font-bold text-obsidian md:text-5xl">
            {pillar.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-obsidian/60 font-light">
            {pillar.contentFocus}
          </p>

          <div className="mt-10">
            <ArticleList
              articles={published}
              brandPillars={allPillars}
              initialFilter={pillar.slug}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
