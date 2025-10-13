import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, CheckCircle } from "lucide-react";
import aboutImage from "@/assets/priscilla-du-preez-nNMBa7Y1Ymk-unsplash.webp";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
        <AnimatedSection className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <ScribbleHighlight>Us</ScribbleHighlight>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Linque Resourcing is a people-first consultancy helping organizations design, build, and scale strategic HR
              functions that unlock performance.
            </p>
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
                    With more than <span className="font-semibold text-primary">two decades of experience</span>, Linque
                    Resourcing partners with executives and HR leaders to architect people strategies that accelerate
                    growth. We combine enterprise HR leadership, PMP-certified program expertise, and a practical approach
                    to transformation so every engagement is grounded in execution.
                  </p>
                  <p>
                    Our team has supported organizations spanning energy, technology, nonprofit, healthcare, and
                    professional services. That breadth of industry insight helps us adapt quickly to your operating
                    realities while introducing best practices that deliver measurable results.
                  </p>
                  <p>
                    From strategic planning to fractional HR leadership, we stay alongside you to ensure strategies are
                    adopted, teams are enabled, and the people experience reflects your brand.
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
                  {[
                    "20+ years leading people strategy and operations across growth stages.",
                    "Certified PMP leadership guiding complex transformations with precision.",
                    "Experience across public, private, nonprofit, and international sectors.",
                    "Dedicated consultants embedded with your teams for continuity.",
                    "Tailored solutions that reflect your culture, pace, and goals.",
                    "The Linque Talent framework aligning strategy, people, and technology.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                      <span className="text-base leading-relaxed text-foreground/90">{item}</span>
                    </li>
                ))}
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
