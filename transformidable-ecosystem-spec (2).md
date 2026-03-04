# Transformidable Ecosystem — Technical Architecture Specification

**Version:** 1.0  
**Date:** February 2026  
**Owner:** Jerri Bland, Powerhouse Industries, Inc.

---

## Overview

This document defines the architecture for the Transformidable content ecosystem — a hub-and-spoke publishing platform serving executive leaders across technology, talent, and entrepreneurship. It covers the CMS architecture, domain structure, content model, and build sequence for implementation.

---

## Ecosystem Purpose

**Transformidable** is the flagship publication of Powerhouse Industries, targeting C-suite and executive leaders (CEO, COO, CIO) who are responsible for guiding enterprises through technology-driven change. The publication creates content once and distributes it across the brand ecosystem, with each property surfacing content relevant to its specific audience.

---

## Domain & Brand Structure

| Domain | Purpose | Type |
|---|---|---|
| transformidable.media | Primary publication — articles and podcast | Hub |
| cms.transformidable.media | Payload CMS admin dashboard | Content hub |
| assets.transformidable.media | Media storage — images, audio, uploads | Storage |
| theTransformidableLeader.com | Book, speaking, and coaching (Jerri Bland) | Author platform |
| jerribland.com | Personal brand — surfaces authored content | Author hub |
| unlimitedpowerhouse.com | Fractional CIO services | Content consumer |
| lumynr.com | Women in IT career community | Semi-independent |
| vettersgroup.com | Background screening | Sponsor/advertiser only |
| agentpmo.com | AI project management platform | Content consumer |
| prept.com | AI interview preparation platform | Content consumer |

---

## Infrastructure Architecture

### Layer 1 — Content Hub (Payload CMS)

**What it is:** A single Payload CMS instance serving as the central content repository for the entire ecosystem. Built on Payload v3, which runs natively as a Next.js application and deploys directly to Vercel.

**Hosting:** Vercel (Pro tier — existing account)  
**Database:** Supabase PostgreSQL (existing account — connection string only, no additional Supabase features required)  
**Admin URL:** cms.transformidable.media  
**Access:** Role-based — contributors only see content for their assigned brand

### Layer 2 — Publication (transformidable.media)

**What it is:** The primary consumer of Payload content. All original content is published here first.

**Stack:** Next.js on Vercel  
**Content source:** Payload CMS API  
**Formats:** Written articles + Podcast episodes

### Layer 3 — Brand Properties

Each brand property is a Next.js site on Vercel that queries Payload for content tagged to its brand pillar. No content is stored on the brand sites — they are display layers only.

**Properties:** jerribland.com, unlimitedpowerhouse.com, agentpmo.com, prept.com  
**Exception:** Lumynr — has its own member-exclusive content layer in addition to syndicated content

---

## Payload CMS — Content Collections

### 1. Articles

| Field | Type | Notes |
|---|---|---|
| title | Text | Required |
| slug | Slug | Auto-generated from title |
| body | Rich Text | Full article content |
| excerpt | Textarea | 2–3 sentence summary for cards |
| author | Relationship | Links to Authors collection |
| publishDate | Date | |
| featuredImage | Upload | |
| brandPillars | Multi-select | See Brand Pillars below |
| syndicateTo | Multi-select | Which properties may republish |
| status | Select | Draft, Review, Scheduled, Published |
| seoTitle | Text | Optional override |
| seoDescription | Textarea | Optional override |
| isMemberOnly | Checkbox | Lumynr exclusive content flag |

### 2. Podcast Episodes

| Field | Type | Notes |
|---|---|---|
| title | Text | Required |
| episodeNumber | Number | |
| season | Number | |
| description | Textarea | Show notes summary |
| audioUrl | Text | Embed URL or hosted file path |
| transcript | Rich Text | Full episode transcript |
| showNotes | Rich Text | Links, references, resources |
| guest | Relationship | Links to Contributors collection |
| publishDate | Date | |
| featuredImage | Upload | Episode artwork |
| brandPillars | Multi-select | |
| syndicateTo | Multi-select | |
| status | Select | Draft, Review, Scheduled, Published |

### 3. Authors & Contributors

| Field | Type | Notes |
|---|---|---|
| name | Text | Required |
| bio | Textarea | |
| headshot | Upload | |
| role | Text | e.g., "Founder & CEO, Powerhouse Industries" |
| associatedBrand | Select | Which brand they represent |
| type | Select | Staff, Guest Contributor, Podcast Guest |
| socialLinks | Array | LinkedIn, Twitter, website |
| isActive | Checkbox | |

### 4. Brand Pillars

