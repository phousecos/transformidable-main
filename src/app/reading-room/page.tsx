import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubNav from "@/components/reading-room/SubNav";
import HeroSection from "@/components/reading-room/HeroSection";
import TransformidableStrip from "@/components/reading-room/TransformidableStrip";
import BookGridSection from "@/components/reading-room/BookGridSection";
import { getBooks, getTransformidableFeature } from "@/lib/payload";

export const metadata: Metadata = {
  title: "The Reading Room — Transformidable",
  description:
    "A curated bookstore and literary hub for leaders in technology, career, and transformation. Browse Illuminate Book Club selections, career reading lists, and more.",
  openGraph: {
    title: "The Reading Room — Transformidable",
    description:
      "A curated bookstore and literary hub for leaders in technology, career, and transformation.",
    type: "website",
  },
};

export default async function ReadingRoomPage() {
  const [books, feature] = await Promise.all([
    getBooks(),
    getTransformidableFeature(),
  ]);

  const currentSelection = books.find((b) => b.isCurrentSelection);
  const pastSelections = books.filter(
    (b) => b.section === "book-club" && !b.isCurrentSelection,
  );
  const careerBooks = books.filter((b) => b.section === "career-leadership");
  const pmoBooks = books.filter((b) => b.section === "pmo-technology");
  const staffPicks = books.filter((b) => b.section === "staff-picks");

  return (
    <>
      <Navbar />
      <SubNav />

      <main>
        {/* Hero — Now Reading */}
        {currentSelection && <HeroSection book={currentSelection} />}

        {/* Transformidable strip — positioned after hero per layout direction */}
        <TransformidableStrip feature={feature} />

        {/* Past Selections — hidden if empty */}
        <BookGridSection
          id="past-selections"
          title="Past Selections"
          books={pastSelections}
        />

        {/* Career & Leadership */}
        <BookGridSection
          id="career-leadership"
          title="Career & Leadership"
          books={careerBooks}
        />

        {/* PMO & Technology — hidden if no books */}
        <BookGridSection
          id="pmo-technology"
          title="PMO & Technology"
          books={pmoBooks}
        />

        {/* Staff Picks */}
        <BookGridSection
          id="staff-picks"
          title="Staff Picks"
          books={staffPicks}
        />
      </main>

      <Footer />
    </>
  );
}
