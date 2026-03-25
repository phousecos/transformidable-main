// Payload CMS REST API client for transformidable.media
//
// Fetches content from the Payload CMS instance at cms.transformidable.media.
// Falls back to local mock data when PAYLOAD_CMS_URL is not set or the CMS is
// unreachable — this keeps local development working without a running CMS.
//
// All public-facing fetches use ISR (next.revalidate) so content updates
// propagate without a full redeploy.

import type {
  Article,
  BrandPillar,
  Issue,
  PayloadResponse,
  PodcastEpisode,
} from "./types";

const CMS_URL = process.env.PAYLOAD_CMS_URL ?? "";
const REVALIDATE_SECONDS = 60; // ISR: re-fetch at most once per minute

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function payloadFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<PayloadResponse<T>> {
  const url = new URL(`/api${path}`, CMS_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Payload CMS error ${res.status}: ${path}`);
  }

  return res.json() as Promise<PayloadResponse<T>>;
}

function cmsAvailable(): boolean {
  return CMS_URL.length > 0;
}

// ---------------------------------------------------------------------------
// Mock-data fallback helpers
// ---------------------------------------------------------------------------

async function withFallback<T>(
  fetchFn: () => Promise<T>,
  fallbackFn: () => T | Promise<T>,
): Promise<T> {
  if (!cmsAvailable()) return fallbackFn();
  try {
    return await fetchFn();
  } catch (error) {
    console.warn("[payload] CMS unreachable, using mock data:", error);
    return fallbackFn();
  }
}

// Lazy-load mock data only when needed (keeps production bundles lean when CMS
// is connected).
async function getMockData() {
  const mock = await import("./mock-data");
  return mock;
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export async function getArticles(options?: {
  limit?: number;
  pillarSlug?: string;
}): Promise<Article[]> {
  return withFallback(
    async () => {
      const params: Record<string, string> = {
        "where[status][equals]": "published",
        sort: "-publishDate",
        depth: "2",
      };
      if (options?.limit) params.limit = String(options.limit);
      if (options?.pillarSlug) {
        params["where[brandPillars.slug][equals]"] = options.pillarSlug;
      }
      const data = await payloadFetch<Article>("/articles", params);
      return data.docs;
    },
    async () => {
      const { articles } = await getMockData();
      let result = articles.filter((a) => a.status === "published");
      if (options?.pillarSlug) {
        result = result.filter((a) =>
          a.brandPillars.some((bp) => bp.slug === options.pillarSlug),
        );
      }
      result.sort(
        (a, b) =>
          new Date(b.publishDate).getTime() -
          new Date(a.publishDate).getTime(),
      );
      if (options?.limit) result = result.slice(0, options.limit);
      return result;
    },
  );
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | null> {
  return withFallback(
    async () => {
      const data = await payloadFetch<Article>("/articles", {
        "where[slug][equals]": slug,
        "where[status][equals]": "published",
        depth: "2",
        limit: "1",
      });
      return data.docs[0] ?? null;
    },
    async () => {
      const { articles } = await getMockData();
      return (
        articles.find((a) => a.slug === slug && a.status === "published") ??
        null
      );
    },
  );
}

export async function getArticleSlugs(): Promise<string[]> {
  return withFallback(
    async () => {
      const data = await payloadFetch<Article>("/articles", {
        "where[status][equals]": "published",
        limit: "100",
        depth: "0",
      });
      return data.docs.map((a) => a.slug);
    },
    async () => {
      const { articles } = await getMockData();
      return articles
        .filter((a) => a.status === "published")
        .map((a) => a.slug);
    },
  );
}

// ---------------------------------------------------------------------------
// Podcast Episodes
// ---------------------------------------------------------------------------

export async function getPodcastEpisodes(options?: {
  limit?: number;
}): Promise<PodcastEpisode[]> {
  return withFallback(
    async () => {
      const params: Record<string, string> = {
        "where[status][equals]": "published",
        sort: "-publishDate",
        depth: "2",
      };
      if (options?.limit) params.limit = String(options.limit);
      const data = await payloadFetch<PodcastEpisode>(
        "/podcast-episodes",
        params,
      );
      return data.docs;
    },
    async () => {
      const { podcastEpisodes } = await getMockData();
      let result = podcastEpisodes.filter((ep) => ep.status === "published");
      result.sort(
        (a, b) =>
          new Date(b.publishDate).getTime() -
          new Date(a.publishDate).getTime(),
      );
      if (options?.limit) result = result.slice(0, options.limit);
      return result;
    },
  );
}

export async function getEpisodeBySlug(
  slug: string,
): Promise<PodcastEpisode | null> {
  return withFallback(
    async () => {
      const data = await payloadFetch<PodcastEpisode>("/podcast-episodes", {
        "where[slug][equals]": slug,
        "where[status][equals]": "published",
        depth: "2",
        limit: "1",
      });
      return data.docs[0] ?? null;
    },
    async () => {
      const { podcastEpisodes } = await getMockData();
      return (
        podcastEpisodes.find(
          (ep) => ep.slug === slug && ep.status === "published",
        ) ?? null
      );
    },
  );
}

export async function getEpisodeSlugs(): Promise<string[]> {
  return withFallback(
    async () => {
      const data = await payloadFetch<PodcastEpisode>("/podcast-episodes", {
        "where[status][equals]": "published",
        limit: "100",
        depth: "0",
      });
      return data.docs.map((ep) => ep.slug);
    },
    async () => {
      const { podcastEpisodes } = await getMockData();
      return podcastEpisodes
        .filter((ep) => ep.status === "published")
        .map((ep) => ep.slug);
    },
  );
}

// ---------------------------------------------------------------------------
// Brand Pillars
// ---------------------------------------------------------------------------

export async function getBrandPillars(): Promise<BrandPillar[]> {
  return withFallback(
    async () => {
      const data = await payloadFetch<BrandPillar>("/brand-pillars", {
        limit: "100",
        depth: "0",
      });
      return data.docs;
    },
    async () => {
      const { brandPillars } = await getMockData();
      return brandPillars;
    },
  );
}

export async function getBrandPillarBySlug(
  slug: string,
): Promise<BrandPillar | null> {
  return withFallback(
    async () => {
      const data = await payloadFetch<BrandPillar>("/brand-pillars", {
        "where[slug][equals]": slug,
        limit: "1",
        depth: "0",
      });
      return data.docs[0] ?? null;
    },
    async () => {
      const { brandPillars } = await getMockData();
      return brandPillars.find((bp) => bp.slug === slug) ?? null;
    },
  );
}

export async function getBrandPillarSlugs(): Promise<string[]> {
  return withFallback(
    async () => {
      const data = await payloadFetch<BrandPillar>("/brand-pillars", {
        limit: "100",
        depth: "0",
      });
      return data.docs.map((bp) => bp.slug);
    },
    async () => {
      const { brandPillars } = await getMockData();
      return brandPillars.map((bp) => bp.slug);
    },
  );
}

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

export async function getLatestIssue(): Promise<Issue | null> {
  return withFallback(
    async () => {
      const data = await payloadFetch<Issue>("/issues", {
        "where[status][equals]": "published",
        sort: "-publishDate",
        depth: "2",
        limit: "1",
      });
      return data.docs[0] ?? null;
    },
    async () => {
      const { issues } = await getMockData();
      const published = issues
        .filter((i) => i.status === "published")
        .sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime(),
        );
      return published[0] ?? null;
    },
  );
}

export async function getIssueBySlug(
  slug: string,
): Promise<Issue | null> {
  return withFallback(
    async () => {
      const data = await payloadFetch<Issue>("/issues", {
        "where[slug][equals]": slug,
        "where[status][equals]": "published",
        depth: "2",
        limit: "1",
      });
      return data.docs[0] ?? null;
    },
    async () => {
      const { issues } = await getMockData();
      return (
        issues.find((i) => i.slug === slug && i.status === "published") ??
        null
      );
    },
  );
}

// ---------------------------------------------------------------------------
// Search (used by the /api/search route handler)
// ---------------------------------------------------------------------------

export async function searchContent(query: string): Promise<{
  articles: Article[];
  episodes: PodcastEpisode[];
}> {
  const q = query.toLowerCase();

  if (cmsAvailable()) {
    try {
      // Payload supports 'like' operator for partial text matching.
      // Search title fields; the API route does additional client-side
      // filtering for excerpt/author/pillar matches.
      const [articleRes, episodeRes] = await Promise.all([
        payloadFetch<Article>("/articles", {
          "where[status][equals]": "published",
          depth: "2",
          limit: "50",
          sort: "-publishDate",
        }),
        payloadFetch<PodcastEpisode>("/podcast-episodes", {
          "where[status][equals]": "published",
          depth: "2",
          limit: "50",
          sort: "-publishDate",
        }),
      ]);

      return {
        articles: articleRes.docs.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.excerpt.toLowerCase().includes(q) ||
            a.author?.name.toLowerCase().includes(q) ||
            a.brandPillars?.some((bp) =>
              bp.name.toLowerCase().includes(q),
            ),
        ),
        episodes: episodeRes.docs.filter(
          (ep) =>
            ep.title.toLowerCase().includes(q) ||
            ep.description.toLowerCase().includes(q) ||
            ep.guest?.name.toLowerCase().includes(q),
        ),
      };
    } catch (error) {
      console.warn("[payload] Search fallback to mock data:", error);
    }
  }

  // Fallback: search mock data
  const { articles, podcastEpisodes } = await getMockData();

  return {
    articles: articles.filter(
      (a) =>
        a.status === "published" &&
        (a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author?.name.toLowerCase().includes(q) ||
          a.brandPillars?.some((bp) =>
            bp.name.toLowerCase().includes(q),
          )),
    ),
    episodes: podcastEpisodes.filter(
      (ep) =>
        ep.status === "published" &&
        (ep.title.toLowerCase().includes(q) ||
          ep.description.toLowerCase().includes(q) ||
          ep.guest?.name.toLowerCase().includes(q)),
    ),
  };
}