These are the editorial categories that map to the ecosystem brands. Every article and episode is tagged to one or more pillars, which determines where it surfaces.

| Pillar | Maps To | Content Focus |
|---|---|---|
| Technology Strategy | UnlimITed Powerhouse | Fractional CIO, enterprise IT leadership |
| Project Execution | AgentPMO | AI-driven delivery, PMO transformation |
| Talent Development | Prept | Hiring, career strategy, interview best practices |
| Women in Tech Leadership | Lumynr | Career relaunch, DEI in IT, community |
| Executive Leadership | Transformidable core | C-suite strategy, transformidable leadership philosophy |

### 5. Sponsors

| Field | Type | Notes |
|---|---|---|
| brandName | Text | e.g., Vetters Group |
| logo | Upload | |
| adCreative | Array | Multiple assets per placement type |
| placementType | Multi-select | Podcast mid-roll, Article sidebar, Newsletter |
| campaignStartDate | Date | |
| campaignEndDate | Date | |
| linkUrl | Text | Click destination |
| isActive | Checkbox | |

### 6. Newsletter Issues

| Field | Type | Notes |
|---|---|---|
| issueNumber | Number | |
| issueDate | Date | |
| editorsNote | Rich Text | Brief intro from Jerri |
| featuredArticles | Relationship | Links to Articles (2–3 per issue) |
| featuredEpisode | Relationship | Links to Podcast Episodes |
| status | Select | Draft, Scheduled, Sent |

---

## Content Flow

```
Jerri (or contributor) writes in Payload CMS
        ↓
Article tagged with Brand Pillars + Syndication targets
        ↓
Published to transformidable.media (primary source)
        ↓
Brand properties query Payload API by pillar tag:
  - unlimitedpowerhouse.com → Technology Strategy articles
  - agentpmo.com → Project Execution articles
  - prept.com → Talent Development articles
  - jerribland.com → All articles where author = Jerri Bland
  - lumynr.com → Women in Tech Leadership (+ member-only content)
        ↓
Vetters Group ad unit appears alongside talent/hiring content
```

---

## Access Control (Payload Roles)

| Role | Permissions |
|---|---|
| Admin (Jerri) | Full access to all collections, all brands |
| Editor | Create/edit/publish articles and episodes, all brands |
| Brand Contributor | Create/edit articles for assigned brand pillar only, cannot publish |
| Sponsor Manager | Read/write Sponsors collection only |

---

## Bi-Weekly Publishing Cadence

| Week | Output |
|---|---|
| Week A | 1 feature article (1,000–1,500 words) + Newsletter issue |
| Week B | 1 podcast episode + show notes article |

This produces roughly 2 content pieces per week, feeding all brand properties and the newsletter simultaneously.

---

## Build Sequence

The recommended implementation order for Claude Code:

### Phase 1 — Foundation
1. Payload CMS v3 instance deployed to Vercel as a Next.js application
2. Provision Vercel Postgres (or Neon) as the database
3. Configure all collections (Articles, Podcast, Authors, Brand Pillars, Sponsors, Newsletter)
4. Set up access control roles
5. Point cms.transformidable.media to the Payload Vercel deployment
6. Configure media/upload storage under assets.transformidable.media

### Phase 2 — Primary Publication
5. transformidable.media — Next.js site on Vercel
6. Article listing and detail pages
7. Podcast listing and episode pages
8. Newsletter archive page
9. Author profile pages
10. Brand pillar / category pages

### Phase 3 — Author Hub (jerribland.com)
jerribland.com does not have its own blog. Instead:
- A curated "Recent Writing" section displays 2–3 latest articles from transformidable.media where author = Jerri Bland, rendered as article cards with a "Read on Transformidable" link
- Navigation includes a direct link to transformidable.media
- No Payload API integration required beyond the article card widget

### Phase 4 — Brand Properties
Individual brand properties (unlimitedpowerhouse.com, agentpmo.com, prept.com) do not have separate blogs. Instead each property:
- Displays a curated "Insights" or "From Transformidable" section on their homepage showing 2–3 recent article cards filtered by their relevant brand pillar tag
- Navigation includes a clearly labeled link pointing directly to the filtered pillar page on transformidable.media (e.g. unlimitedpowerhouse.com links to transformidable.media/pillar/technology-strategy)
- Article cards are lightweight — headline, excerpt, category tag, and a "Read on Transformidable" link. No full blog infrastructure needed.
- This approach consolidates SEO authority on transformidable.media rather than splitting it across multiple domains

### Phase 5 — Community Exception
17. lumynr.com — integrate public Women in Tech Leadership content feed
18. Add member-exclusive content layer (separate from public Payload collections)

