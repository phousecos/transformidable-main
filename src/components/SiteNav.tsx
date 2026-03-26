"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Search from "./Search";

const navLinks = [
  { href: "/articles", label: "Archive" },
  { href: "/podcast", label: "Podcast" },
  { href: "/about", label: "About" },
  { href: "/reading-room", label: "The Reading Room" },
];

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-obsidian">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="block shrink-0">
          <Image
            src="/logo.png"
            alt="Transformidable"
            width={400}
            height={100}
            className="h-6 w-auto md:h-7"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.2em] text-parchment/70 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#newsletter"
            className="text-xs font-medium uppercase tracking-[0.2em] text-parchment/70 transition-colors hover:text-gold"
          >
            Subscribe
          </a>
        </div>

        {/* Desktop: search icon */}
        <div className="hidden items-center md:flex">
          <Search />
        </div>

        {/* Mobile: search icon + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <Search />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-parchment transition-transform ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-parchment transition-opacity ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-parchment transition-transform ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-parchment/10 px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-parchment/70"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#newsletter"
              className="text-xs font-medium uppercase tracking-[0.2em] text-parchment/70"
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
