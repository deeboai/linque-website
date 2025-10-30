import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, TrendingUp, Award, ClipboardList } from "lucide-react";
import heroVideo from "@/assets/YTDown.com_YouTube_Office-Stock-Footage-People-Working-As-A_Media_TUvpL_Hx0is_001_1080p.mp4";
import promoVideo from "@/assets/website_final.mp4";
import heroFallbackImage from "@/assets/hero-team-DOfHooPV.jpg";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import { useState, useEffect, useRef } from "react";

const CredlyBadge = ({ badgeId }: { badgeId: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.innerHTML = "";

    const badgeRoot = document.createElement("div");
    badgeRoot.setAttribute("data-iframe-width", "150");
    badgeRoot.setAttribute("data-iframe-height", "270");
    badgeRoot.setAttribute("data-share-badge-id", badgeId);
    badgeRoot.setAttribute("data-share-badge-host", "https://www.credly.com");
    container.appendChild(badgeRoot);

    const script = document.createElement("script");
    script.src = "https://cdn.credly.com/assets/utilities/embed.js";
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [badgeId]);

  return <div ref={containerRef} className="mx-auto w-[150px]" />;
};

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [isPromoVideoAvailable, setIsPromoVideoAvailable] = useState(true);
  const scheduleUrl =
    import.meta.env.VITE_SCHEDULER_URL ??
    "https://calendly.com/o-ismailalabi-linqueresourcing/30min-1";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const impactParagraphs = [
    "At Linque Resourcing, we understand that people are the heart of any organization, and our mission is to empower businesses to thrive by optimizing their most valuable asset: their workforce. With a team of seasoned professionals, we bring together 20 years of industry experience and offer comprehensive consulting services tailored to meet the unique needs of your organization. What sets us apart is our commitment to forging strong, lasting partnerships with our clients. We don't just provide solutions; we create impact by collaborating with you to understand your challenges and goals, ensuring that our strategies align with your organizational vision.",
  ];
  const impactHighlight = "People-first partnerships that transform teams, strengthen culture, and accelerate results.";
  const impactQuestion = "Are you ready to embark on a journey to cultivate a workplace where talent thrives, businesses flourish, and visions become reality?";
  const impactClosing = "Let us be your link to smarter people solutions!";

  const valuePropositions = [
    {
      icon: Users,
      title: "20+ Years Experience",
      description: "Industry-leading expertise in talent management solutions.",
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
    {
      icon: ClipboardList,
      title: "Project Management Excellence",
      description: "Certified in PMP and Scrum, we bring structure, clarity, and accountability to every engagement, delivering on time and within scope.",
      delay: 400,
      centerContent: true,
      credlyBadgeId: "e05ac079-ad47-4984-9fd5-ec6269232b92",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 z-0 parallax-bg overflow-hidden"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img
            src={heroFallbackImage}
            alt="Linque Resourcing team collaborating in an office"
            className="h-full w-full object-cover"
            loading="eager"
            aria-hidden={shouldShowVideo}
          />
          {shouldShowVideo && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={heroFallbackImage}
              onError={() => setShouldShowVideo(false)}
            >
              <source
                src={heroVideo}
                type="video/mp4"
              />
            </video>
          )}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(rgba(36, 37, 76, 0.9), rgba(52, 38, 105, 0.82))",
            }}
          />
        </div>

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

      {/* Video Section */}
      <AnimatedSection animation="fade-in">
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                Discover What We Do
              </h2>
              <p className="text-center text-muted-foreground mb-12 text-lg">
                See how we're creating value for businesses worldwide
              </p>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/30 bg-muted shadow-elegant hover-lift transition-all duration-500 hover:shadow-glow">
                {isPromoVideoAvailable ? (
                  <video
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster={heroFallbackImage}
                    onError={() => setIsPromoVideoAvailable(false)}
                  >
                    <source src={promoVideo} type="video/mp4" />
                  </video>
                ) : (
                  <>
                    <img
                      src={heroFallbackImage}
                      alt="Linque Resourcing consultants collaborating"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 text-center text-muted-foreground">
                      <p className="text-base font-semibold">Promo video currently unavailable</p>
                      <p className="text-sm mt-2 max-w-xs">
                        Check back soon to learn more about how we transform people operations.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Our Impact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mb-12 text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Our Impact</h2>
            <p className="text-lg md:text-xl text-foreground/80 italic">
              {impactHighlight}
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" className="max-w-4xl mx-auto space-y-6 text-center">
            {impactParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg md:text-xl leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            ))}
            <p className="text-lg md:text-xl leading-relaxed text-foreground/90">
              {impactQuestion}
            </p>
            <p className="text-lg md:text-xl font-semibold leading-relaxed text-foreground">
              {impactClosing}
            </p>
          </AnimatedSection>
        </div>
      </section>

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

          <div className="grid gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valuePropositions.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <AnimatedSection key={item.title} animation="fade-in-up" delay={item.delay}>
                    <Card className="group h-full border-none bg-gradient-to-br from-background to-muted/20 shadow-card transition-all duration-500 hover:shadow-elegant hover-lift">
                      <CardContent className="flex flex-col gap-4 items-start px-6 pb-6 pt-8 text-left">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>

            <AnimatedSection animation="fade-in-up" delay={valuePropositions[4].delay}>
              <Card className="group border-none bg-gradient-to-br from-background to-muted/20 shadow-card transition-all duration-500 hover:shadow-elegant hover-lift">
                <CardContent className="flex flex-col gap-6 px-6 pb-6 pt-8 md:flex-row md:items-center md:justify-between">
                  <div className="flex w-full flex-col items-center gap-4 text-center md:max-w-xl md:items-start md:text-left md:flex-1">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero transition-transform duration-300 group-hover:scale-110">
                      <ClipboardList className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{valuePropositions[4].title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{valuePropositions[4].description}</p>
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <CredlyBadge badgeId={valuePropositions[4].credlyBadgeId} />
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>


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
