import { Link, Navigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Briefcase, Clock, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { useJob } from "@/hooks/useContent";

const JobDetail = () => {
  const { slug } = useParams();
  const { data: job, isLoading } = useJob(slug);

  if (isLoading && !job) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Loading role…
      </div>
    );
  }

  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  const canonicalUrl = buildCanonicalUrl(`/jobs/${job.slug}`);
  const applyHref = job.applyUrl ?? `mailto:${job.applyEmail ?? "careers@linqueresourcing.com"}`;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${job.title} | Careers at Linque Resourcing`}
        description={job.summary}
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: job.title,
          description: job.summary,
          url: canonicalUrl,
          type: "article",
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: job.title,
          description: job.description,
          datePosted: job.postedAt,
          employmentType: job.employmentType,
          jobLocationType: job.remoteType,
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.location,
              addressCountry: "US",
            },
          },
          hiringOrganization: {
            "@type": "Organization",
            name: "Linque Resourcing",
            sameAs: "https://linqueresourcing.com",
          },
          directApply: true,
        }}
      />

      <section className="relative overflow-hidden bg-gradient-subtle pb-16 pt-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-in-up" className="space-y-6">
            <Button variant="ghost" asChild className="w-fit px-0 text-muted-foreground hover:text-primary">
              <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to jobs
              </Link>
            </Button>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Badge variant="outline" className="rounded-full border-primary/20 text-primary">
                {job.department}
              </Badge>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {job.location} · {job.remoteType}
              </span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" aria-hidden="true" /> {job.employmentType}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Posted {format(new Date(job.postedAt), "MMM d, yyyy")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <ScribbleHighlight>{job.title}</ScribbleHighlight>
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">{job.summary}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={applyHref}>
                  Apply now <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Talk with us</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="mx-auto max-w-4xl space-y-12">
            <Card className="border border-muted/60 bg-white/95 p-8 shadow-card space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">Role overview</h2>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                {job.salaryRange && (
                  <p className="text-sm text-muted-foreground">Compensation: {job.salaryRange}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">What you&apos;ll own</h3>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {job.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">What you bring</h3>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {job.qualifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="border border-muted/40 bg-muted/40 p-8 text-center text-sm text-muted-foreground">
              <p>
                Linque Resourcing is an equal opportunity employer. If you require accommodations during the hiring
                process, email <a href="mailto:careers@linqueresourcing.com" className="text-primary underline">careers@linqueresourcing.com</a>.
              </p>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default JobDetail;
