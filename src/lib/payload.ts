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
// Lexical richText → HTML conversion
// ---------------------------------------------------------------------------

// Payload CMS v3 uses Lexical editor, which returns richText as JSON.
// This lightweight converter handles the common node types so article body
// renders as HTML in the frontend.

interface LexicalNode {
  type?: string;
  tag?: string;
  text?: string;
  format?: number | string;
  children?: LexicalNode[];
  listType?: string;
  url?: string;
  target?: string;
  rel?: string;
  value?: { url?: string; alt?: string };
}

function lexicalToHtml(node: LexicalNode): string {
  if (!node) return "";

  // Text node
  if (node.type === "text" || (!node.type && typeof node.text === "string")) {
    let text = node.text ?? "";
    const fmt = typeof node.format === "number" ? node.format : 0;
    if (fmt & 1) text = `<strong>${text}</strong>`;
    if (fmt & 2) text = `<em>${text}</em>`;
    if (fmt & 4) text = `<s>${text}</s>`;
    if (fmt & 8) text = `<u>${text}</u>`;
    if (fmt & 16) text = `<code>${text}</code>`;
    return text;
  }

  const children = (node.children ?? []).map(lexicalToHtml).join("");

  switch (node.type) {
    case "root":
      return children;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading":
      return `<${node.tag ?? "h2"}>${children}</${node.tag ?? "h2"}>`;
    case "quote":
      return `<blockquote>${children}</blockquote>`;
    case "list":
      return node.listType === "number"
        ? `<ol>${children}</ol>`
        : `<ul>${children}</ul>`;
    case "listitem":
      return `<li>${children}</li>`;
    case "link":
    case "autolink":
      return `<a href="${node.url ?? "#"}"${node.target ? ` target="${node.target}"` : ""}${node.rel ? ` rel="${node.rel}"` : ""}>${children}</a>`;
    case "linebreak":
      return "<br />";
    case "upload":
      return node.value?.url
        ? `<figure><img src="${node.value.url}" alt="${node.value.alt ?? ""}" /></figure>`
        : "";
    default:
      return children;
  }
}

// Normalize a body field: if it's a Lexical JSON object, convert to HTML.
// If it's already a string (HTML or empty), return as-is.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBody(body: any): string {
  if (typeof body === "string") return body;
  if (body && typeof body === "object" && body.root) {
    return lexicalToHtml(body.root);
  }
  return "";
}

// Normalize an article's body field from CMS response.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeArticle(raw: any): Article {
  return { ...raw, body: normalizeBody(raw.body) };
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
      return data.docs.map(normalizeArticle);
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
      const doc = data.docs[0];
      return doc ? normalizeArticle(doc) : null;
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

// The CMS "newsletter-issues" collection has a different schema than the
// frontend Issue type. This helper maps the CMS response to our Issue shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCmsIssue(raw: any): Issue | null {
  if (!raw) return null;

  // Log the raw CMS response keys so we can debug field mapping in production
  console.log("[CMS] newsletter-issue raw keys:", Object.keys(raw));
  console.log("[CMS] newsletter-issue status:", raw.status);

  // CMS uses "featuredArticles" (relationship → Articles), our type uses "articles"
  const rawArticles = Array.isArray(raw.featuredArticles)
    ? raw.featuredArticles
    : [];

  // Normalize each article (converts Lexical body to HTML)
  const featuredArticles: Article[] = rawArticles.map(normalizeArticle);

  // Log article data so we can verify excerpts come through
  featuredArticles.forEach((a, i) => {
    console.log(`[CMS] article[${i}]: title="${a.title}", excerpt="${(a.excerpt ?? "").slice(0, 60)}..."`);
  });

  const articles: Issue["articles"] = featuredArticles.map((article, idx) => ({
    article,
    position: idx + 1,
    isFlagship: idx === 0, // first article is flagship
  }));

  // CMS uses "editorsNote" (richText), our type uses "editorsLetter"
  const editorsNote = raw.editorsNote;
  const editorsBody = normalizeBody(editorsNote);

  // Use fields from the CMS record if present, fall back to derived values
  const firstArticle = featuredArticles[0];
  const headline = raw.headline ?? firstArticle?.title ?? "";
  const subheadline =
    raw.subheadline ??
    (firstArticle
      ? `This issue — ${firstArticle.title}`
      : "");

  return {
    id: raw.id,
    volume: raw.volume ?? 1,
    issueNumber: raw.issueNumber ?? 1,
    slug: raw.slug ?? `vol-1-issue-${String(raw.issueNumber ?? 1).padStart(2, "0")}`,
    title: raw.title ?? headline,
    headline,
    subheadline,
    season: raw.season ?? "",
    publishDate: raw.issueDate ?? raw.publishDate ?? new Date().toISOString(),
    editorsLetter: {
      body: editorsBody,
      author: firstArticle?.author ?? { id: "", name: "", bio: "", headshot: null, role: "", type: "staff", socialLinks: [], isActive: true },
    },
    articles,
    status: raw.status === "sent" ? "published" : raw.status === "published" ? "published" : "draft",
    tagline: raw.tagline,
  };
}

