import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, Laptop, FileCheck, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import LazyImage from "@/components/LazyImage";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import heroIllustration from "@/assets/services-operating-model.svg";
import learningIllustration from "@/assets/services-learning.svg";
import talentIllustration from "@/assets/services-talent.svg";
import staffingIllustration from "@/assets/services-staffing.svg";
import innovationIllustration from "@/assets/services-innovation.svg";
import operationsIllustration from "@/assets/services-operational-support.svg";

const serviceTabs = [
  {
    icon: Lightbulb,
    title: "Strategic HR Consulting",
    gradient: "from-primary to-blue-600",
    items: [
      "People strategy design aligned to business objectives",
      "Organization design and workforce architecture",
      "Change management and culture transformation",
      "Leadership enablement & advisory council support",
      "Experience-led performance and reward programs",
      "Sustainable operating model and governance design",
    ],
  },
  {
    icon: Users,
    title: "Talent Acquisition",
    gradient: "from-accent to-purple-600",
    items: [
      "Turnkey recruitment programs for high-volume hiring",
      "Executive Search",
      "Recruitment marketing and employer brand activation",
      "Candidate experience and interview operations design",
      "Talent pipeline development and workforce intelligence",
      "Assessment, selection, and onboarding enablement",
    ],
  },
  {
    icon: Laptop,
    title: "Technology & Innovation",
    gradient: "from-blue-500 to-cyan-500",
    items: [
      "HRIS and people-tech selection support",
      "Implementation leadership and change enablement",
      "Process automation and workflow optimization",
      "People analytics dashboards and insight storytelling",
      "Self-service journeys for employees and managers",
      "Digital transformation roadmaps and adoption playbooks",
    ],
  },
  {
    icon: FileCheck,
    title: "Transactional Services",
    gradient: "from-indigo-500 to-purple-600",
    items: [
      "Background checks, onboarding logistics, and documentation",
      "Virtual administrative and HR shared-services support",
      "Policy development, audits, and compliance monitoring",
      "Case management and employee relations coordination",
      "Fractional HR: Not ready to scale up your HR function? We can support your short and long-term HR needs.",
      "People operations playbooks and knowledge management",
    ],
  },
];

