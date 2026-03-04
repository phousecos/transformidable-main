"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Search from "./Search";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-obsidian">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo + Wordmark */}
        <Link href="/" className="flex items-center">
          <Image
            src="/primary.png"
            alt="Transformidable"
            width={250}
            height={50}
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/articles"
            className="text-sm font-medium uppercase tracking-wider text-parchment/80 transition-colors hover:text-gold"
          >
            Articles
          </Link>
          <Link
            href="/podcast"
            className="text-sm font-medium uppercase tracking-wider text-parchment/80 transition-colors hover:text-gold"
          >
            Podcast
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium uppercase tracking-wider text-parchment/80 transition-colors hover:text-gold"
          >
            About
          </Link>
        </div>

        {/* Search + Newsletter CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <Search />
          <a
            href="#newsletter"
            className="rounded bg-oxblood px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-parchment transition-colors hover:bg-oxblood/90"
          >
            Subscribe
          </a>
          </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-parchment transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-parchment transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-parchment transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-parchment/10 px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            <Link
              href="/articles"
              className="text-sm font-medium uppercase tracking-wider text-parchment/80"
              onClick={() => setMobileOpen(false)}
            >
              Articles
            </Link>
            <Link
              href="/podcast"
              className="text-sm font-medium uppercase tracking-wider text-parchment/80"
              onClick={() => setMobileOpen(false)}
            >
              Podcast
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium uppercase tracking-wider text-parchment/80"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <a
              href="#newsletter"
              className="mt-2 rounded bg-oxblood px-5 py-2.5 text-center text-sm font-medium uppercase tracking-wider text-parchment"
              onClick={() => setMobileOpen(false)}
            >
              Subscribe
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
