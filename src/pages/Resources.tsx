import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import LazyImage from "@/components/LazyImage";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2, Tag } from "lucide-react";
import { usePosts } from "@/hooks/useContent";

const INITIAL_POST_COUNT = 6;

const truncate = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).replace(/\s+\S*$/, "")}…`;
};

const Resources = () => {
  const canonicalUrl = useMemo(() => buildCanonicalUrl("/resources"), []);
  const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { data: posts = [], isLoading } = usePosts();
  const jsonLdPosts = useMemo(
    () =>
      posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        image: post.heroImage,
        datePublished: post.publishedAt ?? undefined,
        url: `${canonicalUrl}/${post.slug}`,
        description: post.description,
      })),
    [posts, canonicalUrl],
  );

  const categories = useMemo(() => {
    const unique = new Set<string>(["All"]);
    posts.forEach((post) => unique.add(post.category));
    return Array.from(unique);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, posts]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const isAllLoaded = displayedPosts.length >= filteredPosts.length;

  const handleLoadMore = () => {
    if (isAllLoaded) return;
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) => count + INITIAL_POST_COUNT);
      setIsLoadingMore(false);
    }, 450);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_POST_COUNT);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Resources & Insights | Linque Resourcing"
        description="Stay ahead with curated HR insights from Linque Resourcing covering digital transformation, workforce planning, culture, compliance, and talent strategy."
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: "Resources & Insights | Linque Resourcing",
          description:
            "Explore the latest HR and people operations insights from Linque Resourcing—digital transformation, workforce planning, and talent strategy.",
          url: canonicalUrl,
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Linque Resourcing Insights",
          description:
            "Expert perspectives on HR strategy, learning and development, compliance, and talent experience from Linque Resourcing consultants.",
          url: canonicalUrl,
          blogPost: jsonLdPosts,
        }}
      />

      <section className="relative overflow-hidden bg-gradient-subtle py-24">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="slide-in-left" className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              HR insights that{" "}
              <ScribbleHighlight>turn strategy into action</ScribbleHighlight>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore playbooks, trends, and practical how-tos for building people-first organizations.
              Each article is written by operators who have been in your seat.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="mb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold">Latest perspectives</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Filter by category to surface the topics most relevant to your people strategy.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isActive = category === activeCategory;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-transparent bg-gradient-hero text-white shadow-elegant"
                          : "border-muted bg-muted/40 text-muted-foreground hover:bg-muted/70 focus-visible:bg-muted/70"
                      }`}
                      aria-pressed={isActive}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {isLoading && posts.length === 0 ? (
            <div className="flex justify-center py-20 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Loading insights…
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {displayedPosts.map((post, index) => (
              <AnimatedSection key={post.slug} animation="fade-in-up" delay={index * 50}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-muted/60 bg-white/80 shadow-card transition hover-lift hover:shadow-elegant">
                  <Link to={`/resources/${post.slug}`} className="block focus-visible:outline-none">
                    <LazyImage
                      src={post.heroImage}
                      alt={post.title}
                      wrapperClassName="aspect-[4/3] overflow-hidden"
                      className="object-cover"
                      enableParallax
                      parallaxStrength={12}
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                        <Tag className="h-3 w-3" aria-hidden="true" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {format(new Date(post.publishedAt), "MMM d, yyyy")}
                      </span>
                      <span className="ml-auto text-muted-foreground">
                        {post.readTimeMinutes ?? 5} min read
                      </span>
                    </div>
                    <Link to={`/resources/${post.slug}`}>
                      <h3 className="text-xl font-semibold leading-tight transition group-hover:text-primary">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {truncate(post.excerpt, 160)}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="rounded-full border-primary/20 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link
                        to={`/resources/${post.slug}`}
                        className="text-sm font-semibold text-primary transition hover:gap-2 inline-flex items-center gap-1"
                        aria-label={`Read more: ${post.title}`}
                      >
                        Read more
                        <span aria-hidden="true" className="transition group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={isAllLoaded || isLoadingMore}
              variant="outline"
              className="min-w-[180px]"
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading…
                </span>
              ) : (
                <span>{isAllLoaded ? "All articles loaded" : "Load more"}</span>
              )}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
