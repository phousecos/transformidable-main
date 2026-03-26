"use client";

const links = [
  { label: "Now Reading", href: "#now-reading" },
  { label: "Career Lists", href: "#career-leadership" },
  { label: "PMO & Tech", href: "#pmo-technology" },
  { label: "Transformidable", href: "#transformidable" },
  { label: "Picks", href: "#staff-picks" },
];

export default function SubNav() {
  return (
    <nav className="sticky top-[56px] z-40 border-b border-parchment/10 bg-obsidian md:top-[60px]">
      <div className="mx-auto flex max-w-5xl gap-6 overflow-x-auto px-6 py-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 text-xs font-medium uppercase tracking-[0.15em] text-parchment/60 transition-colors hover:text-gold"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
