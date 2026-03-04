"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Placeholder — will integrate with Beehiiv or similar when ready
    setSubmitted(true);
  }

  return (
    <section id="newsletter" className="bg-oxblood">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-parchment md:text-4xl">
            Executive insight, delivered bi-weekly
          </h2>
          <p className="mt-4 text-lg text-parchment/75 font-light">
            The ideas, strategies, and conversations shaping technology
            leadership — curated for executives who lead transformation.
          </p>

          {submitted ? (
            <p className="mt-8 text-lg font-medium text-gold">
              Thank you. Watch your inbox.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-l-md border-0 bg-parchment/10 px-5 py-3 text-parchment placeholder:text-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold sm:rounded-r-none rounded-md"
              />
              <button
                type="submit"
                className="rounded-r-md bg-obsidian px-8 py-3 text-sm font-medium uppercase tracking-wider text-parchment transition-colors hover:bg-obsidian/90 sm:rounded-l-none rounded-md"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-parchment/40">
            No spam. Unsubscribe anytime. We respect your time and your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}