### Phase 6 — Commercial Layer
19. Vetters Group sponsor/ad unit system
20. Sponsor placement rendering across article and podcast pages
21. Campaign management in Payload admin

---

## Front End Design Direction

### Visual Language
The transformidable.media publication front end should feel like HBR's structure and discipline with more warmth and personality. Key principles:

- **Restraint over decoration** — let typography and white space do the heavy lifting
- **Generous white space** — premium editorial feel, nothing crowded
- **Conceptual photography** — not literal stock photos, but images that provoke thought
- **Warm palette** — terracotta, burnt orange, or deep amber as the primary brand color against near-black and warm cream/white. Distinct from the sea of blue/gray executive brands.
- **Typography-driven** — headlines carry authority, body text is highly readable

### Confirmed Brand Palette — Option C (Editorial Bold)

| Role | Name | Hex |
|---|---|---|
| Primary | Oxblood Burgundy | #6B1428 |
| Neutral Dark | Obsidian Navy | #0F1923 |
| Accent | Warm Sand Gold | #D4AF7A |
| Background | Parchment Cream | #F7F2E8 |

**Usage principles:**
- Oxblood is the brand signature — headlines, the T mark, primary CTAs, category tags
- Obsidian is the dominant dark — hero sections, navigation, podcast player background
- Gold is used sparingly as an accent only — bylines, rules, pull quote highlights, hover states
- Parchment is the article and page background — never pure white
- This palette applies across the full Transformidable brand system including the publication, book, speaking materials, and podcast artwork

### Confirmed Typography — Option D

| Role | Font | Weight | Notes |
|---|---|---|---|
| Headlines & Wordmark | Source Serif 4 | 600–700 | Optical sizing enabled — scales beautifully from hero to article titles |
| Body Text | DM Sans | 300–400 | Warm, readable at all sizes |
| Navigation & UI | DM Sans | 400–500 | Clean and precise |
| Metadata & Labels | DM Sans | 300, uppercase, tracked | Bylines, categories, read time |

Both fonts are available via Google Fonts at no cost and have excellent Next.js/Vercel performance via the `next/font` package, which eliminates layout shift on load.

### Podcast Player
The podcast must be a first-class experience directly on the site — not gated behind subscriptions or redirected to third-party platforms. This is a deliberate competitive advantage over publications like HBR that create friction by requiring external services to listen.

- Every podcast episode page renders a full inline audio player
- Episodes are also distributed to Spotify, Apple Podcasts, and other major platforms for discovery convenience
- But transformidable.media is the primary listening destination, keeping audiences inside the ecosystem
- The player should be clean and minimal — matching the editorial aesthetic, not a clunky embedded widget

---

## Brand Origin Story — About Page Content

This narrative should be woven into the About page of transformidable.media. It is authentic, memorable, and aligned with the publication's values.

### The T Mark Story

The Transformidable logomark — a bold geometric T composed of a square and sweeping arch — was created by designer Dalibor Pajic as part of the "36 Days of Type" challenge, a global design exercise where designers create a letter or number each day as a creative exploration.

When the mark was discovered and its potential for Transformidable recognized, Dalibor offered it under a unique arrangement: rather than a standard licensing fee, he asked for a $500 donation to a charity of the founder's choice. The donation was directed to an organization supporting women in technology — a cause directly aligned with Lumynr, one of the brands in the Transformidable ecosystem.

This origin story embodies what Transformidable stands for — transformation that creates value beyond the transaction, leadership that gives back, and the belief that the most powerful business decisions are also the most human ones.

### Why This Belongs on the About Page

- It humanizes the brand immediately and authentically
- It signals the values of the ecosystem without stating them directly
- It creates a memorable, shareable brand detail that distinguishes Transformidable from every other executive publication
- It connects the publication's identity to the broader mission of developing women in tech

---



---

## Ecosystem Interaction Model

This section defines exactly how each brand property relates to and interacts with transformidable.media. No brand property hosts its own blog. Transformidable is the single content destination for the entire ecosystem.

### How Each Property Interacts with Transformidable

