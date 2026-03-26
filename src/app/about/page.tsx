import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — Transformidable",
  description:
    "Transformidable Media is a publication of Powerhouse Industries, presenting the brands of The Holding Company, Unlimited Powerhouse, and Vetters Group, along with our partners at Velorum Software.",
};

const brandFamilies = [
  {
    parent: "The Holding Company",
    description:
      "The strategic parent that oversees Powerhouse Industries and its portfolio of technology leadership brands.",
    brands: [
      {
        name: "Transformidable Media",
        domain: "transformidable.media",
        focus: "C-suite strategy, transformational leadership philosophy, and the art of leading through change.",
      },
    ],
  },
  {
    parent: "Unlimited Powerhouse",
    description:
      "Fractional CIO leadership and enterprise technology strategy for organizations navigating transformation.",
    brands: [
      {
        name: "Unlimited Powerhouse",
        domain: "unlimitedpowerhouse.com",
        focus: "Fractional CIO leadership, enterprise IT strategy, and technology-driven transformation.",
      },
      {
        name: "Lumynr",
        domain: "lumynr.com",
        focus: "Career relaunch, DEI in IT, and building community for women in technology leadership.",
      },
    ],
  },
  {
    parent: "Vetters Group",
    description:
      "Background checks and screening services that improve HR processes and staffing decisions.",
    brands: [
      {
        name: "Vetters Group",
        domain: "vettersgroup.com",
        focus: "Background checks, HR process improvement, and staffing verification.",
      },
    ],
  },
];

const partnerBrands = [
  {
    partner: "Velorum Software",
    brands: [
      {
        name: "AgentPMO",
        domain: "agentpmo.com",
        focus: "AI-driven delivery, PMO transformation, and execution discipline.",
      },
      {
        name: "Prept",
        domain: "prept.com",
        focus: "AI-driven interview practice for interviews and work conversations.",
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main>
        {/* Hero */}
        <div className="bg-obsidian">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-20 md:pt-28 md:pb-20">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              About
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold italic leading-tight text-parchment md:text-5xl md:leading-[1.1]">
              Ideas worth leading with.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-parchment/65 font-light">
              <strong className="text-parchment font-semibold">
                Transformidable Media
              </strong>{" "}
              is a publication of{" "}
              <Link
                href="https://phousecos.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment font-semibold underline decoration-gold/40 underline-offset-2 transition-colors hover:text-gold"
              >
                Powerhouse Industries
              </Link>
              , bringing together the brands and perspectives of The Holding
              Company, Unlimited Powerhouse, and Vetters Group — along
              with those of our partners at Velorum Software, including AgentPMO
              and Prept.
            </p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-parchment/65 font-light">
              Together, these properties cover the full spectrum of technology
              leadership — from enterprise strategy and project execution to
              talent development, executive coaching, and community building for
              women in tech.
            </p>
          </div>
        </div>

        {/* Brand families */}
        <div className="bg-parchment">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <h2 className="font-serif text-2xl font-bold text-obsidian md:text-3xl">
              Our Brands
            </h2>

            <div className="mt-10 space-y-14">
              {brandFamilies.map((family) => (
                <section key={family.parent}>
                  <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-oxblood">
                    {family.parent}
                  </h3>
                  <p className="mt-2 text-base text-obsidian/60 font-light">
                    {family.description}
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {family.brands.map((brand) => (
                      <BrandCard key={brand.domain} brand={brand} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Partner brands */}
            <div className="mt-16 border-t border-obsidian/10 pt-14">
              <h2 className="font-serif text-2xl font-bold text-obsidian md:text-3xl">
                Partner Brands
              </h2>

              {partnerBrands.map((partner) => (
                <section key={partner.partner} className="mt-10">
                  <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-oxblood">
                    {partner.partner}
                  </h3>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {partner.brands.map((brand) => (
                      <BrandCard key={brand.domain} brand={brand} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 border-t border-obsidian/10 pt-14 text-center">
              <p className="text-base text-obsidian/60 font-light">
                Want to learn more or get in touch?
              </p>
              <Link
                href="#newsletter"
                className="mt-4 inline-block rounded-full border border-oxblood px-6 py-2.5 text-sm font-medium text-oxblood transition-colors hover:bg-oxblood hover:text-parchment"
              >
                Subscribe to our newsletter
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function BrandCard({
  brand,
}: {
  brand: { name: string; domain: string; focus: string };
}) {
  return (
    <div className="rounded-lg border border-obsidian/10 bg-parchment p-6">
      <h4 className="font-serif text-lg font-semibold text-obsidian">
        {brand.name}
      </h4>
      <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
        {brand.domain}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-obsidian/60 font-light">
        {brand.focus}
      </p>
    </div>
  );
}
