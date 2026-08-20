import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  Footprints,
  Shirt,
  ShoppingBag,
  TicketPercent,
  Truck,
  Watch,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { banners, type BannerSlide, type BannerStyle } from "@/lib/banners";

const iconSets: Record<
  BannerStyle,
  Array<React.ComponentType<{ className?: string }>>
> = {
  service: [ShoppingBag, Footprints, Watch, Shirt],
  promo: [TicketPercent],
  delivery: [Truck],
};

function BannerSlideVisual({ style }: { style: BannerStyle }) {
  const icons = iconSets[style];

  if (style === "service") {
    return (
      <div className="grid shrink-0 grid-cols-2 gap-1.5">
        {icons.map((Icon, i) => (
          <span
            key={i}
            className="flex size-9 items-center justify-center rounded-full bg-white/15 text-primary-foreground"
          >
            <Icon className="size-4" />
          </span>
        ))}
      </div>
    );
  }

  const Icon = icons[0]!;
  const accent = style === "promo";

  return (
    <span
      className={cn(
        "flex size-14 shrink-0 items-center justify-center rounded-full",
        accent
          ? "bg-accent text-accent-foreground"
          : "bg-white/15 text-primary-foreground",
      )}
    >
      <Icon className="size-7" />
    </span>
  );
}

function BannerSlideCard({ banner }: { banner: BannerSlide }) {
  return (
    <div
      className={cn(
        "hero-panel relative flex aspect-[16/10] items-center justify-between gap-4 overflow-hidden rounded-2xl px-5 py-4 text-primary-foreground shadow-[var(--shadow-card)]",
      )}
    >
      <div className="flex min-w-0 flex-col gap-2">
        {banner.badge && (
          <span className="w-fit rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
            {banner.badge}
          </span>
        )}
        <h3 className="text-lg font-bold leading-tight">{banner.title}</h3>
        <p className="text-xs leading-snug opacity-85">{banner.subtitle}</p>
        <Link
          to={banner.cta.to}
          className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-foreground px-4 py-2 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-white/90"
        >
          {banner.cta.label}
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <BannerSlideVisual style={banner.style} />
    </div>
  );
}

export function BannerCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false }),
  ).current;

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const pause = () => autoplay.stop();
  const resume = () => autoplay.play();

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="pl-0">
              <BannerSlideCard banner={banner} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                current === i
                  ? "w-4 bg-primary-foreground"
                  : "w-1.5 bg-primary-foreground/50",
              )}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
