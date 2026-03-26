import type { Book } from "@/lib/types";
import BookCard from "./BookCard";

interface BookGridSectionProps {
  id: string;
  title: string;
  books: Book[];
}

export default function BookGridSection({ id, title, books }: BookGridSectionProps) {
  if (books.length === 0) return null;

  return (
    <section id={id} className="bg-parchment">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <h2 className="mb-2 font-serif text-2xl font-bold italic text-oxblood">{title}</h2>
        <div className="mb-8 h-px bg-obsidian/10" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
