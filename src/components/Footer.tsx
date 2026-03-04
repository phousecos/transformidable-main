import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-obsidian">
      {/* Gold rule */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gold/30" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo + Wordmark */}
          <Link href="/" className="flex items-center">
            <Image
              src="/primary.png"
              alt="Transformidable"
              width={200}
              height={40}
            />
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-8">
            <Link
              href="/articles"
              className="text-sm font-medium uppercase tracking-wider text-parchment/60 transition-colors hover:text-gold"
            >
              Articles
            </Link>
            <Link
              href="/podcast"
              className="text-sm font-medium uppercase tracking-wider text-parchment/60 transition-colors hover:text-gold"
            >
              Podcast
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium uppercase tracking-wider text-parchment/60 transition-colors hover:text-gold"
            >
              About
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-center md:text-left">
          <p className="text-xs text-gold/50">
            &copy; {year} Transformidable. A publication of Powerhouse
            Industries, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
