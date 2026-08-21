import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ComponentType } from "react";
import {
  ArrowRight,
  Bell,
  Briefcase,
  Footprints,
  Glasses,
  KeyRound,
  MapPin,
  Scissors,
  Search,
  Shirt,
  Sparkles,
  Watch,
} from "lucide-react";
import { BannerCarousel } from "@/components/BannerCarousel";
import { BottomNav } from "@/components/BottomNav";
import { SponsoredShops } from "@/components/SponsoredShops";
import { ShopCard } from "@/components/ShopCard";
import { FilterBar } from "@/components/FilterBar";
import { ShopListSkeleton } from "@/components/ShopListSkeleton";
import { useCategories, useShops } from "@/lib/repair-data";
import { frequentSearches } from "@/lib/shops";
import { useAuth } from "@/lib/use-auth";
import { usePublishedNotices } from "@/lib/admin-store";


export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your Repair Home | Reparo" },
      {
        name: "description",
        content:
          "Browse repair categories and nearby trusted shops for bags, clothes, watches, shoes, keys and glasses.",
      },
      { property: "og:title", content: "Your Repair Home | Reparo" },
      {
        property: "og:description",
        content: "Browse categories and nearby trusted repair shops on Reparo.",
      },
    ],
  }),
  component: HomeScreen,
});

type IconType = ComponentType<{ className?: string }>;

const categoryIcons: Record<string, IconType> = {
  bag: Briefcase,
  clothes: Shirt,
  watches: Watch,
  shoes: Footprints,
  keys: KeyRound,
  glasses: Glasses,
};

const frequentIcons: IconType[] = [Scissors, Footprints, Watch, Shirt, KeyRound, Glasses];

function HomeScreen() {
  const navigate = useNavigate();
  const { fullName } = useAuth();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("nearest");


  const notices = usePublishedNotices();
  const { data: categories = [] } = useCategories();
  const { shops, isLoading, offline } = useShops({ category, sort });
  const nearby = shops.slice(0, 6);

  const submit = (q: string) => {
    setFocused(false);
    navigate({ to: "/search", search: { q, category: "all", sort: "none" } });
  };

  return (
    <div className="app-shell relative pb-28">
      <header className="hero-panel rounded-b-3xl px-6 pb-8 pt-8 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80">Good morning 👋</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Hello, {fullName || "User"}!</h1>

            <p className="mt-1 flex items-center gap-1 text-xs opacity-75">
              <MapPin className="size-3.5" />
              Mandalay&nbsp;
            </p>
          </div>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative flex size-10 items-center justify-center rounded-full bg-primary-foreground/10"
          >
            <Bell className="size-5" />
            {notices.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {notices.length}
              </span>
            )}
          </Link>
        </div>

        <div className="relative mt-6">
          <div className="flex items-center gap-3 rounded-full bg-card px-4 py-3.5 shadow-[var(--shadow-card)]">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => window.setTimeout(() => setFocused(false), 120)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(query);
              }}
              placeholder="What do you need to repair?"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {focused && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-2xl bg-card p-3 text-foreground shadow-[var(--shadow-card)]">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Frequently Searched
              </p>
              <ul className="space-y-1">
                {frequentSearches.map((item, i) => {
                  const Icon = frequentIcons[i] ?? Search;
                  return (
                    <li key={item.label}>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => submit(item.query)}
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-sm hover:bg-secondary"
                      >
                        <span className="flex size-8 items-center justify-center rounded-full bg-secondary">
                          <Icon className="size-4 text-secondary-foreground" />
                        </span>
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </header>

      <main className="px-6">
        <section className="mt-8">
          <h2 className="text-base font-bold">Categories</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {categories.map(({ label, slug }) => {
              const Icon = categoryIcons[slug] ?? Sparkles;
              return (
              <Link
                key={slug}
                to="/search"
                search={{ q: "", category: slug, sort: "none" }}
                className="card-soft flex flex-col items-center gap-2 px-2 py-5"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary">
                  <Icon className="size-5 text-secondary-foreground" />
                </span>
                <span className="text-center text-xs font-medium">{label}</span>
              </Link>
              );
            })}
          </div>
        </section>

        <SponsoredShops />

        <section className="mt-6" aria-label="Promotions">
          <BannerCarousel />
        </section>

        <Link
          to="/ai"
          className="ai-panel mt-6 flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left text-primary-foreground shadow-[var(--shadow-card)]"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent">
            <Sparkles className="size-5 text-accent-foreground" />
          </span>
          <span className="flex-1">
            <span className="block font-bold">Ask Reparo AI</span>
            <span className="block text-xs opacity-80">
              Describe the problem — we'll find the right specialist.
            </span>
          </span>
          <ArrowRight className="size-5 opacity-90" />
        </Link>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Nearby Repair Shops</h2>
            <Link
              to="/search"
              search={{ q: "", category, sort }}
              className="text-xs font-medium text-muted-foreground"
            >
              See all
            </Link>
          </div>

          <div className="mt-4">
            <FilterBar
              category={category}
              sort={sort}
              onCategoryChange={setCategory}
              onSortChange={setSort}
            />
          </div>

          <div className="mt-4 space-y-4">
            {offline && (
              <p className="text-xs text-muted-foreground">
                Offline — showing saved shops.
              </p>
            )}
            {isLoading ? (
              <ShopListSkeleton />
            ) : (
              <>
                {nearby.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
                {nearby.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No shops match these filters right now.
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
