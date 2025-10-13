import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, CheckCircle } from "lucide-react";
import aboutImage from "@/assets/about-team.jpg";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
        <AnimatedSection className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <ScribbleHighlight>Linque Resourcing</ScribbleHighlight>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              20+ years of industry experience delivering strategic, people-centered HR solutions.
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
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    With over <span className="font-semibold text-primary">20 years</span> of industry experience, 
                    Linque Resourcing has established itself as a trusted partner in delivering comprehensive 
                    HR solutions. We specialize in creating long-term, impactful people strategies that align 
                    with your business objectives.
                  </p>
                  <p>
                    Our approach is rooted in understanding the unique challenges and opportunities within your
                    organization. We believe that exceptional HR solutions go beyond transactional services—they're
                    about building lasting relationships and fostering environments where both people and businesses
                    thrive.
                  </p>
                  <p>
                    Through strategic consulting, innovative technology solutions, and expert talent acquisition, we
                    help organizations maximize their human capital potential and achieve sustainable growth.
                  </p>
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
                    Deliver strategic, people-centered HR solutions that align with business goals, elevate talent,
                    and drive lasting impact. We are committed to understanding your organization deeply and
                    providing solutions that create meaningful, sustainable change.
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
                    Empower organizations to build thriving workplaces where people and businesses grow together.
                    We envision a future where every organization has access to world-class HR strategies that
                    unlock their full potential and create positive impact.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
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