export async function getLatestIssue(): Promise<Issue | null> {
  const mockFallback = async () => {
    const { issues } = await getMockData();
    const published = issues
      .filter((i) => i.status === "published")
      .sort(
        (a, b) =>
          new Date(b.publishDate).getTime() -
          new Date(a.publishDate).getTime(),
      );
    return published[0] ?? null;
  };

  // Middle-tier fallback: CMS is available but newsletter-issues endpoint
  // doesn't return usable data. Fetch articles directly from /articles and
  // compose an Issue using mock metadata + real CMS article data.
  const composedFromArticles = async (): Promise<Issue | null> => {
    if (!cmsAvailable()) return null;
    try {
      const data = await payloadFetch<Article>("/articles", {
        "where[status][equals]": "published",
        sort: "-publishDate",
        depth: "2",
        limit: "10",
      });
      if (!data.docs.length) return null;

      console.log("[CMS] composedFromArticles: got", data.docs.length, "articles from /articles");

      // Use mock issue metadata as shell, but fill with real CMS articles
      const mockIssue = await mockFallback();
      if (!mockIssue) return null;

      const normalizedDocs = data.docs.map(normalizeArticle);
      const articles: Issue["articles"] = normalizedDocs.map((article, idx) => ({
        article,
        position: idx + 1,
        isFlagship: idx === 0,
      }));

      return {
        ...mockIssue,
        articles,
      };
    } catch {
      return null;
    }
  };

  return withFallback(
    async () => {
      // The newsletter-issues status workflow is: draft → scheduled → sent.
      // "sent" means published/live. We also accept "published" in case the
      // CMS uses that label instead.
      let data = await payloadFetch<Record<string, unknown>>(
        "/newsletter-issues",
        {
          "where[status][equals]": "sent",
          sort: "-issueDate",
          depth: "2",
          limit: "1",
        },
      );

      // Some CMS configs may use "published" instead of "sent"
      if (!data.docs.length) {
        console.log("[CMS] No newsletter-issues with status 'sent', trying 'published'");
        data = await payloadFetch<Record<string, unknown>>(
          "/newsletter-issues",
          {
            "where[status][equals]": "published",
            sort: "-issueDate",
            depth: "2",
            limit: "1",
          },
        );
      }

      console.log("[CMS] newsletter-issues docs count:", data.docs.length);

      const raw = data.docs[0];
      const issue = mapCmsIssue(raw);
      if (!issue || !issue.articles.length) {
        console.log("[CMS] mapCmsIssue returned no usable issue, trying direct articles fetch");
        // Newsletter-issues didn't work — try composing from CMS articles
        const composed = await composedFromArticles();
        if (composed) return composed;
        return mockFallback();
      }
      return issue;
    },
    async () => {
      // CMS entirely unreachable — try composed, then full mock
      const composed = await composedFromArticles();
      if (composed) return composed;
      return mockFallback();
    },
  );
}

export async function getIssueBySlug(
  slug: string,
): Promise<Issue | null> {
  const mockFallback = async () => {
    const { issues } = await getMockData();
    return (
      issues.find((i) => i.slug === slug && i.status === "published") ??
      null
    );
  };

  return withFallback(
    async () => {
      const data = await payloadFetch<Record<string, unknown>>(
        "/newsletter-issues",
        {
          "where[slug][equals]": slug,
          "where[status][equals]": "sent",
          depth: "2",
          limit: "1",
        },
      );
      const issue = mapCmsIssue(data.docs[0]);
      if (!issue) {
        return mockFallback();
      }
      return issue;
    },
    mockFallback,
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
