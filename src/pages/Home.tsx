import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, TrendingUp, Award } from "lucide-react";
import heroImage from "@/assets/hero-team.jpg";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import AnimatedCounter from "@/components/AnimatedCounter";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { useState, useEffect } from "react";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const scheduleUrl =
    import.meta.env.VITE_SCHEDULER_URL ??
    "https://calendly.com/o-ismailalabi-linqueresourcing/30min-1";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 z-0 parallax-bg"
          style={{
            backgroundImage: `linear-gradient(rgba(36, 37, 76, 0.9), rgba(52, 38, 105, 0.82)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 z-[1]" />

        <div className="container mx-auto px-4 z-10 text-center text-white relative">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Link to <ScribbleHighlight>Smarter</ScribbleHighlight>
              <br />People Solutions
            </h1>
          </div>

          <p
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in-up leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            We assist our clients with creating long-term impactful people solutions and strategies
            that help maximize their potential and meet their business needs.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 hover-lift shadow-elegant text-base px-8"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover-lift shadow-elegant text-base px-8"
            >
              <Link to="/services">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedSection>
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { value: 20, suffix: "+", label: "Years Experience" },
                { value: 500, suffix: "+", label: "Clients Served" },
                { value: 1000, suffix: "+", label: "Placements Made" },
                { value: 98, suffix: "%", label: "Success Rate" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Video Section */}
      <AnimatedSection animation="fade-in">
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                Discover What We Do
              </h2>
              <p className="text-center text-muted-foreground mb-12 text-lg">
                See how we're transforming HR for businesses worldwide
              </p>
              <div className="aspect-video bg-muted rounded-2xl shadow-elegant flex items-center justify-center hover-lift transition-all duration-500 hover:shadow-glow">
                <p className="text-muted-foreground">Promo video coming soon</p>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Value Propositions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <ScribbleHighlight color="accent">Linque</ScribbleHighlight>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry-leading expertise meets innovative solutions
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "20+ Years Experience",
                description: "Industry-leading expertise in HR consulting and talent solutions.",
                delay: 0,
              },
              {
                icon: Target,
                title: "Strategic Approach",
                description: "Data-driven solutions aligned with your business goals.",
                delay: 100,
              },
              {
                icon: TrendingUp,
                title: "Lasting Impact",
                description: "People-centered strategies that drive sustainable growth.",
                delay: 200,
              },
              {
                icon: Award,
                title: "Proven Results",
                description: "Trusted by organizations to build thriving workplaces.",
                delay: 300,
              },
            ].map((item, index) => (
              <AnimatedSection key={index} animation="fade-in-up" delay={item.delay}>
                <Card className="h-full shadow-card hover:shadow-elegant transition-all duration-500 hover-lift group border-none bg-gradient-to-br from-background to-muted/20">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <AnimatedSection>
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">
              Trusted by Leading Organizations
            </h3>
            <LogoCarousel />
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                What Our Clients Say
              </h2>
              <p className="text-center text-muted-foreground mb-12 text-lg">
                Real results from real partnerships
              </p>
              <TestimonialCarousel />
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-24 bg-gradient-hero text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-mesh" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Workforce?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Let's discuss how we can help you build strategic people solutions that elevate your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 hover-lift shadow-elegant text-base px-8"
              >
                <Link to="/contact#contact-form">Find Talent</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover-lift shadow-elegant text-base px-8"
              >
                <Link to="/contact">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <section className="bg-muted/40 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/"
              className="text-2xl font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Linque Resourcing
            </Link>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-secondary/80"
            >
              <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                Schedule a Call
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
