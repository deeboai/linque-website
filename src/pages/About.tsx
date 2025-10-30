import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, CheckCircle } from "lucide-react";
import aboutImage from "@/assets/priscilla-du-preez-nNMBa7Y1Ymk-unsplash.webp";
import aboutHeroBackground from "@/assets/aboutusbackground.webp";
import certificationFullBadge from "@/assets/certification.png";
import certificationPmpBadge from "@/assets/certification2.png";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutHeroBackground}
            alt="Linque team collaborating"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <AnimatedSection className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
              About <ScribbleHighlight>Us</ScribbleHighlight>
            </h1>
          </div>
        </AnimatedSection>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="slide-in-left">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-2xl rounded-3xl" />
                <img
                  src={aboutImage}
                  alt="Professional team collaboration"
                  className="rounded-2xl shadow-elegant w-full relative hover-lift transition-all duration-500"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-in-right">
              <div>
                <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    We are a talent management consulting company offering strategic, tailored partnerships to support our clients in achieving
                    organizational success. Through collaboration, we seek to understand your challenges and goals, ensuring our strategies align 
                    with your organizational vision. Our approach is rooted in innovation, professionalism, and a deep understanding of the 
                    ever-evolving landscape. With a commitment to excellence and a passion for people operations, we specialize in providing 
                    comprehensive people solutions that empower businesses to thrive.
                  </p>
                  <p className="font-semibold text-primary">Let us be your link to smarter people solutions.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
        <div className="container mx-auto px-4 relative">
          <AnimatedSection className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Our <ScribbleHighlight color="accent">Mission & Vision</ScribbleHighlight>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <AnimatedSection animation="scale-in" delay={100}>
              <Card className="h-full shadow-card hover:shadow-elegant transition-all duration-500 hover-lift border-none bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    To deliver strategic, people-centered solutions that align with business goals, elevate talent, and
                    drive lasting impact for every organization we support.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="scale-in" delay={200}>
              <Card className="h-full shadow-card hover:shadow-elegant transition-all duration-500 hover-lift border-none bg-gradient-to-br from-accent/5 to-transparent">
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center mb-6">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    To empower organizations to build thriving workplaces where people and businesses grow together.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-4xl font-bold">
              Why <ScribbleHighlight>Choose Us</ScribbleHighlight>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We bring a holistic framework that balances strategic vision with hands-on delivery.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" className="mx-auto max-w-4xl">
              <div className="rounded-3xl border border-muted/50 bg-white/90 p-10 shadow-card">
                <ul className="grid gap-6 text-muted-foreground md:grid-cols-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-base leading-relaxed text-foreground/90">
                      10+ years leading people strategy and operations across growth stages.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-base leading-relaxed text-foreground/90">
                      Experience across public, private, nonprofit, and international sectors.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-base leading-relaxed text-foreground/90">
                      Dedicated consultants embedded with your teams for continuity.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-base leading-relaxed text-foreground/90">
                      Tailored solutions that reflect your culture, pace, and goals.
                    </span>
                  </li>
                  <li className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                      <div className="space-y-2">
                        <span className="block text-base leading-relaxed text-foreground/90">
                          Certified PMP leadership guiding complex transformations with precision.
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Project delivery discipline that keeps milestones, dependencies, and teams aligned from kickoff to closeout.
                        </p>
                      </div>
                    </div>
                    <img
                      src={certificationPmpBadge}
                      alt="PMP certification badge"
                      className="h-20 w-auto rounded-lg border border-white/50 bg-white/70 p-2 shadow-sm"
                    />
                  </li>
                  <li className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                      <div className="space-y-2">
                        <span className="block text-base leading-relaxed text-foreground/90">
                          SHRM-CP professional and certified mediator.
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Recognized expertise that balances people advocacy with mediation skills to move complex conversations forward.
                        </p>
                      </div>
                    </div>
                    <img
                      src={certificationFullBadge}
                      alt="SHRM-CP certification badge"
                      className="h-20 w-auto rounded-lg border border-white/50 bg-white/70 p-2 shadow-sm"
                    />
                  </li>
                  <li className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-base leading-relaxed text-foreground/90">
                      Coming soon, the Linque Talent framework aligning strategy, people, and technology.
                    </span>
                  </li>
                </ul>
              <div className="mt-10 flex justify-center">
                <Button asChild size="lg">
                  <Link to="/contact#contact-form">Work With Us</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="mb-16 text-center">
              <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide everything we do
              </p>
            </AnimatedSection>

            <div className="space-y-6">
              {[
                {
                  title: "Strategic Partnership",
                  description: "We work as an extension of your team, deeply invested in your success.",
                },
                {
                  title: "People-Centered Approach",
                  description: "Every solution we create puts people first, recognizing that your workforce is your greatest asset.",
                },
                {
                  title: "Data-Driven Excellence",
                  description: "We leverage insights and analytics to inform our strategies and measure impact.",
                },
                {
                  title: "Continuous Innovation",
                  description: "We stay ahead of industry trends, bringing you the latest in HR technology and best practices.",
                },
                {
                  title: "Lasting Impact",
                  description: "We focus on sustainable solutions that deliver long-term value and transformation.",
                },
              ].map((value, index) => (
                <AnimatedSection key={index} animation="slide-in-left" delay={index * 100}>
                  <div className="flex gap-6 items-start p-6 rounded-2xl hover:bg-muted/50 transition-all duration-300 group">
                    <CheckCircle className="w-7 h-7 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