| Property | Relationship | How They Interact |
|---|---|---|
| jerribland.com | Author hub | Displays 2–3 latest articles by Jerri Bland via article cards. Links to transformidable.media for full reading. Links to theTransformidableLeader.com for book/speaking. |
| unlimitedpowerhouse.com | Content consumer | Displays 2–3 latest Technology Strategy articles via article cards. Navigation links to transformidable.media/pillar/technology-strategy. |
| agentpmo.com | Content consumer | Displays 2–3 latest Project Execution articles via article cards. Navigation links to transformidable.media/pillar/project-execution. |
| prept.com | Content consumer | Displays 2–3 latest Talent Development articles via article cards. Navigation links to transformidable.media/pillar/talent-development. |
| lumynr.com | Semi-independent | Displays Women in Tech Leadership articles from Transformidable. Also has its own member-exclusive content hosted separately in Supabase. Has deeper integration than other properties. |
| vettersgroup.com | Sponsor only | Does not consume or display Transformidable content. Vetters Group appears as a sponsor/advertiser within Transformidable — podcast mid-rolls, article sidebar placements, newsletter ad units. |
| theTransformidableLeader.com | Book & speaking platform | Standalone site for the Transformidable book and speaking engagements. Links to transformidable.media as the ongoing publication expression of the same philosophy. |

### The Article Card Widget
Every brand property uses a shared article card component to display content from transformidable.media. The card is lightweight and consistent:

- Category tag in the brand's accent color (or oxblood if using Transformidable colors)
- Headline in Source Serif 4
- One-line excerpt in DM Sans Light
- Author name + read time in small DM Sans uppercase
- "Read on Transformidable →" link

This widget fetches the latest 2–3 articles filtered by brand pillar from the Payload REST API. It is a read-only display component — no content is stored on the brand property.

### Filtered Pillar Pages on transformidable.media
Each brand pillar has a dedicated filtered page on transformidable.media that aggregates all content tagged to that pillar. These pages serve as the "blog" for each brand — hosted on Transformidable, linked to from the individual properties.

| URL | Pillar | Linked From |
|---|---|---|
| transformidable.media/pillar/technology-strategy | Technology Strategy | unlimitedpowerhouse.com |
| transformidable.media/pillar/project-execution | Project Execution | agentpmo.com |
| transformidable.media/pillar/talent-development | Talent Development | prept.com |
| transformidable.media/pillar/women-in-tech | Women in Tech Leadership | lumynr.com |
| transformidable.media/pillar/executive-leadership | Executive Leadership | jerribland.com, theTransformidableLeader.com |

### SEO Benefits of This Approach
- All content authority builds on transformidable.media rather than being diluted across six domains
- Each brand property benefits from the association with a credible publication without needing to generate independent content
- Backlinks and shares all point to transformidable.media, compounding domain authority over time
- Individual properties rank for their service keywords; transformidable.media ranks for thought leadership keywords

---



### Overview
Build the transformidable.media homepage as a Next.js application using static mock data. Design must be fully approved before connecting to the Payload CMS API. The homepage is the complete visual statement of the brand — every design decision made here cascades to all other pages.

### Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Fonts:** next/font with Google Fonts — Source Serif 4 (headlines) + DM Sans (body/UI)
- **Data:** Static mock data in a `/lib/mock-data.ts` file — structured to match the Payload CMS API response shape so swapping to live data later requires minimal changes
- **Deployment:** Vercel

### Brand Tokens (add to Tailwind config)
```
oxblood:    #6B1428
obsidian:   #0F1923
gold:       #D4AF7A
parchment:  #F7F2E8
```

### Homepage Sections (in order, top to bottom)

