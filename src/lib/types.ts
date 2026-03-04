// Shared TypeScript interfaces for the Transformidable content model.
// These mirror the Payload CMS collection schemas and are used by both
// the API client (src/lib/payload.ts) and presentation components.

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
  body: string;
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

// Payload CMS paginated response envelope
export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
