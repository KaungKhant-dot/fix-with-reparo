import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Star } from "lucide-react";
import { categoryShopLabels, type Shop } from "@/lib/shops";

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      to="/shop/$shopId"
      params={{ shopId: shop.id }}
      className="card-soft flex gap-3 p-3 transition-transform active:scale-[0.99]"
    >
      <img
        src={shop.image}
        alt={shop.name}
        loading="lazy"
        width={512}
        height={512}
        className="size-24 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-bold">{shop.name}</h3>
          <StatusPill available={shop.available} />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {shop.categoryLabel} Repair{shop.desc ? ` · ${shop.desc}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1 font-semibold">
            {shop.rating}
            <Star className="size-3.5 fill-accent text-accent" />
            {shop.reviews && (
              <span className="font-normal text-muted-foreground">({shop.reviews} reviews)</span>
            )}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5" />
            {shop.distance}
          </span>
          {shop.hours && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3.5" />
              {shop.hours}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function StatusPill({ available }: { available: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
        available
          ? "bg-success-soft text-success-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <span className={`size-1.5 rounded-full ${available ? "bg-success" : "bg-muted-foreground"}`} />
      {available ? "Available" : "Closed"}
    </span>
  );
}
