import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";

const LogoCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  // Placeholder logos - in production these would be actual partner logos
  const partners = [
    { name: "Partner 1", color: "from-blue-500 to-purple-500" },
    { name: "Partner 2", color: "from-purple-500 to-pink-500" },
    { name: "Partner 3", color: "from-blue-400 to-cyan-400" },
    { name: "Partner 4", color: "from-indigo-500 to-blue-500" },
    { name: "Partner 5", color: "from-violet-500 to-purple-500" },
    { name: "Partner 6", color: "from-blue-600 to-indigo-600" },
  ];

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-8">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="flex-[0_0_200px] min-w-0"
          >
            <div className={`h-24 rounded-lg bg-gradient-to-br ${partner.color} opacity-20 flex items-center justify-center`}>
              <span className="text-white font-semibold opacity-50">{partner.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;
