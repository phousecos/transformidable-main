import MagazineHomepage from "@/components/MagazineHomepage";
import Footer from "@/components/Footer";
import { getLatestIssue } from "@/lib/payload";

export default async function Home() {
  const issue = await getLatestIssue();

  if (!issue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <p className="font-serif text-lg text-obsidian/60">
          No issues published yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <MagazineHomepage issue={issue} />
      <Footer />
    </>
  );
}
