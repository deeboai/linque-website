import { format } from "date-fns";
import { Link, Navigate, useParams } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import LazyImage from "@/components/LazyImage";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronLeft, Loader2 } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { usePost } from "@/hooks/useContent";

const ResourceDetail = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = usePost(slug);
  const prefersReducedMotion = usePrefersReducedMotion();
  const scheduleUrl = import.meta.env.VITE_SCHEDULER_URL ?? "/contact#contact-form";

  if (isLoading && !post) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
        Loading insight…
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/resources" replace />;
  }

  const canonicalUrl = buildCanonicalUrl(`/resources/${post.slug}`);
  const headings = post.content
    .map((section, index) => ({
      id: section.heading ? `${post.slug}-section-${index}` : null,
      heading: section.heading,
    }))
    .filter((section) => section.id && section.heading) as { id: string; heading: string }[];

  const handleJump = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${post.title} | Linque Resourcing Insights`}
        description={post.description}
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: post.title,
          description: post.description,
          url: canonicalUrl,
          image: post.heroImage,
          type: "article",
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          abstract: post.excerpt,
          image: post.heroImage,
          author: {
            "@type": "Organization",
            name: "Linque Resourcing",
          },
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          mainEntityOfPage: canonicalUrl,
          wordCount: post.content.reduce((total, section) => total + section.body.join(" ").split(" ").length, 0),
        }}
      />

      <section className="relative overflow-hidden bg-gradient-subtle pb-16 pt-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-in-up" className="space-y-6">
            <Button variant="ghost" asChild className="w-fit px-0 text-muted-foreground hover:text-primary">
              <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back to insights
              </Link>
            </Button>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-white/70 text-primary">
                {post.category}
              </Badge>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {format(new Date(post.publishedAt), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {post.readTimeMinutes} min read
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <ScribbleHighlight>{post.title}</ScribbleHighlight>
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">{post.description}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative z-10">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="-mt-20 overflow-hidden rounded-3xl border border-muted/60 bg-white/90 shadow-elegant">
            <LazyImage
              src={post.heroImage}
              alt={post.title}
              wrapperClassName="aspect-[16/9]"
              className="object-cover"
              enableParallax
              parallaxStrength={14}
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[260px,1fr]">
            {headings.length > 0 && (
              <aside className="sticky top-28 self-start rounded-2xl border border-muted/80 bg-background/80 p-6 shadow-card backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
                <nav className="mt-4 space-y-2" aria-label="Article sections">
                  {headings.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleJump(section.id)}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-primary focus-visible:bg-muted/60 focus-visible:text-primary"
                    >
                      {section.heading}
                    </button>
                  ))}
                </nav>
              </aside>
            )}

            <article className="space-y-10 text-base leading-relaxed text-foreground/90 prose prose-slate max-w-none">
              {post.content.map((section, index) => {
                const sectionId = section.heading ? `${post.slug}-section-${index}` : undefined;
                return (
                  <div key={section.heading ?? index} id={sectionId} className="scroll-mt-32 space-y-4">
                    {section.heading && <h2 className="text-2xl font-semibold text-foreground">{section.heading}</h2>}
                    {section.body.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                        {section.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </article>
          </div>

          <AnimatedSection animation="fade-in-up" className="mt-16 rounded-3xl border border-muted/60 bg-gradient-hero px-8 py-12 text-white shadow-card">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl space-y-2">
                <h2 className="text-2xl font-semibold">Ready to activate what you read?</h2>
                <p className="text-white/80">
                  Partner with Linque Resourcing to translate these ideas into programs that deliver measurable impact.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" asChild>
                  <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                    Schedule a Call
                  </a>
                </Button>
                <Button className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link to="/services">Explore Services</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default ResourceDetail;
