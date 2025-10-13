import { ImgHTMLAttributes, useEffect, useRef, useState, type SyntheticEvent } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  /**
   * Enables a lightweight parallax translate on scroll.
   * Requires a wrapper className height or aspect ratio for best results.
   */
  enableParallax?: boolean;
  /**
   * Adjust the parallax intensity. Positive numbers translate opposite scroll direction.
   */
  parallaxStrength?: number;
  /**
   * Prioritize loading (e.g., above the fold hero images).
   */
  priority?: boolean;
  /**
   * Optional tiny placeholder asset shown before the main image is in view.
   */
  placeholderSrc?: string;
}

const LazyImage = ({
  wrapperClassName,
  className,
  enableParallax = false,
  parallaxStrength = 20,
  priority = false,
  placeholderSrc,
  onLoad,
  style,
  ...imageProps
}: LazyImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "150px",
        threshold: 0.1,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!enableParallax || prefersReducedMotion) {
      return;
    }

    let animationFrame: number | null = null;

    const updateParallax = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(Math.max(rect.top / viewportHeight, -1), 1);
      const offset = progress * -parallaxStrength;
      setParallaxOffset(offset);
      animationFrame = null;
    };

    const handleScroll = () => {
      if (animationFrame != null) return;
      animationFrame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [enableParallax, parallaxStrength, prefersReducedMotion]);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={{
        transform:
          enableParallax && !prefersReducedMotion
            ? `translate3d(0, ${parallaxOffset}px, 0)`
            : undefined,
        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <img
        ref={imgRef}
        {...imageProps}
        src={isVisible ? imageProps.src : placeholderSrc ?? TRANSPARENT_PIXEL}
        data-loaded={isLoaded}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-700 ease-out",
          !isLoaded && "opacity-0 blur-sm",
          isLoaded && "opacity-100 blur-0",
          className
        )}
        style={{
          ...style,
          willChange: enableParallax && !prefersReducedMotion ? "transform" : undefined,
        }}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default LazyImage;
