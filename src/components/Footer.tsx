import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-obsidian">
      {/* Gold rule */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-gold/30" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Wordmark */}
          <Link href="/" className="block">
            <Image
              src="/primary.png"
              alt="Transformidable"
              width={180}
              height={32}
              className="h-6 w-auto"
            />
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link
              href="/articles"
              className="text-xs font-medium uppercase tracking-[0.15em] text-parchment/50 transition-colors hover:text-gold"
            >
              Archive
            </Link>
            <Link
              href="/about"
              className="text-xs font-medium uppercase tracking-[0.15em] text-parchment/50 transition-colors hover:text-gold"
            >
              About
            </Link>
            <a
              href="#newsletter"
              className="text-xs font-medium uppercase tracking-[0.15em] text-parchment/50 transition-colors hover:text-gold"
            >
              Subscribe
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center sm:text-left">
          <p className="text-xs text-gold/40">
            &copy; {year} Transformidable. A publication of Powerhouse
            Industries, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
