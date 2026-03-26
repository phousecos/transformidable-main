import type { TransformidableFeature } from "@/lib/types";

export default function TransformidableStrip({
  feature,
}: {
  feature: TransformidableFeature;
}) {
  return (
    <section id="transformidable" className="bg-oxblood">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
        <div>
          {feature.launchLabel && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {feature.launchLabel}
            </p>
          )}
          <h2 className="font-serif text-xl font-bold text-parchment md:text-2xl">
            Transformidable
          </h2>
          <p className="mt-1 text-sm text-parchment/80">
            Dr. Jerri Bland — {feature.tagline}
          </p>
        </div>

        <a
          href={feature.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block shrink-0 rounded border border-parchment px-6 py-3 text-xs font-semibold uppercase tracking-wider text-parchment transition-colors hover:bg-parchment hover:text-oxblood"
        >
          {feature.ctaLabel}
        </a>
      </div>
    </section>
  );
}
