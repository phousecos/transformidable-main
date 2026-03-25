"use client";

import { useState } from "react";
import Image from "next/image";
import type { Book } from "@/lib/types";
import IlluminateBadge from "./IlluminateBadge";

export default function BookCard({ book }: { book: Book }) {
  const [noteExpanded, setNoteExpanded] = useState(false);

  const buyUrl = book.bookshopUrl || book.payhipUrl;
  const buyLabel = book.payhipUrl && !book.bookshopUrl ? "Buy Now" : "Buy on Bookshop";

  return (
    <div className="flex flex-col">
      {/* Cover image */}
      <div className="relative mb-4 aspect-[2/3] w-full overflow-hidden bg-obsidian/20">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-end p-3">
            <span className="text-sm text-gold/80">{book.title}</span>
          </div>
        )}
      </div>

      {/* Badge */}
      {book.illuminateBadge && (
        <div className="mb-2">
          <IlluminateBadge />
        </div>
      )}

      {/* Title & author */}
      <h3 className="font-serif text-lg font-bold text-obsidian">{book.title}</h3>
      <p className="mt-0.5 text-sm text-obsidian/60">{book.author}</p>

      {/* Editorial note (truncated with expand) */}
      {book.editorialNote && (
        <div className="mt-2">
          <p
            className={`text-sm leading-relaxed text-obsidian/70 ${
              !noteExpanded ? "line-clamp-2" : ""
            }`}
          >
            {book.editorialNote}
          </p>
          <button
            onClick={() => setNoteExpanded(!noteExpanded)}
            className="mt-1 text-xs font-medium uppercase tracking-wider text-gold transition-colors hover:text-oxblood"
          >
            {noteExpanded ? "Show less" : "Read more"}
          </button>
        </div>
      )}

      {/* Buy links */}
      <div className="mt-4 flex flex-wrap gap-2">
        {buyUrl && (
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-gold bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold transition-colors hover:bg-gold hover:text-obsidian"
          >
            {buyLabel}
          </a>
        )}
        {book.amazonUrl && (
          <a
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-obsidian/30 bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-obsidian/60 transition-colors hover:border-obsidian hover:text-obsidian"
          >
            Amazon
          </a>
        )}
      </div>
    </div>
  );
}
