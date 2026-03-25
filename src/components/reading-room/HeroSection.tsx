import Image from "next/image";
import type { Book } from "@/lib/types";
import IlluminateBadge from "./IlluminateBadge";

function formatMonth(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function HeroSection({ book }: { book: Book }) {
  const buyUrl = book.bookshopUrl || book.payhipUrl;
  const buyLabel =
    book.payhipUrl && !book.bookshopUrl ? "Buy Now" : "Buy on Bookshop.org";

  return (
    <section id="now-reading" className="bg-obsidian">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Section label */}
        <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Now Reading — {formatMonth(book.publishedDate)}
        </p>

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          {/* Book cover */}
          <div className="relative aspect-[2/3] w-32 shrink-0 overflow-hidden md:w-44">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="176px"
                priority
              />
            ) : (
              <div className="flex h-full items-end bg-obsidian/40 p-3">
                <span className="text-sm text-gold/80">{book.title}</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            {book.illuminateBadge && (
              <div className="mb-4">
                <IlluminateBadge />
              </div>
            )}

            <h2 className="font-serif text-3xl font-bold text-parchment md:text-4xl">
              {book.title}
            </h2>
            <p className="mt-2 text-base text-parchment/70">{book.author}</p>

            {book.editorialNote && (
              <p className="mt-4 max-w-xl leading-relaxed text-parchment/80">
                {book.editorialNote}
              </p>
            )}

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              {buyUrl && (
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded border border-parchment bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-parchment transition-colors hover:bg-parchment hover:text-obsidian"
                >
                  {buyLabel}
                </a>
              )}
              {book.amazonUrl && (
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded border border-parchment/40 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-parchment/60 transition-colors hover:border-parchment hover:text-parchment"
                >
                  Amazon
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
