import { type HTMLAttributes, ReactNode, useMemo } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  animation?: "fade-in-up" | "slide-in-left" | "slide-in-right" | "scale-in" | "fade-in";
  delay?: number;
}

const AnimatedSection = ({
  children,
  className,
  animation = "fade-in-up",
  delay = 0,
  style,
  ...rest
}: AnimatedSectionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const resolvedVisibility = prefersReducedMotion ? true : isVisible;
  const resolvedAnimation = useMemo(() => (prefersReducedMotion ? "fade-in" : animation), [animation, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out motion-safe:will-change-transform motion-safe:will-change-opacity",
        !resolvedVisibility && "opacity-0",
        resolvedVisibility && resolvedAnimation === "fade-in-up" && "animate-fade-in-up",
        resolvedVisibility && resolvedAnimation === "slide-in-left" && "animate-slide-in-left",
        resolvedVisibility && resolvedAnimation === "slide-in-right" && "animate-slide-in-right",
        resolvedVisibility && resolvedAnimation === "scale-in" && "animate-scale-in",
        resolvedVisibility && resolvedAnimation === "fade-in" && "animate-fade-in",
        className
      )}
      style={{
        transitionDelay: prefersReducedMotion ? "0ms" : `${delay}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
