import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import LazyImage from "@/components/LazyImage";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import heroIllustration from "@/assets/how-we-work-abstract.svg";
import {
  ClipboardList,
  Users,
  BarChart,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";

const processSteps = [
  {
    id: "discover",
    label: "Discover",
    title: "Discovery & Diagnostics",
    summary:
      "We uncover the voice of your people and the realities of your operations through interviews, readiness assessments, and culture mapping.",
    description:
      "Our team conducts stakeholder interviews, data reviews, and pulse surveys to surface the story beneath the surface. We benchmark your current-state HR programs against best practice to baseline readiness.",
    icon: ClipboardList,
    outcomes: ["Discovery summary & personas", "Prioritized opportunity map", "Change readiness insights"],
  },
  {
    id: "align",
    label: "Align",
    title: "Immersion & Alignment",
    summary:
      "We embed with your teams to align on goals, success metrics, and governance—ensuring HR decisions support business momentum.",
    description:
      "Through facilitated workshops and design sprints, we co-create guiding principles, identify dependencies, and clarify ownership so the path forward is actionable.",
    icon: Users,
    outcomes: ["Experience journey maps", "Shared definition of success", "Aligned roadmap guardrails"],
  },
  {
    id: "design",
    label: "Design",
    title: "Strategy Design & Roadmap",
    summary:
      "We translate insights into a focused, data-informed plan that blends people, process, and technology enablement.",
    description:
      "Our consultants build modular playbooks, change communications, and phased roadmaps while defining the measures that signal progress at every milestone.",
    icon: BarChart,
    outcomes: ["Phased delivery plan", "KPIs & dashboard framework", "Enablement toolkit"],
  },
  {
    id: "optimize",
    label: "Optimize",
    title: "Implementation & Iteration",
    summary:
      "We coach execution teams, automate reporting, and adapt to live feedback loops so the strategy continues to serve the business.",
    description:
      "Retrospectives, office hours, and maturity checkpoints keep momentum high while we test, learn, and refine alongside your leaders.",
    icon: RefreshCw,
    outcomes: ["Activation support & ops cadence", "Continuous improvement sprints", "Executive-ready reporting"],
  },
];

const principles = [
  {
    icon: Lightbulb,
    title: "Insights Before Action",
    description: "Every recommendation is grounded in qualitative and quantitative discovery work.",
  },
  {
    icon: Target,
    title: "Outcome Orientation",
    description: "We establish success metrics up front and measure relentlessly against them.",
  },
  {
    icon: Sparkles,
    title: "Change That Sticks",
    description: "Enablement, coaching, and iteration are built into every engagement from the start.",
  },
];

const HowWeWork = () => {
  const [activeStep, setActiveStep] = useState(processSteps[0].id);
  const prefersReducedMotion = usePrefersReducedMotion();
  const canonicalUrl = useMemo(() => buildCanonicalUrl("/how-we-work"), []);
  const scheduleUrl =
    import.meta.env.VITE_SCHEDULER_URL ??
    "https://calendly.com/o-ismailalabi-linqueresourcing/30min-1";

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry?.target?.id) {
          setActiveStep(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    processSteps.forEach((step) => {
      const element = document.getElementById(step.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleAnchorClick = (stepId: string) => {
    const element = document.getElementById(stepId);
    if (!element) return;
    element.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    setActiveStep(stepId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="How We Work | Linque Resourcing"
        description="Explore the Linque Resourcing methodology—discovery, alignment, design, and optimization—for people-first HR transformations."
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: "How We Work | Linque Resourcing",
          description:
            "Our four-step methodology delivers people-first HR transformations grounded in insight, alignment, design, and optimization.",
          url: canonicalUrl,
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Linque Resourcing HR Transformation Framework",
          step: processSteps.map((step) => ({
            "@type": "HowToStep",
            name: step.title,
            url: `${canonicalUrl}#${step.id}`,
            itemListElement: step.outcomes.map((outcome) => ({
              "@type": "HowToDirection",
              text: outcome,
            })),
            description: step.summary,
          })),
        }}
      />

      <section className="relative overflow-hidden bg-gradient-subtle py-24">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
            <AnimatedSection animation="slide-in-left" className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                Our Proven Approach
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                We design people strategies that{" "}
                <ScribbleHighlight>move businesses forward</ScribbleHighlight>.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Linque Resourcing combines advisory expertise, data fluency, and in-the-field operators to architect
                people programs that scale. Our collaborative model keeps leaders aligned, teams enabled, and outcomes
                measurable.
              </p>
              <div className="flex flex-wrap gap-3">
                {processSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleAnchorClick(step.id)}
                    className="rounded-full border border-primary/30 bg-white/70 px-4 py-2 text-sm font-semibold text-primary transition hover-lift hover:border-primary hover:bg-white focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    {step.label}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-in-right" className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-hero/40 blur-3xl" aria-hidden="true" />
              <LazyImage
                src={heroIllustration}
                alt="Consultants collaborating on a people strategy roadmap"
                wrapperClassName="rounded-[2rem] border border-white/60 shadow-elegant bg-white/80"
                className="rounded-[2rem]"
                enableParallax
                parallaxStrength={18}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="mb-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Our <ScribbleHighlight color="accent">engagement journey</ScribbleHighlight>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                  Four phases create an intentional flow from discovery to optimization. Each stage links to the next,
                  with transparent checkpoints, enablement moments, and measurable outcomes.
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link to="/services">Explore Services</Link>
                </Button>
                <Button asChild>
                  <Link to="/contact">Start a Project</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-12 lg:grid-cols-[280px,1fr]">
            <nav
              aria-label="Process navigation"
              className="sticky top-24 self-start rounded-2xl border border-muted/80 bg-background/80 p-6 shadow-card backdrop-blur"
            >
              <p className="mb-4 text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                Engagement Phases
              </p>
              <ul className="space-y-3">
                {processSteps.map((step) => {
                  const isActive = activeStep === step.id;
                  return (
                    <li key={step.id}>
                      <button
                        onClick={() => handleAnchorClick(step.id)}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                          isActive
                            ? "bg-gradient-hero text-white shadow-elegant"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/60 focus-visible:bg-muted/60"
                        }`}
                        aria-current={isActive ? "step" : undefined}
                      >
                        {step.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-10">
              {processSteps.map((step, index) => (
                <AnimatedSection key={step.id} animation="fade-in-up" delay={index * 60}>
                  <article
                    id={step.id}
                    className="relative rounded-3xl border border-muted/60 bg-gradient-to-br from-background to-muted/40 p-8 shadow-card scroll-mt-32"
                    aria-labelledby={`${step.id}-title`}
                  >
                    <div className="absolute left-6 top-10 bottom-10 hidden w-px bg-gradient-hero/60 lg:block" aria-hidden="true" />
                    <div className="lg:pl-10">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-white shadow-elegant">
                          <step.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 text-sm uppercase tracking-wide text-primary/80">
                            <span>Step {index + 1}</span>
                            <span className="h-px w-6 bg-primary/40" aria-hidden="true" />
                            <span>{step.label}</span>
                          </div>
                          <h3 id={`${step.id}-title`} className="mt-2 text-2xl font-semibold">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="mt-4 text-base text-muted-foreground leading-relaxed">{step.summary}</p>
                      <p className="mt-3 text-base leading-relaxed text-foreground/90">{step.description}</p>
                      <div className="mt-6 grid gap-3 md:grid-cols-2">
                        {step.outcomes.map((outcome) => (
                          <div
                            key={outcome}
                            className="flex items-start gap-3 rounded-2xl bg-white/60 p-4 text-sm text-foreground shadow-sm transition hover-lift hover:shadow-md"
                          >
                            <span className="mt-0.5 text-primary" aria-hidden="true">
                              ✓
                            </span>
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Principles that <ScribbleHighlight>shape every engagement</ScribbleHighlight>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether we are advising your executive team or scaling enablement across the organization, these tenets
              ensure momentum and measurable outcomes.
            </p>
          </AnimatedSection>
          <div className="grid gap-8 md:grid-cols-3">
            {principles.map((principle, index) => (
              <AnimatedSection key={principle.title} animation="scale-in" delay={index * 80}>
                <Card className="h-full border-none bg-background/80 shadow-card hover:shadow-elegant transition hover-lift">
                  <CardContent className="pt-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero/20 text-primary">
                      <principle.icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{principle.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up">
            <div className="relative overflow-hidden rounded-3xl border border-muted/60 bg-gradient-hero text-white px-8 py-16 md:px-16">
              <div className="absolute inset-0 opacity-20 bg-gradient-mesh" aria-hidden="true" />
              <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold">Bring a people-first perspective to your next initiative</h2>
                  <p className="text-lg text-white/80 leading-relaxed">
                    From strategic advisory to hands-on program activation, we support HR, Talent, and Operations teams
                    with collaborative delivery that respects your culture.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg" asChild>
                    <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                      Schedule a Call
                    </a>
                  </Button>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                    <Link to="/services">View Solutions</Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default HowWeWork;
