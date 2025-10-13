import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AnimatedSection from "@/components/AnimatedSection";
import ScribbleHighlight from "@/components/ScribbleHighlight";
import Seo from "@/components/Seo";
import { buildCanonicalUrl } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, CalendarDays, Loader2, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email address."),
  company: z.string().min(2, "Share your company or organization."),
  message: z.string().min(12, "Let us know how we can help."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const canonicalUrl = useMemo(() => buildCanonicalUrl("/contact"), []);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const scheduleUrl = import.meta.env.VITE_SCHEDULER_URL ?? "https://calendly.com/o-ismailalabi-linqueresourcing/30min-1";
  const discoveryUrl =
    import.meta.env.VITE_DISCOVERY_CALL_URL ?? "https://calendly.com/o-ismailalabi-linqueresourcing/30min-1";
  const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

  const onSubmit = async (values: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      if (contactEndpoint) {
        const response = await fetch(contactEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }
      } else {
        // Simulate latency to keep the micro-interaction consistent.
        await new Promise((resolve) => setTimeout(resolve, 650));
      }

      toast({
        title: "Message sent",
        description: "Thanks for reaching out! A Linque consultant will reply within one business day.",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to send message",
        description: "Please try again or email info@linqueresourcing.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Contact Linque Resourcing"
        description="Connect with Linque Resourcing to discuss strategic HR support, talent solutions, and people operations partnerships."
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: "Contact Linque Resourcing",
          description:
            "Schedule a call to explore strategic HR consulting, talent acquisition, or fractional support with Linque Resourcing.",
          url: canonicalUrl,
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: canonicalUrl,
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+1-713-379-6630",
              contactType: "customer service",
              email: "info@linqueresourcing.com",
              areaServed: "US",
              availableLanguage: ["English"],
            },
          ],
        }}
      />

      <section className="relative overflow-hidden bg-gradient-subtle pb-16 pt-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-in-up" className="max-w-3xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Work with Linque
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Let&apos;s design the people experience your{" "}
              <ScribbleHighlight>organization deserves</ScribbleHighlight>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Share a few details and our team will tailor next steps for your goals. We typically respond within one
              business day.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                  <CalendarDays className="mr-2 h-5 w-5" aria-hidden="true" />
                  Schedule a Call
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={discoveryUrl} target="_blank" rel="noreferrer noopener">
                  Discovery Call
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <AnimatedSection animation="fade-in-up" className="rounded-3xl border border-muted/60 bg-white/90 p-8 shadow-card" id="contact-form">
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full name
                  </label>
                  <Input
                    id="name"
                    placeholder="Jordan Lee"
                    aria-invalid={!!form.formState.errors.name}
                    aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p id="name-error" role="alert" className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Work email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p id="email-error" role="alert" className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-foreground">
                      Company
                    </label>
                    <Input
                      id="company"
                      placeholder="Linque Resourcing"
                      aria-invalid={!!form.formState.errors.company}
                      aria-describedby={form.formState.errors.company ? "company-error" : undefined}
                      {...form.register("company")}
                    />
                    {form.formState.errors.company && (
                      <p id="company-error" role="alert" className="text-sm text-destructive">
                        {form.formState.errors.company.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    How can we partner together?
                  </label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your current priorities, timeline, or the outcomes you’re targeting."
                    aria-invalid={!!form.formState.errors.message}
                    aria-describedby={form.formState.errors.message ? "message-error" : undefined}
                    {...form.register("message")}
                  />
                  {form.formState.errors.message && (
                    <p id="message-error" role="alert" className="text-sm text-destructive">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending
                    </span>
                  ) : (
                    "Send message"
                  )}
                </Button>
              </form>
            </AnimatedSection>

            <AnimatedSection animation="fade-in-up" delay={80} className="space-y-6">
              <Card className="border-none bg-muted/40 shadow-card">
                <CardContent className="space-y-6 pt-8">
                  <h2 className="text-2xl font-semibold text-foreground">How we support you</h2>
                  <p className="text-muted-foreground">
                    Share a project, ongoing HR need, or upcoming transformation. We tailor every engagement to your
                    people, culture, and operational realities.
                  </p>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary">•</span>
                      Advisory for transformation, M&A, and strategic planning
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary">•</span>
                      Fractional HR, talent, and operations leadership
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary">•</span>
                      Talent acquisition, recruitment marketing, and onboarding
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="rounded-3xl border border-muted/60 bg-gradient-to-br from-background to-muted/40 p-8 shadow-card">
                <h3 className="text-lg font-semibold text-foreground">Contact information</h3>
                <div className="mt-6 space-y-5 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-primary/10 p-2 text-primary">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <a
                        href="mailto:info@linqueresourcing.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        info@linqueresourcing.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-primary/10 p-2 text-primary">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">Phone</p>
                      <a href="tel:+17133796630" className="text-muted-foreground hover:text-primary transition-colors">
                        +1 (713) 379-6630
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-primary/10 p-2 text-primary">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p>Remote-first with national coverage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-primary/10 p-2 text-primary">
                      <Linkedin className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">LinkedIn</p>
                      <a
                        href="https://www.linkedin.com/company/linque-resourcing"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Linque Resourcing
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="rounded-3xl border border-muted/60 bg-white/90 p-10 shadow-card">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Looking for a quick consultation?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reserve time directly on our calendar to assess your needs or explore fractional support.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href={scheduleUrl} target="_blank" rel="noreferrer noopener">
                    Schedule a Call
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={discoveryUrl} target="_blank" rel="noreferrer noopener">
                    Discovery Call
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Contact;
