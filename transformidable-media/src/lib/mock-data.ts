// Mock data structured to match Payload CMS REST API response shapes.
// When switching to live data, replace these imports with fetch calls to
// https://cms.transformidable.media/api/<collection>

export interface BrandPillar {
  id: string;
  name: string;
  slug: string;
  mappedDomain: string;
  contentFocus: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  headshot: MediaItem | null;
  role: string;
  associatedBrand: BrandPillar | null;
  type: "staff" | "guestContributor" | "podcastGuest";
  socialLinks: { platform: string; url: string }[];
  isActive: boolean;
}

export interface MediaItem {
  id: string;
  alt: string;
  caption?: string;
  url: string;
  sizes: {
    thumbnail: { url: string; width: number; height: number };
    card: { url: string; width: number; height: number };
    hero: { url: string; width: number; height: number };
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  body: string; // Rich text — simplified to string for mock
  excerpt: string;
  author: Author;
  publishDate: string;
  featuredImage: MediaItem | null;
  brandPillars: BrandPillar[];
  syndicateTo: string[];
  status: "draft" | "review" | "scheduled" | "published";
  seoTitle?: string;
  seoDescription?: string;
  isMemberOnly: boolean;
  readTime?: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  slug: string;
  episodeNumber: number;
  season: number;
  description: string;
  audioUrl: string;
  transcript: string;
  showNotes: string;
  guest: Author | null;
  publishDate: string;
  featuredImage: MediaItem | null;
  brandPillars: BrandPillar[];
  syndicateTo: string[];
  status: "draft" | "review" | "scheduled" | "published";
}

// ---------------------------------------------------------------------------
// Brand Pillars
// ---------------------------------------------------------------------------

export const brandPillars: BrandPillar[] = [
  {
    id: "bp-1",
    name: "Technology Strategy",
    slug: "technology-strategy",
    mappedDomain: "unlimitedpowerhouse.com",
    contentFocus:
      "Fractional CIO leadership, enterprise IT strategy, and technology-driven transformation.",
  },
  {
    id: "bp-2",
    name: "Project Execution",
    slug: "project-execution",
    mappedDomain: "agentpmo.com",
    contentFocus:
      "AI-driven delivery, PMO transformation, and execution discipline.",
  },
  {
    id: "bp-3",
    name: "Talent Development",
    slug: "talent-development",
    mappedDomain: "prept.com",
    contentFocus:
      "Hiring strategy, career development, and interview best practices.",
  },
  {
    id: "bp-4",
    name: "Women in Tech Leadership",
    slug: "women-in-tech",
    mappedDomain: "lumynr.com",
    contentFocus:
      "Career relaunch, DEI in IT, and building community for women in technology.",
  },
  {
    id: "bp-5",
    name: "Executive Leadership",
    slug: "executive-leadership",
    mappedDomain: "transformidable.media",
    contentFocus:
      "C-suite strategy, transformational leadership philosophy, and the art of leading through change.",
  },
];

// ---------------------------------------------------------------------------
// Authors
// ---------------------------------------------------------------------------

export const authors: Author[] = [
  {
    id: "author-1",
    name: "Jerri Bland",
    bio: "Founder & CEO of Powerhouse Industries. Fractional CIO, speaker, and author of The Transformidable Leader. Jerri helps enterprises navigate technology-driven transformation with clarity and conviction.",
    headshot: null,
    role: "Founder & CEO, Powerhouse Industries",
    associatedBrand: brandPillars[4],
    type: "staff",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/jerribland" },
    ],
    isActive: true,
  },
  {
    id: "author-2",
    name: "Marcus Chen",
    bio: "VP of Engineering at a Fortune 500 technology company. Writes about the intersection of technical leadership and organizational strategy.",
    headshot: null,
    role: "VP of Engineering",
    associatedBrand: brandPillars[0],
    type: "guestContributor",
    socialLinks: [],
    isActive: true,
  },
  {
    id: "author-3",
    name: "Dr. Amara Osei",
    bio: "Organizational psychologist and executive coach specializing in leadership development for technology executives.",
    headshot: null,
    role: "Executive Coach & Author",
    associatedBrand: brandPillars[4],
    type: "podcastGuest",
    socialLinks: [],
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export const articles: Article[] = [
  {
    id: "art-1",
    title: "The CIO Who Leads Transformation Rather Than Managing It",
    slug: "cio-who-leads-transformation",
    body: "",
    excerpt:
      "The difference between a CIO who manages infrastructure and one who leads transformation is not a matter of skill — it is a matter of identity. The organizations that thrive in the next decade will be led by technology executives who see themselves as business leaders first.",
    author: authors[0],
    publishDate: "2026-02-28T09:00:00.000Z",
    featuredImage: null,
    brandPillars: [brandPillars[0], brandPillars[4]],
    syndicateTo: ["unlimitedpowerhouse", "jerribland"],
    status: "published",
    isMemberOnly: false,
    readTime: "7 min read",
  },
  {
    id: "art-2",
    title: "Why Formidable Execution Is the Missing Half of Every Vision",
    slug: "formidable-execution-missing-half",
    body: "",
    excerpt:
      "Vision without execution is philosophy. Execution without vision is busywork. The leaders who build lasting organizations understand that the discipline of delivery is what turns strategy into reality.",
    author: authors[0],
    publishDate: "2026-02-21T09:00:00.000Z",
    featuredImage: null,
    brandPillars: [brandPillars[1], brandPillars[4]],
    syndicateTo: ["agentpmo", "jerribland"],
    status: "published",
    isMemberOnly: false,
    readTime: "6 min read",
  },
  {
    id: "art-3",
    title: "Building the IT Team Your Strategy Actually Requires",
    slug: "building-it-team-strategy-requires",
    body: "",
    excerpt:
      "Most IT hiring is backward — teams are built around the technology stack rather than the strategic outcomes the organization needs. Here is how to reverse that equation and hire for impact.",
    author: authors[1],
    publishDate: "2026-02-14T09:00:00.000Z",
    featuredImage: null,
    brandPillars: [brandPillars[2]],
    syndicateTo: ["prept"],
    status: "published",
    isMemberOnly: false,
    readTime: "8 min read",
  },
  {
    id: "art-4",
    title: "What AI Actually Changes About Enterprise Project Management",
    slug: "ai-changes-enterprise-project-management",
    body: "",
    excerpt:
      "AI will not replace project managers. But it will make the gap between disciplined and undisciplined teams impossibly wide. The question is not whether to adopt AI tools — it is whether your PMO culture can absorb them.",
    author: authors[0],
    publishDate: "2026-02-07T09:00:00.000Z",
    featuredImage: null,
    brandPillars: [brandPillars[1]],
    syndicateTo: ["agentpmo"],
    status: "published",
    isMemberOnly: false,
    readTime: "9 min read",
  },
  {
    id: "art-5",
    title:
      "The Leadership Playbook Nobody Writes: Navigating Your First 90 Days as CIO",
    slug: "leadership-playbook-first-90-days-cio",
    body: "",
    excerpt:
      "Every CIO transition playbook tells you to listen, learn, and build relationships. None of them tell you what to do when the board expects results in thirty days and your team is skeptical you will last six months.",
    author: authors[0],
    publishDate: "2026-01-31T09:00:00.000Z",
    featuredImage: null,
    brandPillars: [brandPillars[0], brandPillars[4]],
    syndicateTo: ["unlimitedpowerhouse", "jerribland"],
    status: "published",
    isMemberOnly: false,
    readTime: "10 min read",
  },
];

// ---------------------------------------------------------------------------
// Podcast Episodes
// ---------------------------------------------------------------------------

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "ep-1",
    title: "Transformidable Conversations: Leading Technology at Scale",
    slug: "leading-technology-at-scale",
    episodeNumber: 1,
    season: 1,
    description:
      "A conversation about what it takes to lead enterprise technology transformation — the decisions, the failures, and the moments that define a leader. Dr. Amara Osei joins Jerri Bland to explore why the best technology leaders are not the ones with the deepest technical knowledge, but the ones with the clearest sense of purpose.",
    audioUrl: "",
    transcript: "",
    showNotes: "",
    guest: authors[2],
    publishDate: "2026-02-24T09:00:00.000Z",
    featuredImage: null,
    brandPillars: [brandPillars[4]],
    syndicateTo: ["jerribland", "unlimitedpowerhouse"],
    status: "published",
  },
];