const serviceHighlights = [
  {
    title: "Learning and Development",
    description:
      "Our learning and development solutions empower the workforce with the skills and knowledge they need to grow and succeed. We work with clients to develop tailored training and curriculum that drive performance and foster continuous improvement.",
    bullets: [
      "Capability assessments and skills-gap analysis",
      "Leadership & manager enablement journeys",
      "Blended learning experiences with measurement loops",
    ],
    image: learningIllustration,
  },
  {
    title: "Talent Acquisition",
    description:
      "Build consistent, future-ready hiring engines that reflect your brand and deliver exceptional candidate experiences from sourcing through onboarding.",
    bullets: [
      "Executive search grounded in market intelligence",
      "Employer value proposition and recruiting campaigns",
      "Interview training, scorecards, and operations enablement",
    ],
    image: talentIllustration,
  },
  {
    title: "Tailored Staffing Solutions",
    description:
      "We provide customized staffing strategies that match the right talent to your business needs. Whether the need is for temporary or permanent staffing, our flexible approach ensures you have the people and skills necessary to achieve your goals.",
    bullets: [
      "Project-based, temp-to-perm, and direct hire programs",
      "Talent pooling and bench management for critical roles",
      "Onboarding, knowledge transfer, and retention support",
    ],
    image: staffingIllustration,
  },
  {
    title: "Technology and Innovation",
    description:
      "Build connective tissue across your people-tech ecosystem with scalable platforms, automation, and analytics that inform every decision.",
    bullets: [
      "System roadmaps, vendor evaluation, and selection",
      "Implementation governance with change communications",
      "Reporting suites and people analytics enablement",
    ],
    image: innovationIllustration,
  },
  {
    title: "Transactional Services",
    description:
      "Reliable day-to-day HR operations with embedded quality controls and responsive support so your teams can focus on growth.",
    bullets: [
      "Knowledge bases, SOPs, and compliance documentation",
      "Case management, employee relations, and escalation routing",
      "Fractional HR: Not ready to scale up your HR function? We can support your short and long-term HR needs.",
    ],
    image: operationsIllustration,
  },
];

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const canonicalUrl = useMemo(() => buildCanonicalUrl("/services"), []);
  const scheduleUrl = import.meta.env.VITE_SCHEDULER_URL ?? "/contact";
  const activeServiceData = serviceTabs[activeService];
  const ActiveIcon = activeServiceData.icon;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Services | Linque Resourcing"
        description="Explore Linque Resourcing's strategic HR consulting, talent acquisition, technology, and transactional services designed to elevate your people operations."
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: "Services | Linque Resourcing",
          description:
            "Strategic HR consulting, talent acquisition, L&D, staffing, technology, and transactional services tailored to your organization.",
          url: canonicalUrl,
        }}
      />

      <section className="relative overflow-hidden bg-gradient-subtle py-24">
        <div className="absolute inset-0 bg-gradient-mesh opacity-25" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <AnimatedSection animation="slide-in-left" className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                People-first expertise
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Services that connect{" "}
                <ScribbleHighlight>people strategy</ScribbleHighlight> to business outcomes.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From strategy design to operational execution, Linque Resourcing integrates advisory, recruitment,
                technology, and fractional support to help HR teams deliver measurable impact.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/contact">Work with us</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                    Schedule a Call
                  </a>
                </Button>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-hero/40 blur-3xl" aria-hidden="true" />
                <LazyImage
                  src={heroIllustration}
                  alt="Strategic HR consultants collaborating on people operations"
                  wrapperClassName="overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 shadow-elegant"
                  className="rounded-[2.5rem]"
                  enableParallax
                  parallaxStrength={16}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr,1fr]">
            <AnimatedSection animation="fade-in-up" className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Full-spectrum <ScribbleHighlight color="accent">people operations</ScribbleHighlight>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every engagement is designed to be modular—whether you need strategic guidance, a project accelerator, or
                day-to-day operational support, we assemble the right expertise to extend your team.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We partner across industries with growing enterprises, PE-backed organizations, and mission-driven teams to
                harmonize people strategy, technology, and talent experience.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="slide-in-right">
              <div className="rounded-3xl border border-muted/60 bg-gradient-to-br from-background to-muted/40 p-10 shadow-card">
                <div className="flex items-start gap-4">
                  <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">What you can expect</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Discovery-first approach anchored in data</li>
                      <li>• Integrated delivery teams with clear governance</li>
                      <li>• Embedded enablement and change communications</li>
                      <li>• Measurement plans that track outcomes and adoption</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="fade-in-up" className="mt-20">
            <div className="mb-10 text-center">
              <h3 className="text-2xl md:text-3xl font-semibold">Explore our core service lines</h3>
              <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
                Toggle between focus areas to see how we partner across strategy, talent, technology, and operations.
              </p>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {serviceTabs.map((service, index) => (
                <button
                  key={service.title}
                  onClick={() => setActiveService(index)}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover-lift focus-visible:outline focus-visible:outline-primary focus-visible:outline-offset-4",
                    activeService === index
                      ? "bg-gradient-hero text-white shadow-elegant"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted/80"
                  )}
                  aria-pressed={activeService === index}
                >
                  {service.title}
                </button>
              ))}
            </div>

            <Card className="border-none bg-gradient-to-br from-background to-muted/30 shadow-elegant">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-elegant",
                        activeServiceData.gradient
                      )}
                    >
                      <ActiveIcon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">{activeServiceData.title}</CardTitle>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/contact">Talk to an expert</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {activeServiceData.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-white/70 p-5 text-sm shadow-sm transition hover-lift hover:shadow-card"
                    >
                      <span className="mt-0.5 text-primary" aria-hidden="true">
                        ✓
                      </span>
                      <span className="text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Service areas crafted for{" "}
              <ScribbleHighlight color="accent">your inflection point</ScribbleHighlight>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Pair a core service with the capability you need right now—from leadership enablement to staffing
              deployment—to build momentum quickly.
            </p>
          </AnimatedSection>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {serviceHighlights.map((highlight, index) => (
              <AnimatedSection key={highlight.title} animation="slide-in-left" delay={index * 70}>
                <Card className="grid gap-6 border-none bg-white/90 p-6 shadow-card transition hover:shadow-elegant lg:grid-cols-[0.9fr,1fr]">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-foreground">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {highlight.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <LazyImage
                    src={highlight.image}
                    alt={highlight.title}
                    wrapperClassName="overflow-hidden rounded-2xl border border-muted/60 bg-muted/50"
                    className="rounded-2xl"
                    enableParallax
                    parallaxStrength={10}
                  />
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up">
            <div className="rounded-3xl border border-muted/50 bg-gradient-hero px-10 py-16 text-white shadow-elegant">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold">Ready to shape what is next for your people team?</h2>
                  <p className="text-white/80">
                    Let&apos;s co-design a roadmap that blends strategy, experience, and execution to keep your organization
                    moving forward.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg" asChild>
                    <Link to="/contact">Work with us</Link>
                  </Button>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                    <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                      Schedule a Call
                    </a>
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

export default Services;
