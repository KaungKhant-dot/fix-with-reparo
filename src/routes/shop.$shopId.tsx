import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Clock, CreditCard, MapPin, Phone, Star, Wrench } from "lucide-react";
import { useShop } from "@/lib/repair-data";
import { categoryShopLabels, type CategorySlug } from "@/lib/shops";
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
  const [userReviews, setUserReviews] = useState<Review[]>([]);



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
            <p className="mt-1 text-xs text-muted-foreground">
              {categoryShopLabels[shop.category] ?? shop.categoryLabel}
            </p>
          </div>
          <StatusPill available={shop.available} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1 font-semibold">
            {shop.rating}
            <Star className="size-3.5 fill-accent text-accent" />
            {shop.reviews && (
              <span className="font-normal text-muted-foreground">
                ({Number(shop.reviews) + userReviews.length} သုံးသပ်ချက်)
              </span>
            )}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5" />
            {shop.distance} အကွာ
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
            <h2 className="text-sm font-bold">ဝန်ဆောင်မှုများ</h2>
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
          <h2 className="text-sm font-bold">ဆိုင်အချက်အလက်</h2>
          <InfoRow Icon={MapPin} label="လိပ်စာ" value={shop.address} />
          {shop.hours && <InfoRow Icon={Clock} label="ဖွင့်ချိန်" value={shop.hours} />}
          <InfoRow Icon={Phone} label="ဖုန်း" value={shop.phone} />
          {shop.paymentMethods && (
            <InfoRow Icon={CreditCard} label="ငွေပေးချေမှု" value={shop.paymentMethods} />
          )}
        </section>

        <ReviewsSection
          category={shop.category}
          userReviews={userReviews}
          onSubmit={(review) => setUserReviews((prev) => [review, ...prev])}
        />

        <a
          href={`tel:${shop.phone.replace(/\s/g, "")}`}
          className="btn-pill btn-primary mt-8 w-full"
        >
          <Phone className="size-4" />
          ဆိုင်ကို ဖုန်းဆက်မည်
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

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        i < stars ? (
          <Star key={i} className="size-4 fill-accent text-accent" />
        ) : (
          <Star key={i} className="size-4 text-muted-foreground" />
        ),
      )}
    </div>
  );
}

type Review = {
  text: string;
  time: string;
  stars: number;
};

const categoryReviews: Record<CategorySlug, Review[]> = {
  bag: [
    {
      text: "ဇစ်ခေါင်းလဲတာ မိနစ်ပိုင်းပဲကြာတယ်၊ အိတ်က အသစ်လိုဖြစ်သွားရော။",
      time: "1 week ago",
      stars: 5,
    },
    {
      text: "သားရေအိတ် အစွန်းတွေကို သေချာဆေးပေးတယ်၊ ဈေးလည်း သင့်ပါတယ်။",
      time: "2 weeks ago",
      stars: 4,
    },
  ],
  clothes: [
    {
      text: "အင်္ကျီချုပ်ရိုးပြေတာကို သေသပ်အောင် ပြန်ချုပ်ပေးတယ်။",
      time: "1 week ago",
      stars: 5,
    },
    {
      text: "ချုပ်ရိုးတွေ တည့်တည့်မတ်မတ် ချုပ်ပေးတယ်။",
      time: "2 weeks ago",
      stars: 5,
    },
  ],
  watches: [
    {
      text: "နာရီလက်တံ ညှိတာ ချက်ချင်းပြီးတယ်။",
      time: "1 week ago",
      stars: 5,
    },
    {
      text: "ကိုယ့်မျက်စိရှေ့တင် ဓာတ်ခဲအသစ်သုံးပေးတယ်။ စိတ်ချရတယ်။",
      time: "2 weeks ago",
      stars: 4,
    },
  ],
  shoes: [
    {
      text: "ဖိနပ်ဖဝါး(ဖိနပ်ခွာ) အသစ်လဲလိုက်တာ လမ်းလျှောက်ရတာ အရမ်းသက်သာသွားတယ်။",
      time: "1 week ago",
      stars: 5,
    },
    {
      text: "ကော်ကပ်တာ အရမ်းသေသပ်တယ်၊ မကွာတော့ဘူး။ ဘယ်အချိန်ပြီးမယ် အချိန်အတိအကျ ပြောပေးတော့ ကျနော့်အတွက် အဆင်ပြေတယ်။",
      time: "2 weeks ago",
      stars: 4,
    },
  ],
  keys: [
    {
      text: "သော့ နဲ့ ပတ်သက်တဲ့ ပြဿနာ‌တွေ ချက်ချင်း‌ဖြေရှင်းနိုင်တယ်။ ဆိုင်ပိုင်ရှင်ကလဲ ယဉ်ကျေးပြီး ဝန်ဆောင်မှုကောင်းတယ်।",
      time: "1 week ago",
      stars: 5,
    },
    {
      text: "သော့အိမ်က သံချေးတက်နေတာကို အကောင်းအတိုင်း ပြန်သုံးနိုင်‌အောင် ပြင်ပေးသွားတယ်။",
      time: "2 weeks ago",
      stars: 5,
    },
  ],
  glasses: [
    {
      text: "မျက်မှန်ဘောင်ကို သေချာညှိပေးသွားတယ်။",
      time: "1 week ago",
      stars: 5,
    },
    {
      text: "မျက်မှန်ကိုင်းဝက်အူအသစ်လဲတာ ချက်ချင်းပြီးတယ်။",
      time: "2 weeks ago",
      stars: 4,
    },
  ],
};

function ReviewsSection({
  category,
  userReviews,
  onSubmit,
}: {
  category: CategorySlug;
  userReviews: Review[];
  onSubmit: (review: Review) => void;
}) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const reviews = [...userReviews, ...(categoryReviews[category] ?? [])];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stars < 1) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!text.trim()) {
      toast.error("Please write your review.");
      return;
    }
    onSubmit({ text: text.trim(), time: "Just now", stars });
    setStars(0);
    setText("");
    toast.success("Review submitted successfully.");
  }

  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-sm font-bold">ဖောက်သည် သုံးသပ်ချက်များ</h2>

      <form onSubmit={handleSubmit} className="card-soft space-y-3 rounded-2xl p-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1} star`}
              onClick={() => setStars(i + 1)}
              className="p-0.5"
            >
              <Star
                className={`size-6 ${i < stars ? "fill-accent text-accent" : "text-muted-foreground"}`}
              />
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review..."
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button type="submit" className="btn-pill btn-primary w-full">
          Submit Review
        </button>
      </form>

      <div className="space-y-3">
        {reviews.map((review, index) => (
          <div key={index} className="card-soft space-y-2 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Verified Customer</p>
              <StarRating stars={review.stars} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{review.text}</p>
            <p className="text-xs text-muted-foreground">{review.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
