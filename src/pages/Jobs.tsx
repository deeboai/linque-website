import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, ExternalLink, Loader2 } from "lucide-react";
import { useJobs } from "@/hooks/useContent";

const Jobs = () => {
  const canonicalUrl = useMemo(() => buildCanonicalUrl("/jobs"), []);
  const [employmentFilter, setEmploymentFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const { data: jobs = [], isLoading } = useJobs();
  const jsonLdJobs = useMemo(
    () =>
      jobs.map((job, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${canonicalUrl}/${job.slug}`,
        name: job.title,
      })),
    [jobs, canonicalUrl],
  );

  const employmentTypes = useMemo(() => {
    const set = new Set<string>(["All"]);
    jobs.forEach((job) => job.employmentType && set.add(job.employmentType));
    return Array.from(set);
  }, [jobs]);

  const locations = useMemo(() => {
    const set = new Set<string>(["All"]);
    jobs.forEach((job) => job.location && set.add(job.location));
    return Array.from(set);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesEmployment = employmentFilter === "All" || job.employmentType === employmentFilter;
      const matchesLocation = locationFilter === "All" || job.location === locationFilter;
      return matchesEmployment && matchesLocation;
    });
  }, [employmentFilter, locationFilter, jobs]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Careers | Linque Resourcing"
        description="Explore sample careers at Linque Resourcing across HR consulting, talent acquisition, learning, and people operations."
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: "Careers | Linque Resourcing",
          description: "View open roles in HR consulting, talent acquisition, and people operations at Linque Resourcing.",
          url: canonicalUrl,
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          url: canonicalUrl,
          numberOfItems: jsonLdJobs.length,
          itemListElement: jsonLdJobs,
        }}
      />

      <section className="relative overflow-hidden bg-gradient-subtle py-24">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-in-up" className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Careers at Linque
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Join a team that <ScribbleHighlight>builds people-first change</ScribbleHighlight> for organizations.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore sample opportunities across consulting, talent, and people operations. Roles flex across client work, fractional leadership, and internal initiatives.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up">
            <div className="grid gap-6 md:grid-cols-3 md:items-end">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Employment type</p>
                <select
                  value={employmentFilter}
                  onChange={(event) => setEmploymentFilter(event.target.value)}
                  className="w-full rounded-xl border border-muted/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Location</p>
                <select
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                  className="w-full rounded-xl border border-muted/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-muted-foreground md:justify-self-end">
                Showing {filteredJobs.length} of {jobs.length} roles
              </div>
            </div>
          </AnimatedSection>

          {isLoading && jobs.length === 0 ? (
            <div className="flex justify-center py-20 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Loading roles…
            </div>
          ) : (
            <div className="mt-12 grid gap-8">
              {filteredJobs.map((job) => (
              <AnimatedSection key={job.slug} animation="fade-in-up">
                <Card className="border border-muted/60 bg-white/90 shadow-card transition hover:shadow-elegant">
                  <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <Badge variant="outline" className="mb-3 rounded-full border-primary/20 text-xs text-primary">
                        {job.department}
                      </Badge>
                      <CardTitle className="text-2xl font-semibold text-foreground">{job.title}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{job.summary}</p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" aria-hidden="true" /> {job.location} · {job.remoteType}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Briefcase className="h-4 w-4" aria-hidden="true" /> {job.employmentType}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4" aria-hidden="true" /> Posted {format(new Date(job.postedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-muted-foreground">
                      {job.salaryRange ? `Compensation: ${job.salaryRange}` : "Compensation shared during interview process"}
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button asChild variant="outline">
                        <Link to={`/jobs/${job.slug}`}>
                          Learn more
                        </Link>
                      </Button>
                      <Button asChild>
                        <a href={job.applyUrl ?? `mailto:${job.applyEmail ?? "careers@linqueresourcing.com"}`}>
                          Apply
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}

            {filteredJobs.length === 0 && !isLoading && (
              <AnimatedSection animation="fade-in-up">
                <Card className="border-none bg-muted/40 p-10 text-center text-muted-foreground">
                  <p>No roles match your filters right now. Check back soon or connect via careers@linqueresourcing.com.</p>
                </Card>
              </AnimatedSection>
            )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Jobs;