**1. Navigation Bar**
- Background: obsidian (#0F1923)
- Left: T logomark (SVG placeholder until Dalibor delivers files) + "Transformidable" wordmark in Source Serif 4
- Center: navigation links in DM Sans uppercase — Articles, Podcast, About
- Right: Newsletter signup CTA button in oxblood
- Sticky on scroll

**2. Hero Section**
- Background: obsidian
- Featured article — large format
- Gold category tag (e.g. "Technology Strategy")
- Headline in Source Serif 4, large (48–56px), parchment colored
- Excerpt in DM Sans Light, parchment at 65% opacity
- Author name + read time in gold DM Sans uppercase
- Thin gold rule separating hero from article grid below

**3. Article Grid**
- Background: parchment (#F7F2E8)
- 2-column grid, 4 articles
- Each card: oxblood category tag, headline in Source Serif 4, author + read time in gold DM Sans, brief excerpt in DM Sans Light
- Hover state: subtle oxblood underline on headline

**4. Podcast Section**
- Background: obsidian
- Section label in gold uppercase DM Sans: "Latest Episode"
- Episode title in Source Serif 4, parchment
- Episode description in DM Sans Light, parchment at 65% opacity
- Inline audio player — clean, minimal, styled in oxblood and gold
- Guest name if applicable
- Link to full show notes

**5. Newsletter Signup**
- Background: oxblood (#6B1428)
- Headline in Source Serif 4, parchment: "Executive insight, delivered bi-weekly"
- One-line description in DM Sans Light, parchment at 75% opacity
- Email input field + Subscribe button in obsidian
- No-spam reassurance in small DM Sans below

**6. Footer**
- Background: obsidian
- Logo + wordmark left
- Navigation links center
- Gold thin rule across top
- Copyright + Powerhouse Industries attribution in small DM Sans, gold at 50% opacity

### Mock Data Structure
Create realistic mock data that reflects actual Transformidable content — use the real brand pillar names, realistic article titles in the Transformidable voice, and one mock podcast episode. This is not placeholder Lorem Ipsum — the mock content should feel like the real publication from day one.

**Sample article titles to use:**
- "The CIO Who Leads Transformation Rather Than Managing It"
- "Why Formidable Execution Is the Missing Half of Every Vision"
- "Building the IT Team Your Strategy Actually Requires"
- "What AI Actually Changes About Enterprise Project Management"

**Sample podcast episode:**
- Title: "Transformidable Conversations: Leading Technology at Scale"
- Guest: placeholder
- Description: "A conversation about what it takes to lead enterprise technology transformation — the decisions, the failures, and the moments that define a leader."

### Design Principles to Follow
- Generous white space — nothing crowded
- Gold used sparingly — accent only, never as a fill color for large areas
- Parchment background for all light sections — never pure white (#FFFFFF)
- Source Serif 4 headlines should feel bold and editorial, not decorative
- Every section transition should feel intentional — alternating obsidian and parchment creates natural rhythm

### After Approval
Once the homepage design is approved visually, the next step is replacing the mock data with live Payload CMS API calls. The mock data file should be structured to exactly mirror the Payload REST API response shape to make this swap seamless.

---



### Platform
Newsletter delivery will be handled by a dedicated platform separate from Payload CMS. Payload stores newsletter content and issue structure; the external platform manages subscriber relationships, deliverability, compliance, and analytics. **Beehiiv** is the recommended platform — purpose-built for publications, with subscriber management, growth tools, and monetization built in. Decision to be finalized before first issue.

### Format & Template Direction
The newsletter should feel as premium in an inbox as transformidable.media does on the web. The same palette (oxblood, obsidian, gold, parchment) and typography (Source Serif 4 + DM Sans) apply. The typography comparison file already created serves as the design brief for the email template.

**Bi-weekly newsletter structure:**

| Section | Content | Notes |
|---|---|---|
| Editor's Note | Short personal message from Jerri | 3–5 sentences, direct and human |
| Featured Article | Headline, excerpt, read more link | Hero placement, oxblood category tag |
| Featured Episode | Podcast episode title, description, listen link | Links to episode page on transformidable.media |
| Secondary Articles | 2–3 article links with one-line descriptions | Compact, scannable |
| Sponsor Placement | Vetters Group ad unit | Natural placement within content flow |
| Closing Thought | Quote or brief reflection | Reinforces the Transformidable philosophy |

**Design principles for email:**
- Readable in under three minutes — executive audience is time-poor
- High contrast, clear hierarchy — legible on mobile without zooming
- Every article and episode link drives back to transformidable.media, not third-party platforms
- Sponsor placement clearly delineated but visually integrated, not jarring
- Unsubscribe and CAN-SPAM compliance handled by the newsletter platform

### Content Source
Newsletter issues are created and structured in Payload CMS using the Newsletter Issues collection, which references existing Articles and Podcast Episodes already published on transformidable.media. The editor's note and closing thought are the only unique content written specifically for each issue.

---

## Key Technical Notes for Claude Code
- Payload CMS v3 is a Next.js application and deploys directly to Vercel like any other Next.js project. No separate hosting platform required.
- The Payload admin dashboard lives at cms.transformidable.media. Media uploads are served from assets.transformidable.media.
- Database: Supabase PostgreSQL (existing account). Payload only requires a connection string — no Supabase-specific features are used, keeping the integration simple and consistent with the rest of the ecosystem.
- Each Next.js site fetches content from Payload via REST API or GraphQL. Use REST for simplicity.
- Content should be fetched at build time (SSG) for articles and podcast episodes to maximize performance, with ISR (Incremental Static Regeneration) to pick up new published content without full redeploys.
- Lumynr's member-only content should NOT go through the shared Payload instance — it should remain in Lumynr's existing Supabase database to preserve access control boundaries.
- inflections.media is a dormant domain that is superseded by transformidable.media as the publication home. No migration needed — Transformidable is a fresh build.

---

*This document is the source of truth for the Transformidable ecosystem architecture. Update as decisions evolve during implementation.*
