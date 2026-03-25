// Mock data used for local development and as a fallback when the Payload CMS
// is unreachable. Structured to match the Payload REST API response shapes.

export type {
  BrandPillar,
  Author,
  MediaItem,
  Article,
  PodcastEpisode,
  Issue,
} from "./types";

import type {
  BrandPillar,
  Author,
  Article,
  PodcastEpisode,
  Issue,
  Book,
  TransformidableFeature,
} from "./types";

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
      "AI-driven interview practice for interviews and work conversations.",
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

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

export const issues: Issue[] = [
  {
    id: "issue-1",
    volume: 1,
    issueNumber: 1,
    slug: "vol-1-issue-01",
    title: "Technology, Trust, and the Cost of Not Keeping Up",
    headline: "When technology outruns leadership,\nthe gap becomes the crisis.",
    subheadline:
      "This issue — Technology, Trust, and the Cost of Not Keeping Up",
    season: "Spring 2026",
    publishDate: "2026-03-01T09:00:00.000Z",
    editorsLetter: {
      body: `I have spent more than twenty-five years helping organizations navigate technology — and if there is one thing that has never changed, it is this: the technology is rarely the problem.

The problem is almost always the conversation that didn't happen before the decision got made. The CIO who wasn't in the room. The roadmap built in isolation. The AI deployment that nobody stress-tested against the humans on the other end of it.

That gap — between what technology can do and what leadership is prepared to steward — is the crisis of this moment.

That is what this issue is about. Not the technology itself, but the leadership responsibility that comes with it. The decisions being made right now, in boardrooms and strategy sessions across every industry, will define what kind of organizations we become.

I hope these pages make you think — and maybe make you a little uncomfortable.

That's the point.`,
      author: authors[0],
    },
    articles: [
      {
        article: {
          ...articles[0],
          title: "The CIO You Hired Can't Lead the Organization You're Becoming",
          slug: "cio-hired-cant-lead",
          excerpt:
            "The role was designed for a different era. The organization you are building requires something it was never meant to produce — and that is a leadership problem, not a technology one.",
          brandPillars: [brandPillars[0]],
        },
        position: 1,
        isFlagship: true,
      },
      {
        article: {
          ...articles[1],
          title: "Why Your IT Roadmap Is a Business Strategy Problem",
          slug: "it-roadmap-business-strategy",
          excerpt:
            "Three diagnostic questions every leadership team should be able to answer — and why most can't.",
          brandPillars: [brandPillars[0]],
        },
        position: 2,
        isFlagship: false,
      },
      {
        article: {
          ...articles[2],
          title:
            "Owning the Strategy Room: How Women in Tech Move from Execution to Vision",
          slug: "women-tech-execution-to-vision",
          excerpt:
            "What the research shows — and what the current climate means for women building toward leadership.",
          brandPillars: [brandPillars[3]],
        },
        position: 3,
        isFlagship: false,
      },
      {
        article: {
          ...articles[3],
          title:
            "The Conversation No One's Having About Technology and Trust",
          slug: "conversation-technology-trust",
          excerpt:
            "Thirty years of loyalty. One chatbot loop. Something important was lost.",
          brandPillars: [brandPillars[4]],
        },
        position: 4,
        isFlagship: false,
      },
    ],
    status: "published",
    tagline: "Lead boldly. Think differently.",
  },
];

// ---------------------------------------------------------------------------
// Reading Room — Books
// ---------------------------------------------------------------------------

export const books: Book[] = [
  {
    id: "book-1",
    title: "Eloquent Rage",
    author: "Dr. Brittney Cooper",
    coverImage: "/images/reading-room/eloquent-rage.jpg",
    editorialNote:
      "A bold feminist manifesto that reclaims Black women's anger as a political and personal force. This month's Illuminate selection challenges us to stop being good and start being free.",
    section: "book-club",
    illuminateBadge: true,
    isCurrentSelection: true,
    bookshopUrl: "https://bookshop.org/a/example/9781250112873",
    publishedDate: "2026-04-01T00:00:00.000Z",
    status: "published",
  },
  {
    id: "book-2",
    title: "Dare to Lead",
    author: "Brené Brown",
    coverImage: "/images/reading-room/dare-to-lead.jpg",
    editorialNote:
      "Brown dismantles the myth that leadership requires armor. A must-read for anyone building teams in high-stakes environments.",
    section: "career-leadership",
    illuminateBadge: false,
    isCurrentSelection: false,
    bookshopUrl: "https://bookshop.org/a/example/9780399592522",
    publishedDate: "2026-03-01T00:00:00.000Z",
    status: "published",
  },
  {
    id: "book-3",
    title: "Negotiating While Black",
    author: "Damali Peterman",
    coverImage: "/images/reading-room/negotiating-while-black.jpg",
    editorialNote:
      "A practical, culturally grounded guide to negotiation for Black professionals navigating corporate spaces.",
    section: "career-leadership",
    illuminateBadge: false,
    isCurrentSelection: false,
    bookshopUrl: "https://bookshop.org/a/example/9781523006328",
    publishedDate: "2026-03-01T00:00:00.000Z",
    status: "published",
  },
  {
    id: "book-4",
    title: "The First 90 Days",
    author: "Michael D. Watkins",
    coverImage: "/images/reading-room/first-90-days.jpg",
    editorialNote:
      "The definitive playbook for leaders in transition. Essential reading for anyone stepping into a new executive role.",
    section: "career-leadership",
    illuminateBadge: false,
    isCurrentSelection: false,
    bookshopUrl: "https://bookshop.org/a/example/9781422188613",
    publishedDate: "2026-03-01T00:00:00.000Z",
    status: "published",
  },
];

// ---------------------------------------------------------------------------
// Reading Room — Transformidable Feature
// ---------------------------------------------------------------------------

export const transformidableFeature: TransformidableFeature = {
  mode: "pre-order",
  tagline: "A new framework for leading change that sticks",
  ctaLabel: "Pre-Order →",
  ctaUrl: "https://payhip.com/b/example-transformidable",
  coverImage: "/images/reading-room/transformidable-cover.jpg",
  launchLabel: "Coming June 2026",
};
