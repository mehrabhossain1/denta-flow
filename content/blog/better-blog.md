---
title: BetterStarter Has a Better Blog
description: Discover why BetterStarter's blog feature is the perfect content platform for startups. Type-safe, performant, and built with modern tools for the best developer experience.
image: /blog-assets/better-blog/flow-work.jpg
published: 2026-02-07
authors:
  - Better Starter Team
draft: false
tags: ["blogging", "content", "startup", "features"]
---

Building a blog for your startup shouldn't be complicated. Yet most solutions either lock you into a CMS, require complex infrastructure, or sacrifice developer experience for flexibility. BetterStarter's blog changes that with a modern, type-safe approach that makes content management a breeze.

## Why Startups Need a Great Blog

Content marketing is essential for startups. A blog helps you:

- **Build authority** in your industry through thought leadership
- **Improve SEO** with fresh, relevant content
- **Educate customers** about your product and solutions
- **Attract talent** by showcasing your culture and expertise
- **Drive conversions** by nurturing leads through the funnel

But traditional blogging platforms come with tradeoffs. WordPress is heavy and requires maintenance. Headless CMSs add complexity and costs. Static site generators can be rigid. BetterStarter's blog gives you the best of all worlds.

## Built on Modern Foundations

BetterStarter's blog isn't an afterthought. It's a carefully designed system inspired by [TanStack's blog architecture](https://github.com/TanStack/tanstack.com), built with production-grade tools:

### Content Collections with Zod Validation

Every blog post is validated at build time using [Content Collections](https://www.content-collections.dev/) and Zod schemas. This means:

- **Type safety** throughout your entire stack
- **Compile-time errors** if frontmatter is invalid
- **Auto-completion** in your IDE for all blog fields
- **Zero runtime overhead** for validation

```yaml
---
title: Your Post Title  # Required
description: SEO-friendly description  # Required
published: 2026-02-07  # ISO date format, required
authors:
  - Author Name  # Array of authors
draft: false  # Hide unpublished content
tags: ["startup", "content"]  # Categorization
image: /path/to/image.jpg  # Optional header image
---
```

### GitHub Flavored Markdown

Write content in markdown with full [GFM support](https://github.github.com/gfm/) powered by unified, remark, and rehype:

- ✅ **Tables** for data presentation
- ✅ **Task lists** for checklists
- ✅ **Strikethrough** for edits
- ✅ **Autolinked URLs** for convenience
- ✅ **Code blocks** with syntax highlighting support
- ✅ **Heading anchors** for deep linking

All processed through a robust pipeline that escapes HTML properly and generates semantic markup.

## Features That Matter for Startups

### 1. Draft Posts & Scheduling

Launch content when you're ready:

```yaml
draft: true  # Post won't appear on your site
published: 2026-03-01  # Future date = automatic scheduling
```

Write drafts locally, get them reviewed, and publish when the time is right. No separate staging environment needed.

### 2. Table of Contents with Scroll-Spy

Every blog post automatically generates a sticky table of contents from your markdown headings. As readers scroll, the TOC highlights the current section, making long-form content more navigable.

This is especially powerful for:
- Technical tutorials
- Product documentation
- In-depth guides
- Research articles

### 3. Multiple Authors

Credit your team properly:

```yaml
authors:
  - John Doe
  - Jane Smith
```

The blog automatically formats multiple authors with proper grammar using `Intl.ListFormat`, so "John Doe and Jane Smith" displays correctly in any locale.

### 4. Tag System

Organize content by topic:

```yaml
tags: ["product", "engineering", "design"]
```

Tags help readers discover related content and improve your site's information architecture. They're displayed as badges on post cards and in post headers.

### 5. RSS Feed for Syndication

BetterStarter automatically generates an RSS 2.0 feed at `/rss.xml`:

- **50 most recent posts** included in the feed
- **Proper XML escaping** for security
- **Author formatting** with proper grammar
- **Optimized caching** (5min browser, 1hr CDN)
- **Compatible with all RSS readers** (Feedly, Inoreader, etc.)

The blog listing page includes an RSS icon that links to the feed, making it easy for readers to subscribe and stay updated on your latest content.

### 6. Header Images with CDN Optimization

Add visual appeal with header images:

```yaml
image: /path/to/image.jpg
```

**Recommended image sizes:**
- **Best**: 1920×1080px (16:9) or 1600×900px - works perfectly everywhere
- **Minimum**: 1200×630px - required for social media cards
- **Format**: WebP (best), JPEG, or PNG
- **File size**: Under 200KB for optimal performance

BetterStarter automatically:
- Displays images at the top of blog posts at 1.91:1 aspect ratio
- Shows them in blog cards at the same 1.91:1 ratio for consistency
- Optimizes them for social sharing (1200×630 for Open Graph)
- Uses lazy loading for performance
- Maintains the same aspect ratio everywhere for a cohesive look

If you don't specify an image, the first image in your content becomes the header automatically.

## Performance That Scales

### Server Functions for Type-Safe Data Fetching

Blog data flows through TanStack Start's server functions:

```typescript
// Type-safe, validated at compile time
const posts = await fetchBlogPosts()
const post = await fetchBlogPost({ slug: 'my-post' })
```

This architecture ensures:
- **Type safety** from database to UI
- **Automatic serialization** of complex data
- **Environment shaking** so server code never reaches clients
- **Composable data fetching** for complex queries

### Client-Side Caching

BetterStarter implements smart caching strategies using TanStack Router:

- **Client-side cache**: 5-minute stale time for fast navigation
- **Background revalidation**: Automatic updates when data becomes stale
- **Instant responses** for returning visitors
- **Automatic revalidation** in the background

Users get instant page loads while you retain control over when content updates.

### Build-Time Generation

All blog content is processed at build time:
- Markdown converted to HTML once
- Heading structure extracted for TOC
- Frontmatter validated and typed
- Posts sorted and filtered

This means zero runtime overhead for content processing. Your blog is as fast as serving static HTML, because it essentially is.

## Developer Experience

### Write in Your Favorite Editor

No web interface required. Write posts in VS Code, Cursor, or any editor with:

- Full markdown syntax highlighting
- Git-based version control
- Pull request workflows
- Collaborative editing

Your blog content lives in `content/blog/` as markdown files. Commit them to git like any other code.

### Instant Feedback

Start the dev server and see changes instantly:

```bash
pnpm dev
```

Hot module replacement means you see edits in real-time without page refreshes. Write content and iterate fast.

### Type Safety Everywhere

If you reference a blog post that doesn't exist, TypeScript catches it:

```typescript
// Error: Slug 'nonexistent' not found
<Link to="/blog/nonexistent" />
```

This prevents broken links before they reach production.

## SEO & Social Sharing Built-In

Every blog post automatically generates:

- **Meta descriptions** from frontmatter
- **Open Graph tags** for social media
- **Twitter Card tags** for rich previews
- **Canonical URLs** for SEO
- **Heading hierarchy** for crawlers
- **Structured data** support (extensible)
- **RSS feed** for content syndication and discovery
- **Sitemap.xml** generated automatically so search engines can discover and index all your posts

Draft and future-dated posts get `noindex` meta tags automatically, so they won't appear in search results until published.

## Dark Mode Support

The blog respects your site's theme:

- Tailwind's `prose` typography plugin handles styling
- Dark mode classes apply automatically
- Syntax highlighting adapts to theme (extensible)
- All components support both modes

No extra configuration needed.

## Responsive by Default

Blog layouts adapt to any screen size:

- **Mobile**: Single column, easy reading
- **Tablet**: Optimized spacing
- **Desktop**: Sidebar with TOC, wider content area

Touch targets are large, fonts scale properly, and images never overflow.

## Extensibility

### Add Custom Markdown Features

Want callouts? Math equations? Embedded components? Extend the markdown pipeline:

```typescript
// src/lib/blog/markdown.ts
export function renderMarkdown(content: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)  // Add math support
    .use(remarkRehype)
    .use(rehypeKatex)  // Render with KaTeX
    // ... rest of pipeline
}
```

The unified ecosystem has plugins for everything:

- **Math** rendering (KaTeX, MathJax)
- **Syntax highlighting** (Shiki, Prism)
- **Diagrams** (Mermaid, PlantUML)
- **Footnotes** and citations
- **Custom directives** for callouts
- **Components** embedded in markdown

### Add Search

BetterStarter's architecture makes adding search straightforward:

```typescript
// Already has search in the codebase (can be enabled)
const results = await fetchSearchPosts(query)
```

Connect it to a search UI component and you have full-text search across all posts.

### Analytics Integration

Track what content resonates:

```typescript
// Example: Track page views
useEffect(() => {
  analytics.track('Blog Post Viewed', {
    title: post.title,
    slug: post.slug,
    tags: post.tags,
  })
}, [post])
```

Integrate with Plausible, Fathom, Mixpanel, or any analytics tool to understand reader behavior.

## Migration is Simple

Moving existing content to BetterStarter is straightforward:

1. **Convert posts to markdown** with YAML frontmatter
2. **Place files in** `content/blog/`
3. **Validate frontmatter** against the schema
4. **Build and verify** locally

The type system catches any issues immediately. Most conversions take minutes, not hours.

## Real-World Use Cases

BetterStarter's blog excels for:

### Product Updates

Keep customers informed about new features, fixes, and improvements. Schedule posts to align with release dates.

### Technical Tutorials

Write detailed guides with code examples, images, and tables. The TOC helps readers navigate complex topics.

### Company News

Share funding announcements, team expansions, and milestones. Multiple authors credit everyone involved.

### Thought Leadership

Establish your expertise with in-depth articles. SEO optimization helps you rank for important keywords.

### Developer Documentation

Mix narrative content with code samples. Markdown's flexibility makes technical writing natural.

## Why This Matters for Startups

Building a custom blog used to mean:

- **Weeks of development time** setting up infrastructure
- **Ongoing maintenance** of CMS software
- **Monthly costs** for headless CMS services
- **Complex deployments** and hosting

BetterStarter eliminates all of this:

- ✅ **Ready in minutes** – Blog is already built
- ✅ **Zero maintenance** – No CMS to update
- ✅ **No additional costs** – It's just markdown files
- ✅ **Single deployment** – Blog ships with your app

This means your team can focus on what matters: creating great content that grows your business.

## Getting Started

Create your first blog post:

```bash
# Create a new markdown file
touch content/blog/hello-world.md
```

Add frontmatter and content:

```markdown
---
title: Hello World
description: Our first blog post
published: 2026-02-07
authors:
  - Your Name
draft: false
tags: ["announcement"]
---

# Welcome to Our Blog

This is where we'll share updates, tutorials, and insights...
```

Start the dev server:

```bash
pnpm dev
```

Visit `http://localhost:3000/blog/hello-world` and you're live.

## Conclusion

BetterStarter's blog isn't just another static site generator. It's a thoughtfully designed content platform that brings together:

- **Type safety** for reliability
- **Modern tooling** for great DX
- **Performance** for fast page loads
- **Flexibility** for customization
- **Simplicity** for ease of use

Whether you're a solo founder writing product updates or a growing team publishing thought leadership, BetterStarter's blog scales with your needs.

The best part? It's already built. Just start writing.
