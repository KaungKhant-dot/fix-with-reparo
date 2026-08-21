import { Link } from "@tanstack/react-router";
import { Megaphone, Star } from "lucide-react";
import { useShopsQuery } from "@/lib/repair-data";
import { mergeShops, useActiveAds, useAdminState } from "@/lib/admin-store";

/** Sponsored placements sold to repair shops. Clearly labelled as ads. */
export function SponsoredShops() {
  const ads = useActiveAds();
  const state = useAdminState();
  const { data: baseShops = [] } = useShopsQuery("all");
  const shops = mergeShops(baseShops, state, { customerView: true });

  const items = ads
    .map((ad) => ({ ad, shop: shops.find((s) => s.id === ad.shopId) }))
    .filter((i) => i.shop)
    .sort((a, b) => Number(b.ad.featured) - Number(a.ad.featured))
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="mt-8" aria-label="Sponsored shops">
      <div className="flex items-center gap-2">
        <Megaphone className="size-4 text-muted-foreground" />
        <h2 className="text-base font-bold">ကြော်ငြာ · Sponsored</h2>
      </div>

      <div className="mt-4 space-y-3">
        {items.map(({ ad, shop }) => (
          <Link
            key={ad.id}
            to="/shop/$shopId"
            params={{ shopId: shop!.id }}
            className="card-soft block overflow-hidden transition-transform active:scale-[0.99]"
          >
            <div className="flex gap-3 p-3">
              <img
                src={ad.imageUrl || shop!.image}
                alt={ad.title}
                loading="lazy"
                className="size-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-bold">{ad.title}</h3>
                  <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                    ကြော်ငြာ
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{shop!.name}</p>
                {ad.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ad.description}</p>
                )}
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold">
                  {shop!.rating}
                  <Star className="size-3.5 fill-accent text-accent" />
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
