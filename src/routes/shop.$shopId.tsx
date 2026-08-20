import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, CreditCard, MapPin, Phone, Star, Wrench } from "lucide-react";
import { useShop } from "@/lib/repair-data";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ShopCard";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/shop/$shopId")({
  head: () => ({
    meta: [
      { title: "Shop Details | Reparo" },
      {
        name: "description",
        content: "See services, ratings, payment methods and contact details for this repair shop.",
      },
      { property: "og:title", content: "Shop Details | Reparo" },
      {
        property: "og:description",
        content: "Services, ratings, payment methods and contact details for trusted repair shops.",
      },
    ],
  }),
  component: ShopDetails,
});

function ShopDetails() {
  const { shopId } = Route.useParams();
  const { data: shop, isLoading } = useShop(shopId);


  if (isLoading && !shop) {
    return (
      <div className="app-shell space-y-4 p-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="app-shell flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <p className="text-sm text-muted-foreground">This shop is no longer listed.</p>
        <Link to="/home" className="btn-pill btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="app-shell relative pb-32">
      <div className="relative">
        <img
          src={shop.image}
          alt={shop.name}
          width={512}
          height={512}
          className="h-56 w-full object-cover"
        />
        <Link
          to="/home"
          aria-label="Back"
          className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-card shadow-[var(--shadow-soft)]"
        >
          <ArrowLeft className="size-5" />
        </Link>
      </div>

      <main className="-mt-6 rounded-t-3xl bg-background px-6 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{shop.name}</h1>
            <p className="mt-1 text-xs text-muted-foreground">{shop.categoryLabel} Repair</p>
          </div>
          <StatusPill available={shop.available} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1 font-semibold">
            {shop.rating}
            <Star className="size-3.5 fill-accent text-accent" />
            {shop.reviews && (
              <span className="font-normal text-muted-foreground">({shop.reviews} reviews)</span>
            )}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5" />
            {shop.distance} away
          </span>
          {shop.hours && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3.5" />
              {shop.hours}
            </span>
          )}
        </div>

        {shop.paymentMethods && (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
            <CreditCard className="size-3.5" />
            {shop.paymentMethods}
          </span>
        )}

        {shop.desc && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{shop.desc}</p>
        )}

        {shop.services.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold">Services</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {shop.services.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                >
                  <Wrench className="size-3" />
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 space-y-3">
          <h2 className="text-sm font-bold">Shop Info</h2>
          <InfoRow Icon={MapPin} label="Address" value={shop.address} />
          <InfoRow Icon={Phone} label="Phone" value={shop.phone} />
          {shop.paymentMethods && (
            <InfoRow Icon={CreditCard} label="Payment methods" value={shop.paymentMethods} />
          )}
        </section>

        <a
          href={`tel:${shop.phone.replace(/\s/g, "")}`}
          className="btn-pill btn-primary mt-8 w-full"
        >
          <Phone className="size-4" />
          Call Shop
        </a>
      </main>

      <BottomNav active="home" />
    </div>
  );
}

function InfoRow({
  Icon,
  label,
  value,
}: {
  Icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="card-soft flex items-start gap-3 p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon className="size-4 text-secondary-foreground" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
