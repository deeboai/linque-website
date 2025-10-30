import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Users,
  Laptop,
  FileCheck,
  Sparkles,
  UserCog,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";
import heroImage from "@/assets/christina-wocintechchat-com-KAULAzQwxzE-unsplash.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  {
    title: "Strategic HR Consulting",
    icon: Lightbulb,
    summary:
      "Design operating models, workforce plans, and change roadmaps that align people strategy with your business outcomes.",
    points: [
      "People strategy design grounded in executive priorities",
      "Organization design, workforce architecture, and role clarity",
      "Change management, culture, and leadership enablement programs",
      "Performance, reward, and governance frameworks that scale",
    ],
  },
  {
    title: "Talent Acquisition",
    icon: Users,
    summary:
      "Build hiring engines that blend employer brand, recruitment operations, and candidate experience to deliver the right talent every time.",
    points: [
      "Executive and professional search supported by market intelligence",
      "Recruitment marketing and employer value proposition activation",
      "Interview enablement, scorecards, and candidate journey design",
      "Pipeline analytics, workforce planning, and onboarding readiness",
    ],
  },
  {
    title: "Learning and Development",
    icon: GraduationCap,
    summary:
      "Co-create tailored curricula that empower managers and teams, reinforce culture, and sustain performance over time.",
    points: [
      "Capability assessments and skills-gap analysis",
      "Leadership, manager, and team enablement journeys",
      "Blended learning programs with measurement loops",
      "Knowledge hubs and enablement tools for ongoing adoption",
    ],
  },
  {
    title: "Tailored Staffing Solutions",
    icon: Briefcase,
    summary:
      "Deploy customized staffing strategies for temporary or permanent needs so you always have the right skills at the right time.",
    points: [
      "Project-based, temp-to-perm, and direct hire programs",
      "Talent pooling and bench management for critical roles",
      "Onboarding, knowledge transfer, and retention support",
      "Workforce analytics to anticipate and fill demand",
    ],
  },
  {
    title: "Technology & Innovation",
    icon: Laptop,
    summary:
      "Modernize your people-tech ecosystem with platforms, automation, and analytics that inform every decision.",
    points: [
      "HRIS and people-tech strategy, evaluation, and selection",
      "Implementation leadership with change and communications",
      "Automation, workflow optimization, and self-service journeys",
      "People analytics dashboards, reporting, and insight storytelling",
    ],
  },
  {
    title: "Transactional Services",
    icon: FileCheck,
    summary:
      "Stabilize day-to-day HR operations with responsive, compliant support that frees your teams to focus on growth.",
    points: [
      "Background checks, onboarding logistics, and documentation",
      "Shared-services support for tickets, cases, and employee relations",
      "Policy development, audits, and compliance monitoring",
      "Knowledge bases, SOPs, and escalation playbooks",
    ],
  },
  {
    title: "Fractional HR",
    icon: UserCog,
    summary:
      "Not ready to scale up your HR function? Engage fractional leaders who embed with your teams and guide the path forward.",
    points: [
      "Interim CHRO, VP HR, and HRBP coverage tailored to your stage",
      "Executive-level guidance without full-time overhead",
      "Flexible retainers that expand or contract with your priorities",
      "Coaching, enablement, and playbooks for internal HR teams",
    ],
  },
];

const Services = () => {
  const canonicalUrl = useMemo(() => buildCanonicalUrl("/services"), []);
  const scheduleUrl =
    import.meta.env.VITE_SCHEDULER_URL ??
    "https://calendly.com/o-ismailalabi-linqueresourcing/30min-1";

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Services | Linque Resourcing"
        description="Explore Linque Resourcing's strategic HR consulting, talent acquisition, technology, staffing, and fractional services designed to elevate your people operations."
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: "Services | Linque Resourcing",
          description:
            "Strategic HR consulting, talent acquisition, learning, technology, and fractional services tailored to your organization.",
          url: canonicalUrl,
        }}
      />

      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Strategic HR consultants collaborating on people operations"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <AnimatedSection animation="slide-in-left" className="relative z-10 w-full">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl space-y-6 text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white">
                People-first expertise
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                Services that connect{" "}
                <ScribbleHighlight>people strategy</ScribbleHighlight> to business outcomes.
              </h1>
              <p className="text-lg leading-relaxed text-white/80">
                From advisory to execution, we blend strategy, talent, technology, and fractional support so HR teams can
                deliver measurable impact.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                  <Link to="/contact">Work With Us</Link>
                </Button>
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                  <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                    Schedule a Call
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr,1fr]">
            <AnimatedSection animation="fade-in-up" className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Full-spectrum <ScribbleHighlight color="accent">people operations</ScribbleHighlight>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every engagement is modular. Whether you need a strategic advisor, a project accelerator, or embedded
                operational support, we assemble the right expertise to extend your team.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We partner across industries to harmonize people strategy, technology, and talent experience—building
                programs that employees embrace and leaders can scale.
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
                      <li>• Discovery-first approach anchored in data and listening</li>
                      <li>• Integrated delivery teams with clear governance</li>
                      <li>• Enablement, change communications, and measurement loops</li>
                      <li>• Playbooks and coaching so capabilities stick long after go-live</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="fade-in-up" className="mt-20">
            <div className="max-w-3xl text-center mx-auto">
              <h3 className="text-3xl font-semibold">Explore our services</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Open each focus area to see how we partner across strategy, talent, technology, and operations without
                overwhelming your team.
              </p>
            </div>

            <Accordion type="multiple" className="mt-12 space-y-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <AccordionItem
                    key={service.title}
                    value={service.title}
                    className="overflow-hidden rounded-2xl border border-muted/60 bg-white/90 shadow-card transition hover:shadow-elegant"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-foreground">
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        {service.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 px-6 pb-6 text-sm text-muted-foreground">
                      <p>{service.summary}</p>
                      <ul className="space-y-2">
                        {service.points.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <span className="mt-1 text-primary" aria-hidden="true">
                              •
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up">
            <div className="rounded-3xl border border-muted/50 bg-gradient-hero px-10 py-16 text-white shadow-elegant">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Ready to shape what is next for your people team?
                  </h2>
                  <p className="text-white/80">
                    Let&apos;s co-design a roadmap that blends strategy, experience, and execution to keep your organization
                    moving forward.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg" asChild>
                    <Link to="/contact">Work With Us</Link>
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
