import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const testimonials = [
    {
      quote: "Linque Resourcing transformed our HR operations completely. Their strategic approach and attention to detail made all the difference.",
      author: "Sarah Johnson",
      role: "CEO, Tech Solutions Inc.",
    },
    {
      quote: "The talent acquisition services exceeded our expectations. They found us the perfect candidates in record time.",
      author: "Michael Chen",
      role: "HR Director, Global Enterprises",
    },
    {
      quote: "Their HR technology solutions streamlined our processes and saved us countless hours. Highly recommended!",
      author: "Emily Rodriguez",
      role: "COO, Innovation Labs",
    },
  ];

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
              <Card className="shadow-elegant border-none bg-gradient-to-br from-background to-muted/30">
                <CardContent className="pt-12 pb-8 px-8">
                  <Quote className="w-12 h-12 text-primary/30 mb-6" />
                  <p className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-lg">{testimonial.author}</p>
                    <p className="text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full hover-lift"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="rounded-full hover-lift"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
